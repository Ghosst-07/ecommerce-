import connectDB from "@/lib/db";
import Product from "@/models/product";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    // Only allow admins to create products
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    await connectDB();

    const productData = await req.json();

    // Validate required fields
    const requiredFields = [
      "productName",
      "size",
      "color",
      "features",
      "idealFor",
      "material",
      "description",
      "images",
      "category",
      "slug", // Ensure slug is required
    ];

    const missingFields = requiredFields.filter((field) => !productData[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Check if a product with the same slug already exists
    const existingProduct = await Product.findOne({ slug: productData.slug });
    if (existingProduct) {
      return NextResponse.json(
        { error: "A product with this slug already exists" },
        { status: 400 }
      );
    }

    // Create a new Product instance
    const newProduct = new Product(productData);

    // Save the new product to the database
    const savedProduct = await newProduct.save();

    return NextResponse.json(
      {
        message: "Product added successfully",
        product: savedProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json(
      { error: "Failed to add product: " + error.message },
      { status: 500 }
    );
  }
}
