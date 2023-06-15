const router = require("express").Router();

const userCtrl = require("../controllers/userCtrl");
const { authMiddleware } = require("../middlewares/authMiddlewares");

router.get("/", authMiddleware, userCtrl.getAllUser);
router.get("/:id", userCtrl.getUser);
router.put("/:id", authMiddleware, userCtrl.updateUser);
router.delete("/:id", authMiddleware, userCtrl.deleteUser);

module.exports = router;