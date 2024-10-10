import { connectToDatabase } from "../connection/connection";
import { User } from "../models/user";
export async function findUserBySubId(userID) {
  await connectToDatabase();
  const user = await User.findOne({ userID: userID });
  return user;
}