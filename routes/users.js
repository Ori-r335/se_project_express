const router = require("express").Router();
const {updateUser, createUser, getCurrentUser} = require("../controllers/users");


router.get("/me", getCurrentUser);
router.patch("/me", updateUser);

module.exports = router;