// app/api/client/products/[slug]/route.js
import connectDB from "@/lib/db";
import Product from "@/models/product";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { slug } = await params; // Await params before accessing slug
    const product = await Product.findOne({ slug }).populate("category");

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
