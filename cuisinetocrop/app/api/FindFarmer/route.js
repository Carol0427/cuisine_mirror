import { NextResponse } from 'next/server';
import fetchFarmingPageHtml from '@/app/_lib/Playwright/localharvest';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const zipCode = searchParams.get('zipCode');
  const ingredient = searchParams.get('ingredient');

  try {
    const response = await fetchFarmingPageHtml(zipCode, ingredient);
    console.log("WOW: ", response);
    return NextResponse.json({ farmnlink: response || 'Not found' });
  } catch (error) {
    console.error('Error fetching the first good name:', error);
    return NextResponse.json({ error: 'Failed to fetch good name' }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic'