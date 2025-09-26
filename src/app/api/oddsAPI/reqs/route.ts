import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import schemas from '../../../../lib/schemas';

const RawData = schemas["RawData"];

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();
    
    const mongo_response = await RawData.findById("reqsUsed");
    const pulledData = mongo_response["data"];
    
    return NextResponse.json(pulledData);
  } catch (error) {
    console.warn("no requestUsed data found");
    return NextResponse.json([]);
  }
}
