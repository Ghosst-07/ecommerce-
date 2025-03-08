// app/(client)/page.js
import React from "react";

async function fetchProducts() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/getproduct`
    ); // Replace with your API endpoint
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const data = await response.json();

    // Ensure the response has a "products" key and it's an array
    if (!data || !Array.isArray(data.products)) {
      throw new Error("API response does not contain a valid products array");
    }

    return data.products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return []; // Return an empty array if there's an error
  }
}

export default async function LuxuryStorefront() {
  const products = await fetchProducts(); // Fetch products on the server

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="relative h-[400px] bg-black flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80')] bg-cover bg-center opacity-50"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            Welcome to Luxe
          </h1>
          <p className="text-xl text-gray-300">
            Discover the finest collection of luxury products
          </p>
        </div>
      </div>

      {/* Product Grid */}
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Our Collection
        </h2>

        {/* Display products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product._id}
              className="cursor-pointer bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105"
            >
              {/* Product Image */}
              {product.images && product.images.length > 0 && (
                <img
                  src={product.images[0]}
                  alt={product.productName}
                  className="w-full h-64 object-cover"
                />
              )}

              {/* Product Details */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {product.productName}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {product.description}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-semibold">Category:</span>{" "}
                  {product.category?.name}
                </p>
                <p className="text-lg font-bold text-gray-800 mb-4">
                  ${product.price}
                </p>
                <button className="mt-4 w-full bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-all duration-300">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No products found */}
        {products.length === 0 && (
          <div className="text-center text-gray-600 mt-6">
            No products found.
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-lg">Luxe &copy; 2023. All rights reserved.</p>
          <p className="text-sm text-gray-400">Crafted with ❤️ by Your Brand</p>
        </div>
      </footer>
    </div>
  );
}
