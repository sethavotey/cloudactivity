const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
    id: Number,
    title: String,
    author: String,
    available: Boolean
});

const BookModel = mongoose.model("BookCollection", BookSchema);

module.exports = BookModel;
