import connectDB from "@/lib/db";
import Product from "@/models/product";
import Category from "@/models/category"; // Import the Category model
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    // Fetch all products from the database
    const products = await Product.find({}).populate("category"); // Populate category field

    return NextResponse.json(
      {
        message: "Products retrieved successfully",
        products: products,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving products:", error);
    return NextResponse.json(
      { error: "Failed to retrieve products: " + error.message },
      { status: 500 }
    );
  }
}
