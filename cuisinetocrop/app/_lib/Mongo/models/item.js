import mongoose from "mongoose"

const ItemSchema = new mongoose.Schema({
    userID: {type: String, required:true},
    itemID: {type: String, required:true},
    title: {type: String, required:true},
    description: {type: String, required:true},
    ingredients: [{type:String}],
}, 	
{ collection: "items" }
);

export const Item = mongoose.models.Item || mongoose.model("Item", ItemSchema);
