const Message = require("../models/messageModel");
const { uploadedFile } = require("../service/cloudinary");

const MessageCtrl = {
    // Create a new Message
    addMessage: async (req,res) => {
        const {chatId, senderId} = req.body;
        try {
            if(!chatId || !senderId) {
                return res.status(403).json("invalid credentials!");
            };
            if(req.files){
                const image = req.files.image;
                if(image.mimetype !== "image/jpeg" && image.mimetype !== "image/png"){
                    removeTemp(image.tempFilePath);
                    return res.status(400).json({message: "File format not supported! png or jpeg"});
                };

                const img = await uploadedFile(image);
                req.body.file = img;
                // await deleteFile(user.image.public_id);
            };

            const message = new Message(req.body);
            await message.save();

            res.status(201).json(message);
        } catch (error) {
            res.status(500).json({message: error.message});
        } 
    },

    // Get Messages

    getMessage: async (req,res) => {
        try {
            const {chatId} = req.params;
            const messages = await Message.find({chatId});
            res.status(200).json(messages);
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    },

    // del message
    delMessage: async (req,res) => {
        try {
            const {messageId} = req.params;
            const message = await Message.findByIdAndDelete(messageId);
            if(message){
                if(message.file.public_id){
                    await deleteFile(message.file.pulic_id);
                }
                return res.status(200).json("Message deleted successfully!");
            };
            res.status(404).json({message: "Message not found!"});
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    },
};

module.exports = MessageCtrl;