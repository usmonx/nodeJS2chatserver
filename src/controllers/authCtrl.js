const bcrypt = require('bcrypt');
const JWT = require("jsonwebtoken");
const Users = require("../models/userModel");
const dotenv = require("dotenv");

dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const authCtrl = {
    register: async (req, res)=> {
        const { email } = req.body;
        try {
            const existUser = await Users.findOne({ email });
            if(existUser){
                return res.status(400).json({message: 'User already registered!'});
            }
                
            const hashedPassword = await bcrypt.hash(req.body.password, 12);
            req.body.password = hashedPassword;

            if(req.body.role){
                req.body.role = Number(req.body.role)
            }

            const user = new Users(req.body);

            await user.save();

            const token = await JWT.sign({email: user.email, id: user._id, role: user.role}, JWT_SECRET_KEY, {expiresIn: "12h"});

            const {password, ...otherDetails} = user._doc;

            res.status(201).json({user: otherDetails, token});

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    logIn: async (req, res) => {
        const {email} = req.body;
        try {
            const existUser = await Users.findOne({ email });
            if(!existUser){
                return res.status(404).json({message: 'User not found!'});
            };

            const isPasswordCorrect = await bcrypt.compare(req.body.password, existUser.password);
            
            if(!isPasswordCorrect){
                return res.status(400).json({message: "Invalid credentials!"});
            }

            const token = JWT.sign({email: existUser.email, id: existUser._id, role: existUser.role}, JWT_SECRET_KEY, {expiresIn: "12h"});

            const {password, ...otherDetails} = existUser._doc;
            res.status(200).json({ user: otherDetails, token });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
}

module.exports = authCtrl;