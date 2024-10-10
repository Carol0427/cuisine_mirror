import { connectToDatabase } from "../connection/connection"; // Assuming your connection file is structured this way
import { Item } from "../models/item"; // Ensure path to your Item model is correct

// Function to find item details by itemID
export async function findItemById(itemID) {
  await connectToDatabase(); // Ensure connection to the database
  const item = await Item.findOne({ itemID: itemID });
  return item;
}