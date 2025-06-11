import { NextResponse } from 'next/server';
import { revalidateData } from '@/app/lib/revalidation';

export async function POST() {
  try {
    // Force revalidation of all cached data
    await revalidateData('/', ['questions', 'users', 'rewards', 'answers']);
    
    return NextResponse.json({ 
      success: true, 
      message: "Cache invalidated successfully",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Cache invalidation error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      message: "Cache invalidation failed"
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Use POST method to invalidate cache",
    endpoints: {
      "POST /api/cache/invalidate": "Invalidates all cached data"
    }
  });
}
