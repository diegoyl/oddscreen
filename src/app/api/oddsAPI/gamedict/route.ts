import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import schemas from '../../../../lib/schemas';

const CurrentGameDicts = schemas["CurrentGameDicts"];

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();
    
    const pull_market = request.headers.get("market");
    const mongo_response = await CurrentGameDicts.findById(pull_market);
    const pulledData = mongo_response["gameDict"];
    
    return NextResponse.json(pulledData);
  } catch (error) {
    console.error("Error in gamedict route:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
