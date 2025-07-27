// Next.js API Routes経由でセキュアにアクセス
const API_BASE_URL = "/api"; // 内部API Routes

export interface Article {
  date: string;
  title: string;
  preview?: string;
  content?: string;
  lastModified: string;
  timePeriod?: 'morning' | 'evening'; // 新しい時間帯情報（オプショナル）
  filename?: string; // 実際のファイル名
}

export async function getArticles(): Promise<Article[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/articles`);

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

export async function getArticle(date: string, timePeriod?: 'morning' | 'evening'): Promise<Article> {
  const url = timePeriod 
    ? `${API_BASE_URL}/articles/${date}?timePeriod=${timePeriod}`
    : `${API_BASE_URL}/articles/${date}`;
    
  const response = await fetch(url, {
    cache: "force-cache", // ブラウザキャッシュを積極的に利用
  });

  if (!response.ok) {
    throw new Error("Failed to fetch article");
  }

  return response.json();
}
