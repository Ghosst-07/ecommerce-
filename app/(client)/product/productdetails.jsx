"use client"; // This must be a client component

import React, { useState } from "react";

const ProductDetails = ({ product }) => {
  const [mainImage, setMainImage] = useState(product.images?.[0]);

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 p-4">
            <img
              src={mainImage}
              alt={product.productName}
              className="w-full h-64 object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="flex justify-center mt-4">
              {product.images?.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.productName} ${index + 1}`}
                  className="w-16 h-16 object-cover mx-2 border border-gray-300 cursor-pointer"
                  onClick={() => setMainImage(image)}
                />
              ))}
            </div>
          </div>
          <div className="md:w-1/2 p-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {product.productName}
            </h1>
            <div className="flex items-center mb-4">
              <span className="text-yellow-500">★★★★☆</span>
              <span className="text-gray-600 ml-2">(1234 ratings)</span>
            </div>
            <p className="text-lg md:text-xl text-gray-700 mb-4">
              ${product.price}
            </p>
            <p className="text-gray-700 mb-6">{product.description}</p>
            <div className="mb-4">
              <span className="text-gray-600">Condition: </span>
              <span className="text-gray-800 font-semibold">
                {product.condition}
              </span>
            </div>
            <div className="mb-4">
              <span className="text-gray-600">Seller: </span>
              <span className="text-gray-800 font-semibold">
                {product.seller}
              </span>
            </div>
            <div className="mb-4">
              <span className="text-gray-600">Shipping: </span>
              <span className="text-gray-800 font-semibold">
                {product.shipping}
              </span>
            </div>
            <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg transition-colors duration-300 hover:bg-yellow-600">
              Add to Cart
            </button>
            <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg ml-4 transition-colors duration-300 hover:bg-gray-300">
              Buy Now
            </button>
          </div>
        </div>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
          <div className="space-y-4">
            {product.reviews?.map((review, index) => (
              <div key={index} className="border-b border-gray-200 pb-4">
                <div className="flex items-center mb-2">
                  <span className="text-yellow-500">★★★★☆</span>
                  <span className="text-gray-600 ml-2">
                    {review.rating} out of 5
                  </span>
                </div>
                <p className="text-gray-800 font-semibold">{review.title}</p>
                <p className="text-gray-600">{review.content}</p>
                <p className="text-gray-500 text-sm">
                  By {review.author} on {review.date}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
