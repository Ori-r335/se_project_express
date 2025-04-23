const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const allRouters = require("./routes/index")



const app = express();
const { PORT = 3001 } = process.env;


mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db').then(()=>{
  console.log("connected to mongodb");
});

app.use(express.json());
app.use(cors());
app.use("/", allRouters);

app.listen(PORT, ()=>{
  console.log("listening to port 3001");
})
