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
    const { searchParams } = new URL(request.url);
    const timePeriod = searchParams.get('timePeriod') as 'morning' | 'evening' | null;
    
    // 時間帯指定がある場合は時間帯別ファイルを試行
    if (timePeriod) {
      const periodResponse = await fetch(`${API_BASE_URL}/api/articles/${date}-${timePeriod}`, {
        headers: {
          'X-API-Key': API_KEY
        },
        cache: 'no-store',
      });
      
      if (periodResponse.ok) {
        const data = await periodResponse.json();
        return NextResponse.json({ ...data, timePeriod, filename: `${date}-${timePeriod}.md` });
      }
    }
    
    // 時間帯指定がないか、時間帯別ファイルが見つからない場合は従来の日付のみファイルを試行
    const response = await fetch(`${API_BASE_URL}/api/articles/${date}`, {
      headers: {
        'X-API-Key': API_KEY
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error("Failed to fetch article");
    }

    const data = await response.json();
    return NextResponse.json({ ...data, filename: `${date}.md` });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }
}