import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/product";

export async function PUT(request) {
  try {
    // Connect to the database
    await connectDB();

    // Parse the request body
    const body = await request.json();
    console.log("Request Body:", body); // Log the request body

    const { slug, ...updatedFields } = body;

    // Validate required fields
    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    // Find and update the product
    const updatedProduct = await Product.findOneAndUpdate(
      { slug }, // Find by slug
      updatedFields, // Update with the provided fields
      { new: true, runValidators: true } // Return the updated document and run validators
    ).populate("category"); // Populate the category field

    // Check if the product was found and updated
    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Log the updated product for debugging
    console.log("Updated Product:", updatedProduct);

    // Return the updated product
    return NextResponse.json(
      { message: "Product updated successfully", product: updatedProduct },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
