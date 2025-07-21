import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://d3pvisww9lyy6l.cloudfront.net";
const API_KEY = process.env.API_KEY || ""; // サーバーサイド専用

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ date: string }> }
) {
  try {
    if (!API_KEY) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const { date } = await params;
    
    const response = await fetch(`${API_BASE_URL}/api/articles/${date}`, {
      headers: {
        'X-API-Key': API_KEY
      },
      cache: 'no-store', // サーバーサイドでは都度取得
    });

    if (!response.ok) {
      throw new Error("Failed to fetch article");
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }
}