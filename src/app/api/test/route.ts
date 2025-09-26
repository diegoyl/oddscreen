import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log("Test API route called");
  
  const testData = {
    message: "Test API is working",
    timestamp: new Date().toISOString()
  };
  
  return NextResponse.json(testData);
}
