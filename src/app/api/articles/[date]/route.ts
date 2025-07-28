import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://d3pvisww9lyy6l.cloudfront.net";
const API_KEY = process.env.API_KEY || ""; // サーバーサイド専用

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ date: string }> }
) {
  try {
    console.log(`API_KEY length: ${API_KEY?.length || 0}`);
    console.log(`API_KEY exists: ${!!API_KEY}`);
    
    if (!API_KEY) {
      console.error("API_KEY not found in environment variables");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const { date } = await params;
    const { searchParams } = new URL(request.url);
    const timePeriod = searchParams.get('timePeriod') as 'morning' | 'evening' | null;
    
    // 時間帯指定がある場合は時間帯別ファイルを試行
    if (timePeriod) {
      const periodUrl = `${API_BASE_URL}/api/articles/${date}-${timePeriod}`;
      console.log(`Fetching period article: ${periodUrl}`);
      
      const periodResponse = await fetch(periodUrl, {
        headers: {
          'X-API-Key': API_KEY
        },
        cache: 'no-store',
      });
      
      console.log(`Period response status: ${periodResponse.status}`);
      
      if (periodResponse.ok) {
        const data = await periodResponse.json();
        console.log(`Period article found: ${date}-${timePeriod}`);
        return NextResponse.json({ ...data, timePeriod, filename: `${date}-${timePeriod}.md` });
      } else {
        console.log(`Period article not found, trying fallback`);
      }
    }
    
    // 時間帯指定がないか、時間帯別ファイルが見つからない場合は従来の日付のみファイルを試行
    const fallbackUrl = `${API_BASE_URL}/api/articles/${date}`;
    console.log(`Fetching fallback article: ${fallbackUrl}`);
    
    const response = await fetch(fallbackUrl, {
      headers: {
        'X-API-Key': API_KEY
      },
      cache: 'no-store',
    });

    console.log(`Fallback response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Fallback fetch failed: ${response.status} - ${errorText}`);
      throw new Error("Failed to fetch article");
    }

    const data = await response.json();
    console.log(`Fallback article found: ${date}`);
    return NextResponse.json({ ...data, filename: `${date}.md` });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }
}