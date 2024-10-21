
import jwt from 'jsonwebtoken'
import { Service } from "../models/service.model.js";

export const verifyJWT = async function (req, res, next) {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        //console.log(token);
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized request"
            })
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const service = await Service.findById(decodedToken?._id).select("-password -refreshToken")

        if (!service) {
            return res.status(401).json({
                success: false,
                message: "Invalid Access Token"
            })
        }

        req.service = service;
        next()
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: "Invalid Access Token"
        })
    }
}