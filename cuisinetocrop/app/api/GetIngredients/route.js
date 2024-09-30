import { GetIngredients } from '../../_lib/OpenAI/getingredients';
import { NextResponse } from 'next/server';
import { findItemById } from '../../_lib/mongo/utils/getitemdetails';
import { AddIngredients } from '../../_lib/mongo/utils/addingredients';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title');
    const description = searchParams.get('description');
    const itemId = searchParams.get('itemid');

    if (!title || !description || !itemId) {
      return NextResponse.json({ error: 'Title, description, and itemId are required' }, { status: 400 });
    }

    console.log(`Processing request for item: ${itemId}`);

    const existingItem = await findItemById(itemId);
    let ingredients;

    if (!existingItem || !existingItem.ingredients || existingItem.ingredients.length === 0) {
      console.log(`No existing ingredients found for item ${itemId}. Generating new ingredients.`);
      ingredients = await GetIngredients(title, description);
    } else {
      console.log(`Using existing ingredients for item ${itemId}`);
      ingredients = existingItem.ingredients;
    }

    await AddIngredients(ingredients, itemId);
    console.log(`Ingredients processed and saved for item ${itemId}`);

    return NextResponse.json({ ingredients });
  } catch (error) {
    console.error("Error in GetIngredients API route:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}