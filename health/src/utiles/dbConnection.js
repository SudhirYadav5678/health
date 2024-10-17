import mongoose from "mongoose"

export const dbConnect = async function () {
    try {
        const database = await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log("database is connected");

    } catch (error) {
        console.log("Error while database connection", error)
        process.exit(1);
    }
}