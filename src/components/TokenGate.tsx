'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface TokenGateProps {
  children: React.ReactNode;
}

export default function TokenGate({ children }: TokenGateProps) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const validToken = 'baystars2025homeru'; // 環境変数にすることも可能
    
    if (token === validToken) {
      setIsAuthorized(true);
      // トークンをlocalStorageに保存（一度認証すれば次回から不要）
      localStorage.setItem('blog_token', token);
    } else {
      // localStorageに保存されたトークンをチェック
      const savedToken = localStorage.getItem('blog_token');
      if (savedToken === validToken) {
        setIsAuthorized(true);
      }
    }
    
    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-blue-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">⚾</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            アクセスが制限されています
          </h1>
          <p className="text-gray-600">
            このページにアクセスするには正しいトークンが必要です
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}