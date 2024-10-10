import { NextResponse } from 'next/server';
import { AddIngredients } from '../../_lib/Mongo/utils/addingredients';
import { findItemById } from '../../_lib/Mongo/utils/getitemdetails';
import { GetIngredients } from '../../_lib/OpenAI/getingredients';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get('itemid');
    const title = searchParams.get('title');
    const description = searchParams.get('description');
    if (!title || !description || !itemId) {
      return NextResponse.json({ error: 'Title, description, and itemId are required' }, { status: 400 });
    }
    console.log(`Processing request for item: ${itemId}`);

    const existingItem = await findItemById(itemId);
    let ingredients;
    let msg;
    if (!existingItem || !existingItem.ingredients || existingItem.ingredients.length === 0) {
      console.log(`No existing ingredients found for item ${itemId}. Generating new ingredients.`);
      msg = "ingredients were not saved and had to get from ai";
      ingredients = await GetIngredients(title, description);
      await AddIngredients(ingredients, itemId);
      console.log(`Ingredients processed and saved for item ${itemId}`);
    } else {
      msg = "got ingredients from mongo";
      console.log(`Using existing ingredients for item ${itemId}`);
      ingredients = existingItem.ingredients;
      console.log("ingredients: ", ingredients);
    }

    console.log("it worked!");
    return NextResponse.json({ stuff: ingredients,  message: msg });
  } catch (error) {
    console.error("Error in GetIngredients API route:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}