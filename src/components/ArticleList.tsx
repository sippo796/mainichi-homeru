'use client';

import Link from "next/link";
import { Article } from "@/lib/api";
import { useToken } from "@/hooks/useToken";

interface ArticleListProps {
  articles: Article[];
  currentPage?: number;
  limit?: number;
}

export default function ArticleList({ articles, currentPage = 1, limit = 10 }: ArticleListProps) {
  const token = useToken();
  
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article, index) => {
        const params = new URLSearchParams();
        if (token) params.append('token', token);
        if (currentPage > 1) params.append('page', currentPage.toString());
        if (limit !== 10) params.append('limit', limit.toString());
        const linkUrl = `/article/${article.articleId}${params.toString() ? `?${params.toString()}` : ''}`;
        
        return (
        <article key={article.articleId} className="group">
          <Link href={linkUrl} className="block">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-100 overflow-hidden h-full">
              {/* Card Header with gradient */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                        #{String((currentPage - 1) * limit + index + 1).padStart(2, '0')}
                      </span>
                      {article.timePeriod && (
                        <span className="text-xs font-semibold bg-white/30 px-2 py-1 rounded-full backdrop-blur-sm">
                          {article.timePeriod === 'morning' ? '🌅 朝' : '🌙 夜'}
                        </span>
                      )}
                    </div>
                    <span className="text-2xl">⚾</span>
                  </div>
                  <time className="text-sm text-blue-100 font-medium">
                    {new Date(article.datetime).toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                    <span className="ml-2 text-xs opacity-80">
                      {article.time.slice(0, 2)}:{article.time.slice(2)}
                    </span>
                  </time>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 flex-1 flex flex-col">
                <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                  {article.title || `${article.date}の記事`}
                </h2>
                
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 flex-1 mb-4">
                  {article.preview || "ベイスターズの選手たちを応援する記事です"}
                </p>

                {/* Read more indicator */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
                    記事を読む
                    <svg className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                  
                  {/* Category badges */}
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      応援記事
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
                      🤖 AI
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </article>
        );
      })}
    </div>
  );
}
