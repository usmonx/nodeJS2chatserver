const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        email:{
            type: String,
            required: true,
            unique: true
        },
        password:{
            type: String,
            required: true,
        },
        firstName:{
            type: String,
            required: true,
        },
        lastName:{
            type: String,
            required: true,
        },
        role:{
            type: Number,
            default: 100,
            enum: [100, 101], // 100-user 101-admin
        },
        profilePicture:{
            type: Object,
            default: "",
        },
        coverPicture:{
            type: Object,
            default: "",
        },
        about: String,
        LivesIn: String,
        worksAt: String,
        relationship: String,
        country: String,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", UserSchema);