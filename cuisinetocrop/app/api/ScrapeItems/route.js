import { ScrapeMenuItems } from '@/app/_lib/Playwright/scrapemenuitems';
import { NextResponse } from 'next/server'
 
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    const menu_items = await ScrapeMenuItems(url);
   console.log("API route received menu items:", menu_items);
    return NextResponse.json(menu_items);
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}