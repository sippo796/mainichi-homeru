import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // トークンを環境変数から取得（または固定値）
  const VALID_TOKEN = process.env.ACCESS_TOKEN || 'baystars2025homeru';
  
  // URLからトークンを取得
  const token = request.nextUrl.searchParams.get('token');
  
  // トークンが正しくない場合は404を返す
  if (token !== VALID_TOKEN) {
    // 404ページを返す（存在しないように見せる）
    return new NextResponse('Not Found', { status: 404 });
  }
  
  // 正しいトークンの場合は通常処理
  return NextResponse.next();
}

// すべてのページに適用
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}