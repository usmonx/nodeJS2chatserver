const Chat = require('../models/chatModel');

const chatCtrl = {
    // Chat list
    
    userChats: async (req,res) => {
        try {
            const {id} = req.user;

            const chats = await Chat.find({members: {$in: [id]}});
            res.status(200).json(chats);
        } catch (error) {
            res.status(500).json({message: error.message});
        };
    },
    // Find or Create a new chat
    findChat: async (req, res) => {
        try {
            const {firstId, secondId} = req.params;
            const chat = await Chat.findOne({members: {$all:[firstId, secondId]}});

            if(chat) {
                return res.status(200).json(chat);
            };
            const newChat = await Chat({members: [firstId, secondId]});
            newChat.save();
            return res.status(201).json(newChat);
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    },


    // Delete a chat

    deleteChat: async (req, res) => {
        const {ChatId} = req.params;
        try {
            const chat = await Chat.findByIdAndDelete(ChatId);
            if(chat) {
                return res.status(200).json("chat deleted successfully!");
            }
            return res.status(404).json("chat not found!");
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    },
};

module.exports = chatCtrl;