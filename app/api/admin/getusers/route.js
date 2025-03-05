import connectDB from "@/lib/db";
import { NextResponse } from "next/server";
import User from "@/models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req) {
  try {
    // Get session (Check if user is logged in)
    const session = await getServerSession(authOptions);

    // If no session or user is not an admin, deny access
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Fetch only users with role "admin"
    const admins = await User.find({ role: "admin" }).select("-password");

    return NextResponse.json(admins, { status: 200 });
  } catch (error) {
    console.error("Error fetching admins:", error);
    return NextResponse.json(
      { error: "Failed to fetch admins: " + error.message },
      { status: 500 }
    );
  }
}
