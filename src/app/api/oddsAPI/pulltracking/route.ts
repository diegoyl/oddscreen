import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import schemas from '../../../../lib/schemas';

const TrackingArr = schemas["TrackingArr"];

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();
    
    const pull_market = request.headers.get("market");
    const mongo_response = await TrackingArr.findById("trackingIDs");
    const pulledData = mongo_response["data"][0];
    const marketSpecific = pulledData[pull_market];
    
    return NextResponse.json(marketSpecific);
  } catch (error) {
    console.warn("no pulltracking data found");
    return NextResponse.json([]);
  }
}
