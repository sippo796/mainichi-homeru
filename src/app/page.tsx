'use client';

import { getArticles } from "@/lib/api";
import ArticleList from "@/components/ArticleList";
import { useEffect, useState } from "react";
import { Article } from "@/lib/api";

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setDebugInfo('Starting API call...');
        const articlesData = await getArticles();
        setDebugInfo(`API call successful. Articles: ${articlesData?.length || 0}`);
        setArticles(articlesData);
      } catch (error) {
        console.error('Failed to load articles:', error);
        setDebugInfo(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

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
                {debugInfo && (
                  <p className="text-sm text-blue-600 mt-4 p-2 bg-blue-50 rounded">
                    Debug: {debugInfo}
                  </p>
                )}
              </div>
            </div>
          ) : articles.length > 0 ? (
            <ArticleList articles={articles} />
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
                {debugInfo && (
                  <p className="text-sm text-red-600 mt-4 p-2 bg-red-50 rounded">
                    Debug: {debugInfo}
                  </p>
                )}
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
