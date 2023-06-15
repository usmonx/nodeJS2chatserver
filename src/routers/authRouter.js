const router = require("express").Router();
const auth = require("../controllers/authCtrl");

router.post("/signup", auth.register);
router.post("/login", auth.logIn);

module.exports = router;