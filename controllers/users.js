const User = require("../models/user");
const {OK,CREATED,BAD_REQUEST,SERVER_ERROR,NOT_FOUND} = require("../utils/errors.js");

const getUsers = (req, res) => {
  User.find({})
  .then((users)=>{
    res.status(OK).send(users);
  })
  .catch((err)=>{
    console.error(err);
    return res.status(SERVER_ERROR).send({message: err.message});
  })
};

const createUser = (req, res) => {
 const {name, avatar} = req.body;

 User.create({name, avatar})
 .then((user)=>{
  res.status(CREATED).send(user);
 })
 .catch((err)=>{
   console.error(err);
   if (err.name === "ValidationError") {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Invalid data provided" });
  }
  return res
    .status(SERVER_ERROR)
    .send({ message: "An error has occured on the server" });

 });
};

const getUser = (req, res) => {
  const {userId} = req.params;
  User.findById(userId)
  .orFail()
  .then((user)=>{
    res.status(OK).send(user);
  })
  .catch((err)=>{
    console.error(err);
    if (err.name === "DocumentNotFoundError") {
      return res
        .status(NOT_FOUND)
        .send({ message: "Id provided was not found" });
    } else if (err.name === "CastError") {
      return res
        .status(BAD_REQUEST)
        .send({ message: "Invalid data provided" });
    }
    return res.status(SERVER_ERROR).send({message: "An error has occured on the server"});
  })
};

module.exports = {getUsers, createUser,getUser };