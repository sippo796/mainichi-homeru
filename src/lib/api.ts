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
    const response = await fetch(`${API_BASE_URL}/api/articles`, {
      headers: {
        'X-API-Key': '0gzmQ5GoGb8JbxijwxwOzan8GTGlbUBB9Yzaejm1'
      },
      cache: 'force-cache', // ブラウザキャッシュを積極的に利用
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch articles`);
    }

    const data = await response.json();
    return data.articles || [];
  } catch (error) {
    // エラー時は空配列を返す
    return [];
  }
}

export async function getArticle(date: string): Promise<Article> {
  const response = await fetch(`${API_BASE_URL}/api/articles/${date}`, {
    headers: {
      'X-API-Key': '0gzmQ5GoGb8JbxijwxwOzan8GTGlbUBB9Yzaejm1'
    },
    cache: 'force-cache', // ブラウザキャッシュを積極的に利用
  });

  if (!response.ok) {
    throw new Error("Failed to fetch article");
  }

  return response.json();
}
