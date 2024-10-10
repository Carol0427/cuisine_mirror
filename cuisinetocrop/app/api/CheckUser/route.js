import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";
import { findUserBySubId } from "@/app/_lib/Mongo/utils/finduser";

export const GET = withApiAuthRequired(async function CheckUser(req) {
  try {
    const session = await getSession(req);
    const userID = session.user.sub; // Assuming Auth0 sub is used as userID
    console.log(userID);
    const user = await findUserBySubId(userID);

    if (user) {
      return NextResponse.json({ exists: true }, { status: 200 });
    } else {
      return NextResponse.json({ exists: false }, { status: 404 });
    }
  } catch (error) {
    console.error("Error checking user existence:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
