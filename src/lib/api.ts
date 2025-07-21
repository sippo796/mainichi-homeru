const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface Article {
  date: string;
  title: string;
  preview?: string;
  content?: string;
  lastModified: string;
}

export async function getArticles(): Promise<Article[]> {
  try {
    const url = `${API_BASE_URL}/api/articles`;
    console.log(`Fetching articles from: ${url}`);
    console.log(`API_BASE_URL: ${API_BASE_URL}`);
    
    const response = await fetch(url, {
      headers: {
        'X-API-Key': '0gzmQ5GoGb8JbxijwxwOzan8GTGlbUBB9Yzaejm1'
      },
      cache: 'no-store', // クライアントサイドではキャッシュなし
    });
    
    console.log(`Response status: ${response.status}`);
    console.log(`Response headers:`, response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error Response: ${errorText}`);
      throw new Error(`HTTP ${response.status}: Failed to fetch articles - ${errorText}`);
    }

    const data = await response.json();
    console.log('Articles data:', data);
    return data.articles || [];
  } catch (error) {
    console.error('Error fetching articles:', error);
    console.error('Error details:', error instanceof Error ? error.message : error);
    // フォールバック：エラー時は空配列を返す
    return [];
  }
}

export async function getArticle(date: string): Promise<Article> {
  const response = await fetch(`${API_BASE_URL}/api/articles/${date}`, {
    headers: {
      'X-API-Key': '0gzmQ5GoGb8JbxijwxwOzan8GTGlbUBB9Yzaejm1'
    },
    cache: 'no-store', // クライアントサイドではキャッシュなし
  });

  if (!response.ok) {
    throw new Error("Failed to fetch article");
  }

  return response.json();
}
