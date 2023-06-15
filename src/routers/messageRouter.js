const router = require('express').Router();
const messageCtrl = require('../controllers/messageCtrl');
const { authMiddleware } = require('../middlewares/authMiddlewares');


router.post("/", authMiddleware, messageCtrl.addMessage);
router.get("/:chatId", authMiddleware, messageCtrl.getMessage);
router.delete("/:messageId", authMiddleware, messageCtrl.delMessage);

module.exports = router;