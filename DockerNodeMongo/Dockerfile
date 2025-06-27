FROM node:22-alpine
WORKDIR /code
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD [ "node", "index.js" ]

