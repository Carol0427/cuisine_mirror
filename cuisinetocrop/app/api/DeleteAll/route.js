// pages/api/DeleteAllItems.js
import { connectToDatabase } from '../../_lib/Mongo/connection/connection';
import { Item } from "../../_lib/Mongo/models/item";

export async function DELETE(req, res) {
  try {
    await connectToDatabase();

    const result = await Item.deleteMany({});

    return new Response(JSON.stringify({ 
      message: 'All items deleted successfully', 
      deletedCount: result.deletedCount 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error deleting items:', error);
    return new Response(JSON.stringify({ 
      message: 'Error deleting items', 
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
