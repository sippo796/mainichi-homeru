// Next.js API Routes経由でセキュアにアクセス
const API_BASE_URL = "/api"; // 内部API Routes

export interface Article {
  date: string;
  time: string;
  datetime: string;
  articleId: string;
  title: string;
  content: string;
  preview?: string;
  lastModified?: string;
  timePeriod?: 'morning' | 'evening';
  filename?: string;
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

export async function getArticle(articleId: string): Promise<Article> {
  const response = await fetch(`${API_BASE_URL}/articles/${articleId}`, {
    cache: "force-cache",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch article");
  }

  return response.json();
}

export async function getArticleByDate(date: string, timePeriod?: 'morning' | 'evening'): Promise<Article> {
  const url = timePeriod 
    ? `${API_BASE_URL}/articles/${date}?timePeriod=${timePeriod}`
    : `${API_BASE_URL}/articles/${date}`;
    
  const response = await fetch(url, {
    cache: "force-cache",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch article");
  }

  return response.json();
}
