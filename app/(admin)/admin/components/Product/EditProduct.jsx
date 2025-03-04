import { useState, useEffect } from "react";
import { Pencil } from "lucide-react";

function EditProducts() {
  const [products, setProducts] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/admin/getproduct");
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4">Edit Products</h2>
      {isLoading ? (
        <p>Loading products...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105"
            >
              <img
                src={product.images[0]} // Display the first image
                alt={product.productName}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-medium mb-2">
                  {product.productName}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  {product.description.substring(0, 100)}...
                </p>
                <button className="flex items-center text-blue-500 hover:text-blue-700">
                  <Pencil size={16} className="mr-1" />
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EditProducts;
