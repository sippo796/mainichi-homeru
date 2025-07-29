'use client';

import { getArticles } from "@/lib/api";
import ArticleList from "@/components/ArticleList";
import PaginationComponent from "@/components/Pagination";
import { useEffect, useState } from "react";
import { Article, ArticlesResponse } from "@/lib/api";
import { useSearchParams, useRouter } from "next/navigation";
import { useToken } from "@/hooks/useToken";

export default function HomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = useToken();
  
  const [articlesResponse, setArticlesResponse] = useState<ArticlesResponse>({
    articles: [],
    pagination: {
      currentPage: 1,
      limit: 10,
      totalCount: 0,
      totalPages: 0,
      hasNext: false,
      hasPrev: false
    }
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(() => {
    return parseInt(searchParams.get('page') || '1', 10);
  });
  const [limit, setLimit] = useState(() => {
    return parseInt(searchParams.get('limit') || '10', 10);
  });

  const loadArticles = async (page: number = currentPage, pageLimit: number = limit) => {
    setLoading(true);
    try {
      const data = await getArticles(pageLimit, page);
      setArticlesResponse(data);
    } catch (error) {
      setArticlesResponse({
        articles: [],
        pagination: {
          currentPage: page,
          limit: pageLimit,
          totalCount: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const updateURL = (page: number, pageLimit: number) => {
    const params = new URLSearchParams();
    if (token) params.append('token', token);
    if (page > 1) params.append('page', page.toString());
    if (pageLimit !== 10) params.append('limit', pageLimit.toString());
    
    const newUrl = `/${params.toString() ? `?${params.toString()}` : ''}`;
    router.replace(newUrl);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL(page, limit);
    loadArticles(page, limit);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1);
    updateURL(1, newLimit);
    loadArticles(1, newLimit);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                <span className="text-4xl">⚾</span>
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              🌟 まいにちほめる
            </h1>
            <p className="text-xl sm:text-2xl mb-4 text-blue-100">
              横浜DeNAベイスターズを毎日ポジティブに応援
            </p>
            <p className="text-lg text-blue-200 max-w-2xl mx-auto">
              選手たちの頑張りを褒め称える応援ブログ
            </p>
          </div>
        </div>
        
        {/* Wave decoration */}
        <div className="relative">
          <svg className="w-full h-12 fill-blue-50" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center">
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                📰 最新記事
              </span>
            </h2>
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
              <span>🔄 毎日更新</span>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl shadow-lg p-12 border border-blue-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  記事を読み込み中...
                </h3>
                <p className="text-gray-600">
                  ベイスターズの応援記事をお楽しみに！
                </p>
              </div>
            </div>
          ) : articlesResponse.articles.length > 0 ? (
            <>
              <ArticleList 
                articles={articlesResponse.articles} 
                currentPage={articlesResponse.pagination.currentPage}
                limit={articlesResponse.pagination.limit}
              />
              <PaginationComponent 
                pagination={articlesResponse.pagination}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
              />
            </>
          ) : (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl shadow-lg p-12 border border-blue-100">
                <div className="text-6xl mb-4">⚾</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  記事を準備中...
                </h3>
                <p className="text-gray-600">
                  ベイスターズの応援記事をお楽しみに！
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-800 to-blue-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-blue-200 mb-4">
            🌟 毎日ベイスターズを応援しよう！
          </p>
          <p className="text-sm text-blue-300">
            © 2025 まいにちほめる - 横浜DeNAベイスターズ応援ブログ
          </p>
        </div>
      </footer>
    </div>
  );
}
