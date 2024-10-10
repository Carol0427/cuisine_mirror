import { connectToDatabase } from "../connection/connection";
import { Item } from "../models/item";
import { v4 as uuidv4} from 'uuid';

export async function AddNewItems(userID, itemsArray) {
  await connectToDatabase();
  try {
    // Prepare items for insertion
    const itemsToInsert = itemsArray.map(item => ({
      title: item.title,              // Ensure title is included
      description: item.description,   // Ensure description is included
      ingredients: [],                 // Initialize as an empty array or populate if you have ingredients
      itemID: uuidv4(),               // Generate a unique ID for each item
      userID                           // Associate the item with the user
    }));

    // Insert many items at once
    const result = await Item.insertMany(itemsToInsert);

    console.log(`Added ${result.length} items for user ID: ${userID}`);
    result.forEach(item => {
      console.log(`Added item: ${item.title} with ID: ${item.itemID} for user ID: ${userID}`);
    });

    return result;  // Return the inserted items

  } catch (error) {
    console.error("Error in AddNewItems:", error);
    throw error; // Re-throw the error for the caller to handle
  }
}
