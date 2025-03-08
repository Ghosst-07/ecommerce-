"use client";
import React from "react";
import { useRouter } from "next/navigation";

function ProductButton({ product }) {
  const router = useRouter();
  return (
    <div>
      <button
        onClick={() => router.push(`/product/${product.slug}`)}
        className="mt-4 w-full bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-all duration-300"
      >
        View Detailsk
      </button>
    </div>
  );
}

export default ProductButton;
