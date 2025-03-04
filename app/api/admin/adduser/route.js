import connectDB from "@/lib/db";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB(); // Connect to the database

    const adminData = await req.json(); // Get admin data from request body

    // Validate required fields (Remove phone)
    if (!adminData.name || !adminData.email || !adminData.password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a new User instance with admin role
    const newAdmin = new User({
      name: adminData.name,
      email: adminData.email,
      password: adminData.password, // Consider hashing before saving
      role: "admin",
    });

    // Save the new admin to the database
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
