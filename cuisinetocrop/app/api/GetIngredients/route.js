import { GetIngredients } from '../../_lib/OpenAI/getingredients';
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title');
    const description = searchParams.get('description');

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    const ingredients = await GetIngredients(title, description);
    console.log(ingredients);

    return NextResponse.json({ message: 'Successfully processed', ingredients, title: title, description: description });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}