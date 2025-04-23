const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require("../models/user");
const {OK,CREATED,BAD_REQUEST,SERVER_ERROR,NOT_FOUND,CONFLICT_ERROR, ERROR} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

// const getUsers = (req, res) => {
//   User.find({})
//   .then((users)=>{
//     res.status(OK).send(users);
//   })
//   .catch((err)=>{
//     console.error(err);
//     return res.status(SERVER_ERROR).send({message: "An error has occured on the server"});
//   })
// };


const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        const error = new Error("Email already exists");
        error.code = 11000;
        throw error;
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({ name, avatar, email, password: hash })
    )
    .then((user) => {
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      res.status(CREATED).send(userWithoutPassword);
    })
    .catch((err) => {
      console.error(err);

      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data provided" });
      }
      if (err.code === 11000) {
        return res.status(CONFLICT_ERROR).send({ message: "Conflict: Email already exists" });
      }
      return res.status(SERVER_ERROR).send({ message: "An error has occurred on the server" });
    })
};


const getCurrentUser  = (req, res) => {
  const userId = req.user._id;
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
    } if (err.name === "CastError") {
      return res
        .status(BAD_REQUEST)
        .send({ message: "Invalid data provided" });
    }
    return res.status(SERVER_ERROR).send({message: "An error has occured on the server"});
  })
};




const login = (req, res) => {
  const { email, password } = req.body;
  if( !email || !password){
    return res.status(BAD_REQUEST).send({message: "invalid data provided"});
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err)=>{
      console.error(err);
      if (err.message === "Incorrect email or password") {
       return res
         .status(ERROR)
         .send({ message: "Incorrect email or password" });
     } if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).send({ message: "Invalid data provided" });
    }
     return res
       .status(SERVER_ERROR)
       .send({ message: "An error has occured on the server" });

    });
};


const updateUser = (req, res, next) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    {
      new: true, // return the updated object
      runValidators: true,
    }
  )
    .orFail(() => {
      const error = new Error('User not found');
      error.statusCode = NOT_FOUND;
      throw error;})
    .then((updatedUser) => res.send(updatedUser))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data provided" });
      }
      return next(err);
    });
};

module.exports = {updateUser, createUser, getCurrentUser, login };