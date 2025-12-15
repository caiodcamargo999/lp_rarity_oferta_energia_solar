import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    GHL_PIPELINE_ID: process.env.GHL_PIPELINE_ID,
    GHL_STAGE_ID: process.env.GHL_STAGE_ID,
    GHL_LOCATION_ID: process.env.GHL_LOCATION_ID
  })
}
