import connectDB from "@/lib/db";
import User from "@/models/user";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    // Only allow admins to create new admins
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    await connectDB(); // Connect to the database

    const adminData = await req.json();

    // Validate required fields
    if (!adminData.name || !adminData.email || !adminData.password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if admin with the same email exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    // Create new admin
    const newAdmin = new User({
      name: adminData.name,
      email: adminData.email,
      password: hashedPassword, // Store hashed password
      role: "admin",
    });

    // Save to database
    const savedAdmin = await newAdmin.save();

    return NextResponse.json(
      { message: "Admin added successfully", admin: savedAdmin },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding admin:", error);
    return NextResponse.json(
      { error: "Failed to add admin: " + error.message },
      { status: 500 }
    );
  }
}
