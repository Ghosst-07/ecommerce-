import React, { useEffect, useState } from "react";
import { Trash, ChevronDown, ChevronUp, X, Check } from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

// Edit Product Form Component
const EditProductForm = ({
  product,
  onSave,
  onCancel,
  isSaving,
  categories,
}) => {
  const [formData, setFormData] = useState({
    productName: product.productName,
    description: product.description,
    price: product.price || 0,
    size: product.size,
    color: product.color,
    features: product.features,
    idealFor: product.idealFor,
    material: product.material,
    images: product.images,
    category: product.category?._id,
    slug: product.slug,
  });

  const [isUpdated, setIsUpdated] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddImage = (newUrl) => {
    if (newUrl) {
      setFormData((prev) => ({ ...prev, images: [...prev.images, newUrl] }));
    }
  };

  const handleDeleteImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onSave(formData);
    if (success) {
      setIsUpdated(true);
      toast.success("Product updated successfully!");
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-md animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Product Name", name: "productName", type: "text" },
            { label: "Price", name: "price", type: "number" },
            { label: "Size", name: "size", type: "text" },
            { label: "Color", name: "color", type: "text" },
            { label: "Features", name: "features", type: "text" },
            { label: "Ideal For", name: "idealFor", type: "text" },
            { label: "Material", name: "material", type: "text" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500"
            rows="4"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Images
          </label>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`Preview ${index}`}
                  className="w-24 h-24 rounded-lg shadow-md border border-gray-200 object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <input
              placeholder="Image URL"
              type="text"
              className="p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500"
              onBlur={(e) => handleAddImage(e.target.value)}
            />
            <button
              type="button"
              className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Add Image
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className={`px-4 py-2 text-white rounded-md transition-colors ${
              isUpdated
                ? "bg-green-500 hover:bg-green-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={isSaving || isUpdated}
          >
            {isUpdated
              ? "Product Updated"
              : isSaving
              ? "Saving..."
              : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </form>
    </div>
  );
};

// Main Edit Product Component
function EditProduct() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [expandedProducts, setExpandedProducts] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch("/api/admin/getproduct"),
          fetch("/api/admin/getcategory"),
        ]);

        if (!productsRes.ok || !categoriesRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const [productsData, categoriesData] = await Promise.all([
          productsRes.json(),
          categoriesRes.json(),
        ]);

        setProducts(productsData.products);
        setCategories(categoriesData.categories);
      } catch (err) {
        setError(err.message);
        toast.error("Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleProductExpansion = (productId) => {
    setExpandedProducts((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  const handleSaveChanges = async (productId, updatedProduct) => {
    setIsSaving(true);
    try {
      const response = await axios.put("/api/admin/editproduct", {
        slug: updatedProduct.slug,
        ...updatedProduct,
      });

      if (response.status === 200) {
        setProducts((prev) =>
          prev.map((product) =>
            product._id === productId ? response.data.product : product
          )
        );
        return true;
      } else {
        throw new Error("Failed to update product");
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      toast.error("Failed to update product");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <Toaster position="top-right" />
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Product</h1>

      {isLoading && (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-600">Loading products...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md mb-6">
          Error: {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 border-b text-left">Image</th>
              <th className="py-3 px-4 border-b text-left">Product Name</th>
              <th className="py-3 px-4 border-b text-left">Slug</th>
              <th className="py-3 px-4 border-b text-left">Description</th>
              <th className="py-3 px-4 border-b text-left">Category</th>
              <th className="py-3 px-4 border-b text-left">Price</th>
              <th className="py-3 px-4 border-b text-left">Edit</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <React.Fragment key={product._id}>
                <tr
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => toggleProductExpansion(product._id)}
                >
                  <td className="py-3 px-4 border-b">
                    <img
                      src={product.images[0] || "https://placehold.co/300x150"}
                      alt={product.productName}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  </td>
                  <td className="py-3 px-4 border-b">{product.productName}</td>
                  <td className="py-3 px-4 border-b">
                    <p className="px-2 rounded-full bg-indigo-300 w-fit">
                      {product.slug}
                    </p>
                  </td>
                  <td className="py-3 px-4 border-b">
                    {product.description.split(" ").slice(0, 10).join(" ")}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {product.category?.name}
                  </td>
                  <td className="py-3 px-4 border-b">Rs {product.price}</td>
                  <td className="py-3 px-4 border-b">
                    <div className="flex gap-2">
                      {expandedProducts[product._id] ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colSpan="7">
                    <div
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        expandedProducts[product._id]
                          ? "max-h-[1000px]"
                          : "max-h-0"
                      }`}
                    >
                      <EditProductForm
                        product={product}
                        onSave={async (updatedProduct) => {
                          const success = await handleSaveChanges(
                            product._id,
                            updatedProduct
                          );
                          return success;
                        }}
                        onCancel={() => toggleProductExpansion(product._id)}
                        isSaving={isSaving}
                        categories={categories}
                      />
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {!isLoading && products.length === 0 && (
        <div className="text-center text-gray-600 mt-6">No products found.</div>
      )}
    </div>
  );
}

export default EditProduct;
