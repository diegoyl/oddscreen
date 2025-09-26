import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import schemas from '../../../../lib/schemas';

const CsvData = schemas["CsvData"];

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();
    
    const pull_market = request.headers.get("market");
    const mongo_response = await CsvData.findById(pull_market);
    const pulledData = mongo_response["data"];
    
    return NextResponse.json(pulledData);
  } catch (error) {
    console.warn("no csvData data found");
    return NextResponse.json("");
  }
}
