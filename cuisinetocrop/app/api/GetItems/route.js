import { GetItemsByUserId } from '../../_lib/Mongo/utils/getitemsbyuid'
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

export const GET = withApiAuthRequired(async function GET(req) {
  try {
    const session = await getSession(req);
    const userId = session.user.sub;

    const items = await GetItemsByUserId(userId);

    if (!items || items.length === 0) {
      return new Response(JSON.stringify({ error: "No items found for this user" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(items), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
    
  } catch (error) {
    console.error("Error in GET /api/GetItems:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});