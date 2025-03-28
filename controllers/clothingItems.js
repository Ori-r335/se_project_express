const Item = require("../models/clothingItem");
const {OK,CREATED,BAD_REQUEST,SERVER_ERROR,NOT_FOUND} = require("../utils/errors");

const createItem = (req, res) => {

 const {name, weather, imageUrl} = req.body;

 const owner = req.user._id;
 console.log(name);
 Item.create({name, weather, imageUrl, owner})
 .then((item)=>{
  res.status(CREATED).send(item);
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

const getItems = (req, res) => {
  Item.find()
  .then((items)=>{
    res.status(OK).send(items);
  })
  .catch((err)=>{
    console.error(err);
    return res.status(SERVER_ERROR).send({message: "An error has occurred on the server"});
  })
};

const deleteItem = (req, res) => {
  const {itemId} = req.params;

  console.log(itemId)
  Item.findByIdAndDelete(itemId)
  .orFail()
  .then((item)=>{
    res.send({item});
  })
  .catch((err)=>{
    console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .json({ message: "Id provided was not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .json({ message: "Invalid data provided" });
      }
      return res
        .status(SERVER_ERROR)
        .json({ message: "An error has occurred on the server" });
    });
};



const likeItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
  { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
  { new: true },
)
  .orFail()
  .then((item)=>{
    res.status(OK).send({data: item});
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

const dislikeItem = (req, res) => {
  Item.findByIdAndUpdate(
  req.params.itemId,
  { $pull: { likes: req.user._id } }, // remove _id from the array
  { new: true },
)
  .orFail()
  .then((item)=>{
    res.send({item});
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



module.exports = {createItem, getItems, deleteItem, likeItem, dislikeItem };