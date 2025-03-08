"use client";
import React, { useState, useEffect } from "react";
import { Plus, X, Check, Image } from "lucide-react";

const productFields = [
  { label: "Product Name", name: "productName", type: "text", required: true },
  { label: "Size", name: "size", type: "text", required: true },
  { label: "Color", name: "color", type: "text", required: true },
  { label: "Features", name: "features", type: "text", required: true },
  { label: "Ideal For", name: "idealFor", type: "text", required: true },
  { label: "Material", name: "material", type: "text", required: true },
  { label: "Price", name: "price", type: "number", required: true },
];

function AddProduct() {
  const [formData, setFormData] = useState({
    price: "",
    productName: "",
    size: "",
    color: "",
    features: "",
    idealFor: "",
    material: "",
    description: "",
    images: [],
    currentImageUrl: "",
    category: "",
    slug: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/getcategory");
        const { categories } = await res.json();
        setCategories(categories);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setApiError("Failed to fetch categories.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const addImage = () =>
    formData.currentImageUrl &&
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, formData.currentImageUrl],
      currentImageUrl: "",
    }));
  const deleteImage = (index) =>
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));

  const validateForm = () => {
    const newErrors = {};
    productFields.forEach(
      (field) =>
        field.required &&
        !formData[field.name] &&
        (newErrors[field.name] = `${field.label} is required`)
    );
    !formData.description &&
      (newErrors.description = "Description is required");
    !formData.category && (newErrors.category = "Category is required");
    !formData.slug && (newErrors.slug = "Slug is required");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const res = await fetch("/api/admin/addproduct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        console.log("Product added successfully");
        setSubmitted(true);
        setFormData({
          price: "",
          productName: "",
          size: "",
          color: "",
          features: "",
          idealFor: "",
          material: "",
          description: "",
          images: [],
          currentImageUrl: "",
          category: "",
          slug: "",
        });
      } else {
        const { error } = await res.json();
        setApiError(error || "Failed to add product");
      }
    } catch (err) {
      setApiError("An unexpected error occurred");
      console.error("Error adding product:", err);
    }
  };

  const inputField = (field) => (
    <div key={field.name} className="mb-4">
      <label className="block text-sm font-medium text-gray-700">
        {field.label}
      </label>
      <input
        type={field.type}
        name={field.name}
        value={formData[field.name]}
        onChange={handleChange}
        placeholder={`Enter ${field.label}`}
        className={`mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
          errors[field.name] ? "border-red-500" : ""
        }`}
      />
      {errors[field.name] && (
        <p className="text-xs text-red-500 mt-1">{errors[field.name]}</p>
      )}
    </div>
  );

  const imagePreview = (img, i) => (
    <div
      key={i}
      className="relative inline-block mr-2 mb-2 transform transition-transform duration-300 hover:scale-105"
    >
      <img
        src={img}
        alt={`Preview ${i}`}
        className="inline-block w-24 h-24 mr-2 rounded-lg shadow-md border border-gray-200"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/placeholder-image.png";
        }}
      />
      <button
        type="button"
        onClick={() => deleteImage(i)}
        className="absolute top-1 right-1 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 active:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 transition duration-200"
      >
        {" "}
        <X size={12} />{" "}
      </button>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-blue-100 to-purple-100 min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        {submitted ? (
          <div className="text-center">
            {" "}
            <Check className="mx-auto h-12 w-12 text-green-500" />{" "}
            <h3 className="text-lg leading-6 font-medium text-green-500">
              {" "}
              Product Added Successfully!{" "}
            </h3>{" "}
            <p className="mt-2 text-sm text-gray-500">
              {" "}
              Thank you for adding a new product.{" "}
            </p>{" "}
            <button
              onClick={() => setSubmitted(false)}
              type="button"
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {" "}
              Add Another Product{" "}
            </button>{" "}
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
              {" "}
              Add Product Details{" "}
            </h2>{" "}
            {apiError && <p className="text-red-500 mb-4">{apiError}</p>}
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div>
                {" "}
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  {" "}
                  Product Details{" "}
                </h3>{" "}
                <div className="grid grid-cols-2 gap-4">
                  {" "}
                  {productFields.map(inputField)}{" "}
                  <div className="mb-4">
                    {" "}
                    <label className="block text-sm font-medium text-gray-700">
                      {" "}
                      Category{" "}
                    </label>{" "}
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                        errors.category ? "border-red-500" : ""
                      }`}
                    >
                      {" "}
                      <option value="">Select a category</option>{" "}
                      {isLoading ? (
                        <option disabled>Loading categories...</option>
                      ) : (
                        categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))
                      )}{" "}
                    </select>{" "}
                    {errors.category && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.category}
                      </p>
                    )}{" "}
                  </div>{" "}
                </div>{" "}
                <label className="block text-sm font-medium mt-4 text-gray-700">
                  {" "}
                  Description{" "}
                </label>{" "}
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={`mt-1 p-2 border border-gray-300 rounded-md w-full resize-none focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                    errors.description ? "border-red-500" : ""
                  }`}
                  rows="5"
                />{" "}
                {errors.description && (
                  <p className="text-xstext-red-500 mt-1">
                    {errors.description}
                  </p>
                )}{" "}
              </div>{" "}
              <div>
                {" "}
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  {" "}
                  Images <Image size={16} />{" "}
                </h3>{" "}
                <div className="flex items-end mb-4">
                  {" "}
                  <input
                    type="text"
                    name="currentImageUrl"
                    value={formData.currentImageUrl}
                    onChange={handleChange}
                    placeholder="Enter image URL"
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  />{" "}
                  <button
                    type="button"
                    onClick={addImage}
                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
                  >
                    {" "}
                    Add <Plus size={16} />{" "}
                  </button>{" "}
                </div>{" "}
                <div className="mt-4">
                  {" "}
                  {formData.images.map(imagePreview)}{" "}
                  {!formData.images.length && (
                    <p className="text-gray-500">No images added yet.</p>
                  )}{" "}
                </div>{" "}
                <p className="text-sm font-medium mt-4 text-gray-700">
                  {" "}
                  Image Guidelines:{" "}
                </p>{" "}
                <ul className="list-disc list-inside text-sm text-gray-500">
                  {" "}
                  <li>Use high-quality images.</li>{" "}
                  <li>Consistent background.</li>{" "}
                  <li>Clear product showcase.</li>{" "}
                </ul>{" "}
              </div>{" "}
              <div className="mb-4 md:col-span-2">
                {" "}
                <label className="block text-sm font-medium text-gray-700">
                  {" "}
                  Slug{" "}
                </label>{" "}
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="Enter slug"
                  className={`mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                    errors.slug ? "border-red-500" : ""
                  }`}
                />{" "}
                {errors.slug && (
                  <p className="text-xs text-red-500 mt-1">{errors.slug}</p>
                )}{" "}
              </div>{" "}
              <div className="mt-8 col-span-2 flex justify-center">
                {" "}
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
                >
                  {" "}
                  Submit{" "}
                </button>{" "}
              </div>{" "}
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default AddProduct;
