const router = require("express").Router();
const {createItem, getItems, deleteItem,likeItem, dislikeItem} = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");

router.get("/", getItems);
router.post("/",auth, createItem);
// router.put("/:itemId", updateItem)
router.delete("/:itemId",auth, deleteItem);

router.put("/:itemId/likes",auth, likeItem);
router.delete("/:itemId/likes",auth, dislikeItem);

module.exports = router;