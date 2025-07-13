import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return {
    status: 200,
    body: "stripe webhook",
  };
}
