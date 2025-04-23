const router = require("express").Router();
const {NOT_FOUND} = require("../utils/errors");
const { createUser, login } = require("../controllers/users");
const auth = require("../middlewares/auth");
const userRouter = require("./users");
const itemRouter = require("./clothingItems");

router.use("/users", auth, userRouter);
router.use("/items", itemRouter);
router.post('/signin', login);
router.post('/signup', createUser);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Router not found" });
});

module.exports = router;