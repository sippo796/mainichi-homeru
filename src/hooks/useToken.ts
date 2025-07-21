'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useToken() {
  const [token, setToken] = useState<string>('baystars2025homeru'); // デフォルト値を設定
  const searchParams = useSearchParams();

  useEffect(() => {
    // URLからトークン取得
    const urlToken = searchParams.get('token');
    
    if (urlToken) {
      setToken(urlToken);
      if (typeof window !== 'undefined') {
        localStorage.setItem('blog_token', urlToken);
      }
    } else {
      // localStorageから取得（クライアントサイドのみ）
      if (typeof window !== 'undefined') {
        const savedToken = localStorage.getItem('blog_token') || 'baystars2025homeru';
        setToken(savedToken);
      }
    }
  }, [searchParams]);

  return token;
}