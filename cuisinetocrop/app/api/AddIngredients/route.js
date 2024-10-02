import { AddIngredients } from '../../_lib/mongo/utils/addingredients';
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { searchParams } = new URL(req.url);
    const ingredients = searchParams.get('ingredients');
    const itemid = searchParams.get('itemid');

    if (!ingredients || !itemid) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    // Remove quotes if they're present in the parameters
    // const cleanTitle = title.replace(/^"|"$/g, '');
    // const cleanDescription = description.replace(/^"|"$/g, '');

    const response = AddIngredients(ingredients, itemid);
    console.log(response);

    return NextResponse.json({ message: 'Successfully processed'});
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}