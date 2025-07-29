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

export interface Pagination {
  currentPage: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ArticlesResponse {
  articles: Article[];
  pagination: Pagination;
}

export async function getArticles(limit?: number, page?: number): Promise<ArticlesResponse> {
  try {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (page) params.append('page', page.toString());
    
    const url = `${API_BASE_URL}/articles${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch articles`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // エラー時はデフォルト値を返す
    return {
      articles: [],
      pagination: {
        currentPage: 1,
        limit: 10,
        totalCount: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false
      }
    };
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
