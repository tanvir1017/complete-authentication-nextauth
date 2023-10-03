import { dbConnect } from "@/database/mongo.config";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  dbConnect();
  return new NextResponse(
    JSON.stringify({
      check: "checking",
    })
  );
};
