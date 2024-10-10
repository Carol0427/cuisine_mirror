import { connectToDatabase } from "../connection/connection";
import { Item } from "../models/item";

export async function DeleteIngredient(ingredient, itemID) {
  await connectToDatabase();
  try {
    // Remove the specified ingredient from the ingredients array of the item
    const updatedItem = await Item.findOneAndUpdate(
      { itemID }, // Find the item by itemID
      { $pull: { ingredients: ingredient } }, // Use $pull to remove the ingredient
      { new: true } // Return the updated document
    );

    if (!updatedItem) {
      throw new Error(`Item with ID: ${itemID} not found`);
    }

    console.log(`Updated item: ${updatedItem.title} by removing ingredient "${ingredient}" for itemID: ${itemID}`);
    
    return updatedItem;

  } catch (error) {
    console.error("Error in DeleteIngredient:", error);
    throw error; // Re-throw the error for the caller to handle
  }
}
