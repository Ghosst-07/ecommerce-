import connectDB from "@/lib/db";
import Category from "@/models/category";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    const categoryData = await req.json();

    // Validate required fields
    if (!categoryData.name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    // Create a new Category instance
    const newCategory = new Category({
      name: categoryData.name,
      description: categoryData.description,
    });

    // Save the new category to the database
    const savedCategory = await newCategory.save();

    return NextResponse.json(
      {
        message: "Category added successfully",
        category: savedCategory,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding category:", error);

    // Check if the error is a duplicate key error (category name already exists)
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Category name already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to add category: " + error.message },
      { status: 500 }
    );
  }
}
