const router = require('express').Router();
const { authMiddleware } = require('../middlewares/authMiddlewares');
const chatCtrl = require("../controllers/chatCtrl");

router.get('/', authMiddleware, chatCtrl.userChats);
router.get('/:firstId/:secondId', chatCtrl.findChat);
router.delete('/:ChatId', authMiddleware, chatCtrl.deleteChat);

module.exports = router;