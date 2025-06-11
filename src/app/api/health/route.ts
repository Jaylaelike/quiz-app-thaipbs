import { NextResponse } from 'next/server';
import { db } from '@/app/lib/db';

export async function GET() {
  try {
    // Test database connection with a simple query
    const result = await db.$queryRaw`SELECT NOW() as current_time, version() as db_version`;
    
    // Test if we can read from the database
    const userCount = await db.user.count();
    const questionCount = await db.question.count();
    
    return NextResponse.json({ 
      success: true, 
      timestamp: result[0].current_time,
      database_version: result[0].db_version,
      statistics: {
        users: userCount,
        questions: questionCount
      },
      message: "Database connection successful",
      environment: process.env.NODE_ENV 
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      message: "Database connection failed"
    }, { status: 500 });
  }
}
