const JWT = require("jsonwebtoken");
const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const { request } = require("express");
const { removeTemp, uploadedFile, deleteFile } = require("../service/cloudinary");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const UserCtrl = {
    // Get User
    getUser: async (req, res) => {
        const {id} = req.params;
        try {
           const user = await Users.findById(id);
           if (user) {
                const {password, ...otherDetails} = user._doc
                return res.status(200).json(otherDetails);
           };
           res.status(404).json({message: "User not found"});
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    },
    // Get all users
    getAllUser: async (req, res) => {
        try {
           let users = await Users.find();
           users.map(user => {
            const {password, ...otherDetails} = user._doc;
            return otherDetails
           });

           res.status(200).json(users);
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    },
    // update user
    updateUser: async (req, res) => {
        const {id} = req.params;
        const {currentUserAdmin} = req;
        try {
            if(id === req.user.id || currentUserAdmin){
                const user = await Users.findById(id);
                if(req.body.password){
                    const hashedPassword = await bcrypt.hash(req.body.password, 12);
                    request.body.password = hashedPassword;
                }
                // Update images
                if(req.files){
                    if(req.files.profilePicture){
                        const profilePicture = req.files.profilePicture;
                        if(profilePicture.mimeType !== "image/jpeg" && profilePicture.mimeType !== "image/png"){
                            removeTemp(profilePicture.tempFilePath);
                            return res.status(400).json({message: "File format not supported! png or jpeg"});
                        };

                        const img = await uploadedFile(profilePicture);
                        request.body.profilePicture = img;
                    };
                    if(req.files.coverPicture){
                        const coverPicture = req.files.coverPicture;        
                        if(coverPicture.mimeType !== "image/jpeg" && coverPicture.mimeType !== "image/png"){
                            removeTemp(coverPicture.tempFilePath);
                            return res.status(400).json({message: "File format not supported! png or jpeg"});
                        };

                        const img = await uploadedFile(coverPicture);
                        request.body.coverPicture = img;
                        await deleteFile(user.coverPicture.pulic_id);
                    };

                };

                const updatedUser = await Users.findByIdAndUpdate(id, req.body, {new: true});
                const {password, ...otherDetails} = updatedUser._doc;
                res.status(200).json(otherDetails);
            }else{
                res.status(403).json({message:"Access Denied. You can't update it's not your account! Fuck your self!"});
            }
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    },
    // delete user
    deleteUser: async (req, res) => {
        const {id} = req.params;
        const {currentUserAdmin} = req;
        try {
            if(id === req.user.id || currentUserAdmin) {

                // delete images
                const deleteUser = await Users.findByIdAndDelete(id);
                if(deleteUser) {
                    return res.status(200).json({message: "User deleted successfully!"});
                } else {
                    res.status(404).json({message: "User not found!"});
                }
            } else {
                res.status(403).json({message:"Access Denied. You can't delete. It's not your account! Fuck your self!"});
            }
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }
};

module.exports = UserCtrl;