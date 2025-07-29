'use client';

import Link from "next/link";
import { useToken } from "@/hooks/useToken";
import { useSearchParams } from "next/navigation";

export default function BackLink() {
  const token = useToken();
  const searchParams = useSearchParams();
  
  const buildBackUrl = () => {
    const params = new URLSearchParams();
    if (token) params.append('token', token);
    
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');
    
    if (page && page !== '1') params.append('page', page);
    if (limit && limit !== '10') params.append('limit', limit);
    
    return `/${params.toString() ? `?${params.toString()}` : ''}`;
  };
  
  return (
    <Link 
      href={buildBackUrl()}
      className="inline-flex items-center text-blue-100 hover:text-white transition-colors"
    >
      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      記事一覧に戻る
    </Link>
  );
}