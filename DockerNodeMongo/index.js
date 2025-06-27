const express = require("express");
const mongoose = require("mongoose");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Connect to MongoDB container
mongoose.connect("mongodb://mongo:27017/docker-node-mongo", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB connection error:", err));

const BookModel = require("./book_schema.js");

function uniqueid(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/*
In Postman use:
POST http://localhost:5000/addbook
{
  "title": "1984",
  "author": "George Orwell",
  "available": true
}
*/
app.post("/addbook", (req, res) => {
  console.log("INSIDE ADD BOOK API");
  const book = new BookModel({
    id: uniqueid(1000, 9999),
    title: req.body.title,
    author: req.body.author,
    available: req.body.available
  });

  book.save()
    .then(doc => res.status(200).send("BOOK ADDED TO MONGODB"))
    .catch(err => res.status(500).send({ message: err.message || "Error in saving book" }));
});

/*
DELETE http://localhost:5000/removebook/1
*/
app.delete("/removebook/:bookid", (req, res) => {
  console.log("INSIDE REMOVE BOOK API");
  BookModel.findOneAndDelete({ id: parseInt(req.params.bookid) })
    .then(doc => {
      if (doc) res.status(200).send("BOOK REMOVED SUCCESSFULLY");
      else res.status(404).send("BOOK ID NOT FOUND");
    })
    .catch(err => res.status(500).send({ message: "Error in deleting book" }));
});

/*
GET http://localhost:5000/listbooks
*/
app.get("/listbooks", (req, res) => {
  console.log("INSIDE LIST BOOKS API");
  BookModel.find()
    .then(docs => res.send(docs))
    .catch(err => res.status(500).send({ message: "Error retrieving books" }));
});

/*
PUT http://localhost:5000/editbook/1234
{
  "title": "Updated Title",
  "author": "Updated Author",
  "available": false
}
*/
app.put("/editbook/:bookid", (req, res) => {
  console.log("INSIDE EDIT BOOK API");
  BookModel.findOneAndUpdate(
    { id: parseInt(req.params.bookid) },
    {
      $set: {
        title: req.body.title,
        author: req.body.author,
        available: req.body.available
      }
    },
    { new: true }
  )
    .then(updated => {
      if (updated) res.status(200).send("BOOK UPDATED SUCCESSFULLY");
      else res.status(404).send("BOOK NOT FOUND");
    })
    .catch(err => res.status(500).send({ message: "Error updating book" }));
});

app.listen(5000, () =>
  console.log("BOOK SERVICE running on port 5000")
);
