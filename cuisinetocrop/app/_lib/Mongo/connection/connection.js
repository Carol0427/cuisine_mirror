import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.MONGODBKEY);
        console.log("Connected to MongodB with Mongoose");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}
