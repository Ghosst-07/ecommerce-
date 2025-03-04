import connectDB from "@/lib/db";
import { NextResponse } from "next/server";
import User from "@/models/user"; // Assuming you have a User model

export async function GET() {
  try {
    await connectDB();

    const admins = await User.find({ role: "admin" });

    return NextResponse.json(admins, { status: 200 });
  } catch (error) {
    console.error("Error fetching admins:", error);
    return NextResponse.json(
      { error: "Failed to fetch admins: " + error.message },
      { status: 500 }
    );
  }
}
