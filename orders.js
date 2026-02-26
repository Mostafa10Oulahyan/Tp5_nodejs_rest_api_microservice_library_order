// Load express
const express = require("express");
const app = express();
const { ObjectId } = require("mongodb");
const axios = require("axios");

// load Order model

require("./Order");

// Load mongoose
const mongoose = require("mongoose");

// Load body-parser

const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Connect

const uri =
  "mongodb+srv://mostafa:azer2020@cluster0.piishbl.mongodb.net/Library?appName=Cluster0";

mongoose
  .connect(uri)
  .then(() => console.log("Connected to MongoDB !!!"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// route 1    home

app.get("/", (req, res) => {
  res.send("Welcome to orders service !!!");
});

// route 2    insert new Order

const Order = mongoose.model("Order");
app.post("/order", (req, res) => {
  var newOrder = {
    CustomerID: new ObjectId(req.body.CustomerID), // convert string param to ID
    BookID: new ObjectId(req.body.BookID),
    initialDate: req.body.initialDate,
    deliveryDate: req.body.deliveryDate,
  };

  let order = new Order(newOrder);

  order
    .save()
    .then(() => {
      console.log("New order created!");
      res.json({ message: "a new order added !!!" });
    })
    .catch((err) => {
      if (err) {
        throw err;
      }
    });
});

// route 3 list of orders

app.get("/orders", (req, res) => {
  Order.find().then((orders) => {
    console.log(orders);
    res.json({ orders: orders });
  });
});

// route 4 details order :

app.get("/order/:id", (req, res) => {
  Order.findById(req.params.id).then((order) => {
    axios
      .get("https://tp5-nodejs-rest-api-microservice-li-eight.vercel.app/customers/" + order.CustomerID)
      .then((response) => {
        let orderObject = {
          customerName: response.data.customer.name,
          bookTitle: "",
        };

        axios
          .get("https://tp5-nodejs-rest-api-microservice-li.vercel.app/books/" + order.BookID)
          .then((response) => {
            orderObject.bookTitle = response.data.book.title;

            res.json({ order: orderObject });
          });
      });
  });
});

// Only start server if not running in Vercel
if (process.env.NODE_ENV !== "production") {
  app.listen(6666, () =>
    console.log("Up and running! -- This is our orders service"),
  );
}

// Export for Vercel
module.exports = app;
