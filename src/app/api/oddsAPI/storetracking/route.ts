import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import schemas from '../../../../lib/schemas';

const TrackingArr = schemas["TrackingArr"];

export async function POST(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();
    
    const new_data = request.headers.get("arr");
    const mkt = request.headers.get("market");
    if (mkt == "h2h") {
      await TrackingArr.findOneAndUpdate(
        {_id:"trackingIDs"},
        { $set: { "data.h2h": new_data }}
      );
    } else if (mkt == "spreads") {
      await TrackingArr.findOneAndUpdate(
        {_id:"trackingIDs"},
        { $set: { "data.spreads": new_data }}
      );
    } else if (mkt == "totals") {
      await TrackingArr.findOneAndUpdate(
        {_id:"trackingIDs"},
        { $set: { "data.totals": new_data }}
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("Error storing tracking data:", error);
    return NextResponse.json({ error: "Failed to store tracking data" }, { status: 500 });
  }
}
