const mongoose = require("mongoose");

const connectDb = () => {
  mongoose
    .connect(process.env.MONGO_URI, {})
    .then((db) => {
      console.log("Mongodb connected");
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = connectDb;
