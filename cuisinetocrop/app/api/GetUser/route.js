import { findUserBySubId } from '../../_lib/mongo/utils/finduser'
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

export const GET = withApiAuthRequired(async function GET(req) {
  try {
    const session = await getSession(req);
    const userId = session.user.sub;

    const user = await findUserBySubId(userId);
    console.log(user.zipCode);
    
    if (!user || user.length === 0) {
      return new Response(JSON.stringify({ error: "No items found for this user" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Convert user.zipCode to an integer
    const zipCodeInt = parseInt(user.zipCode, 10);

    if (isNaN(zipCodeInt)) {
      return new Response(JSON.stringify({ error: "Invalid zip code" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ zipCode: zipCodeInt }), {
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
