import { AddIngredients } from '../../_lib/Mongo/utils/addingredients';
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const body = await req.json();
    const { ingredients, itemid } = body;

    if (!ingredients || !itemid) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    const response = AddIngredients(ingredients, itemid);
    console.log(response);

    return NextResponse.json({ message: 'Successfully processed'});
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}