import { DeleteIngredient } from '../../_lib/Mongo/utils/deleteingredient';
import { NextResponse } from 'next/server'
//just for commit
export async function DELETE(req, res) {
  try {
    const { searchParams } = new URL(req.url);
    const ingredient = searchParams.get('ingredient');
    const itemid = searchParams.get('itemid');

    if (!ingredient || !itemid) {
        return NextResponse.json({ error: 'Ingredient and itemid are required' }, { status: 400 });
    }

    const response = DeleteIngredient(ingredient, itemid);
    console.log(response);

    return NextResponse.json({ message: 'Successfully processed'});
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}}
