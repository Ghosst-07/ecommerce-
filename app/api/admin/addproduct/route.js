import connectDB from "@/lib/db";
import Product from "@/models/product";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(req) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    // Only allow admins to edit products
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
      "price",
      "productName",
      "size",
      "color",
      "features",
      "idealFor",
      "material",
      "description",
      "images",
      "category",
      "slug",
    ];

    const missingFields = requiredFields.filter(
      (field) => productData[field] === undefined || productData[field] === null
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Find the product by slug
    const product = await Product.findOne({ slug: productData.slug });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Update the product fields
    product.price = productData.price;
    product.productName = productData.productName;
    product.size = productData.size;
    product.color = productData.color;
    product.features = productData.features;
    product.idealFor = productData.idealFor;
    product.material = productData.material;
    product.description = productData.description;
    product.images = productData.images;
    product.category = productData.category;

    // Save the updated product
    const updatedProduct = await product.save();

    return NextResponse.json(
      {
        message: "Product updated successfully",
        product: updatedProduct,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product: " + error.message },
      { status: 500 }
    );
  }
}
