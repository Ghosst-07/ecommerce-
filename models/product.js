import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  price: {
    type: Number,
    required: true,
  },
  productName: {
    type: String,
    required: true,
    trim: true,
  },
  size: {
    type: String,
    required: true,
    trim: true,
  },
  color: {
    type: String,
    required: true,
    trim: true,
  },
  features: {
    type: String,
    required: true,
    trim: true,
  },
  idealFor: {
    type: String,
    required: true,
    trim: true,
  },
  material: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true, // Ensure slugs are unique
  },
  images: [
    {
      type: String, // Store image URLs in an array
      required: true,
    },
  ],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "categories", // IMPORTANT: Must be "categories"
    required: true,
  },
  // You can add more fields here if needed, e.g., price, discount, stock, etc.
});

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
