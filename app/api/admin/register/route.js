import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import rateLimit from "express-rate-limit";

// Rate limiter (Max 10 requests per 15 minutes per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests
  message: { error: "Too many requests, please try again later" },
});

export async function POST(req) {
  try {
    // Apply rate limiting
    await limiter(req, NextResponse.next());

    // Check authentication
    const session = await getServerSession(authOptions);

    // Only allow admins to create new admins
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    await connectDB();
    const { name, email, password } = await req.json();

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields (name, email, password) are required" },
        { status: 400 }
      );
    }

    // Check if admin already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Admin with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin user
    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    return NextResponse.json(
      {
        message: "Admin registered successfully",
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role, // Exclude password from response
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering admin:", error);
    return NextResponse.json(
      { error: "Failed to register admin: " + error.message },
      { status: 500 }
    );
  }
}
