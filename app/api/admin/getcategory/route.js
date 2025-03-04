import connectDB from "@/lib/db";
import Category from "@/models/category";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    // Fetch all categories from the database
    const categories = await Category.find({});

    return NextResponse.json(
      {
        message: "Categories retrieved successfully",
        categories: categories,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving categories:", error);
    return NextResponse.json(
      { error: "Failed to retrieve categories: " + error.message },
      { status: 500 }
    );
  }
}
