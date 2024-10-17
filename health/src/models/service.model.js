import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const serviceSchema = new Schema({
    name: {
        type: String,
        required: [true, "Service name is required"],
        min: [3, "Minimum 3 character is required"],
        max: [300, "Minimum 300 character is required"],
        unique: [true, "Service naem should be unique"]
    },
    password: {
        type: String,
        required: [true, "Service name is required"],
    },
    descripition: {
        type: String,
        required: [true, "Service descripition is required"],
        min: [3, "Minimum 3 character is required"],
    },
    price: {
        type: Number,
        required: [true, "Service price is required"],
    },
    refreshToken: {
        type: String
    }
}, { timestamps: true });


//password encrypeted.
serviceSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

serviceSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}


//accessToken 
serviceSchema.methods.generateAccessToken = function () {
    return jwt.sign({// payload 
        _id: this._id,
        email: this.email,
        username: this.username,
        fullName: this.fullName, // sign with JWT secret and set expiration time
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        })
}

//refresh Token
serviceSchema.methods.generateRefreshToken = function () {
    return jwt.sign({// payload 
        _id: this._id,
    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        })
}

export const Service = mongoose.model("Service", serviceSchema)
