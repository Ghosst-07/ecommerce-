import connectDB from "@/lib/db";
import Category from "@/models/category";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    // Only allow admins to create categories
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    await connectDB();
    const categoryData = await req.json();

    // Validate required fields
    if (!categoryData.name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    // Check if the category already exists
    const existingCategory = await Category.findOne({
      name: categoryData.name,
    });
    if (existingCategory) {
      return NextResponse.json(
        { error: "Category name already exists" },
        { status: 400 }
      );
    }

    // Create new category
    const newCategory = new Category({
      name: categoryData.name,
      description: categoryData.description,
    });

    // Save to database
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

    return NextResponse.json(
      { error: "Failed to add category: " + error.message },
      { status: 500 }
    );
  }
}
