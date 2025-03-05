import React, { useState, useEffect } from "react";

function Products() {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]); // Initialize as an array
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/admin/getproduct");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        console.log("API Response:", data); // Debugging: Log the API response

        // Ensure the response has a "products" key and it's an array
        if (data && Array.isArray(data.products)) {
          setProducts(data.products); // Set the products array
        } else {
          throw new Error(
            "API response does not contain a valid products array"
          );
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search query
  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Products Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-green-200 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium mb-2">Total Products</h2>
          <p className="text-2xl font-bold">{products.length}</p>
        </div>
        <div className="bg-red-200 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium mb-2">Product Sold</h2>
          <p className="text-2xl font-bold">150</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-600">Loading products...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md mb-6">
          Error: {error}
        </div>
      )}

      {/* Display products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4"
          >
            {/* Display the first image if available */}
            {product.images && product.images.length > 0 && (
              <img
                src={product.images[0]}
                alt={product.productName}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
            )}
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {product.productName}
            </h3>
            <p className="text-gray-600 text-sm mb-4">{product.description}</p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Category:</span>{" "}
              {product.category?.name}
            </p>
            <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-all duration-300">
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* No products found */}
      {!isLoading && filteredProducts.length === 0 && (
        <div className="text-center text-gray-600 mt-6">No products found.</div>
      )}
    </div>
  );
}

export default Products;
