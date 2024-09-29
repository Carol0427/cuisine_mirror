import { findItemById } from '../../_lib/mongo/utils/getitemdetails'
import { NextResponse } from 'next/server'

export async function GET(req) {
    const url = new URL(req.url);
    const id = url.searchParams.get("id"); // Extract the item ID from query parameters
  
    try {
      // Query the database to find the item by itemID
      const item = await findItemById(id);
  
      if (!item) {
        return new Response(JSON.stringify({ error: "Item not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
  
      // Return the item details in the response
      return new Response(JSON.stringify(item), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
      
    } catch (error) {
      // Handle any errors during the request
      return new Response(JSON.stringify({ error: "Internal Server Error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
  