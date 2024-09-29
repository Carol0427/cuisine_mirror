import mongoose from 'mongoose';
import { connectToDatabase } from "../connection/connection"; // Assuming your connection file is structured this way
import { Item } from "../models/item"; // Ensure path to your Item model is correct

// New function to find all items by userID
export async function GetItemsByUserId(userID) {
    await connectToDatabase(); // Ensure connection to the database
    const items = await Item.find({ userID: userID });
    return items;
  }