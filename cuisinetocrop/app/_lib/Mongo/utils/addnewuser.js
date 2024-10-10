import { connectToDatabase} from "../connection/connection";
import {User} from "../models/user"

//Function to add a user to MongoDB
export async function AddNewUser(userID, restaurantName,zipCode) {
 await connectToDatabase();
 
 try{
    // check if the user already exists by their userID
    const existingUser = await User.findOne ({userID});

    if(existingUser) {
        console.log ("User already exits");
        return;
    }

    // create a new user if they dont already exist
    const user = await User.create({
        userID, // unique userID
        restaurantName, // the name of the restaurant
        zipCode, // user's zip code
    });
    console.log ("New user created:", user);
    return user;
 } catch(error) {
    console.error("Error in AddNewUser:", error);
    throw error;
 }
}
