'use client';

import { getArticle } from "@/lib/api";
import Link from "next/link";
import BackLink from "@/components/BackLink";
import { useEffect, useState } from "react";
import { Article } from "@/lib/api";

export default function ArticlePage(props: {
  params: Promise<{ articleId: string }>;
}) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const params = await props.params;
        const { articleId } = params;
        
        const articleData = await getArticle(articleId);
        setArticle(articleData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [props.params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">記事を読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <p className="text-xl text-gray-500 mb-2">記事を読み込めませんでした</p>
          <p className="text-gray-400">{error || '記事が見つかりません'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="mb-6">
            <BackLink />
          </nav>
          
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <span className="text-2xl">⚾</span>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold">
                  {article.title || "まいにちほめる"}
                </h1>
                {article.timePeriod && (
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                    {article.timePeriod === 'morning' ? '🌅 朝の記事' : '🌙 夜の記事'}
                  </span>
                )}
              </div>
              <time className="text-blue-100 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(article.datetime).toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "long", 
                  day: "numeric"
                })}
                <span className="ml-2 text-xs opacity-70">
                  {article.time.slice(0, 2)}:{article.time.slice(2)}
                </span>
                {article.filename && (
                  <span className="ml-2 text-xs opacity-70">({article.filename})</span>
                )}
              </time>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
          <div className="p-8 sm:p-12">
            {article.content ? (
              <div
                className="prose prose-lg prose-blue max-w-none"
                dangerouslySetInnerHTML={{
                  __html: article.content
                    .replace(/^# (.*$)/gm, '<h1 class="text-4xl font-bold mb-8 text-transparent bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text">$1</h1>')
                    .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mb-6 text-blue-700 border-l-4 border-blue-500 pl-4">$2</h2>')
                    .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mb-4 text-blue-600">$1</h3>')
                    .replace(/\n\n/g, '</p><p class="mb-6 text-gray-700 leading-relaxed">')
                    .replace(/^(.+)$/gm, '<p class="mb-6 text-gray-700 leading-relaxed">$1</p>')
                    .replace(/<p class="mb-6[^>]*"><h/g, '<h')
                    .replace(/h[1-3]><\/p>/g, function(match) {
                      return match.replace(/<\/p>$/, '');
                    })
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-blue-800">$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em class="italic text-blue-700">$1</em>'),
                }}
              />
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">😔</div>
                <p className="text-xl text-gray-500 mb-2">記事の内容を読み込めませんでした</p>
                <p className="text-gray-400">少し時間をおいてからもう一度お試しください</p>
              </div>
            )}
          </div>

          {/* AI Generated Notice */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-8 sm:px-12 py-4 border-t border-purple-100">
            <div className="flex items-center justify-center">
              <div className="flex items-center text-sm text-gray-600 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 border border-purple-200">
                <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span className="font-medium text-purple-700">🤖 この記事はAIが生成しています</span>
                <span className="mx-2 text-purple-400">•</span>
                <span className="text-purple-600">最新情報を基に愛情込めて作成</span>
              </div>
            </div>
          </div>

          {/* Article Footer */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-8 sm:px-12 py-6 border-t border-blue-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center text-sm text-gray-600 mb-4 sm:mb-0">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium mr-3">
                  応援記事
                </span>
                <span>🌟 毎日更新中</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors text-sm font-medium">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  応援する
                </button>
              </div>
            </div>
          </div>
        </article>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-800 to-blue-900 text-white py-8 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-blue-200 mb-2">
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
