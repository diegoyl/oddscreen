import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import schemas from '../../../../lib/schemas';

const WantDict = schemas["WantDict"];

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();
    
    const pull_market = request.headers.get("market");
    const mongo_response = await WantDict.findById("wantDict");
    const pulledData = mongo_response["data"][0];
    const marketSpecific = pulledData[pull_market];
    
    return NextResponse.json(marketSpecific);
  } catch (error) {
    console.warn("no data found: WantDict.findById");
    return NextResponse.json({});
  }
}
