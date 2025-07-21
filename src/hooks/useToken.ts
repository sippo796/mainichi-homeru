'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useToken() {
  const [token, setToken] = useState<string>('');
  const searchParams = useSearchParams();

  useEffect(() => {
    // URLからトークン取得
    const urlToken = searchParams.get('token');
    
    if (urlToken) {
      setToken(urlToken);
      localStorage.setItem('blog_token', urlToken);
    } else {
      // localStorageから取得
      const savedToken = localStorage.getItem('blog_token') || 'baystars2025homeru';
      setToken(savedToken);
    }
  }, [searchParams]);

  return token;
}