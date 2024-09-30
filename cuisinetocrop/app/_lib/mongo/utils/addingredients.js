import { connectToDatabase } from "../connection/connection";
import { Item } from "../models/item";

export async function AddIngredients(ingredients, itemID) {
  await connectToDatabase();
  try {
    // Find the item by itemID
    const item = await Item.findOne({ itemID });

    if (!item) {
      throw new Error(`Item with ID: ${itemID} not found`);
    }

    // Add the ingredients to the item's ingredients list
    item.ingredients = [...item.ingredients, ...ingredients];

    // Save the updated item
    const updatedItem = await item.save();

    console.log(`Updated item: ${updatedItem.title} with new ingredients for itemID: ${itemID}`);
    
    return updatedItem;

  } catch (error) {
    console.error("Error in AddIngredients:", error);
    throw error; // Re-throw the error for the caller to handle
  }
}
