import { NextResponse } from "next/server";

// Lightweight health-check endpoint used by uptime monitors and CI smoke tests.
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "fincopilot-web",
    timestamp: new Date().toISOString(),
  });
}
