import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://d3pvisww9lyy6l.cloudfront.net";
const API_KEY = process.env.API_KEY || ""; // サーバーサイド専用（NEXT_PUBLIC_なし）

export async function GET(request: NextRequest) {
  try {
    if (!API_KEY) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const response = await fetch(`${API_BASE_URL}/api/articles`, {
      headers: {
        'X-API-Key': API_KEY
      },
      cache: 'no-store', // サーバーサイドでは都度取得
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch articles`);
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ articles: [] }, { status: 200 }); // エラー時は空配列
  }
}