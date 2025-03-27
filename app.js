const express = require("express");
const mongoose = require("mongoose");
const allRouters = require("./routes/index")


const app = express();
const { PORT = 3001 } = process.env;


mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db');

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '67e55ae75f60fcfe4afd6d1a'
  };
  next();
});

app.use("/", allRouters);

app.listen(PORT, ()=>{
  console.log("listining to port 3001");
})