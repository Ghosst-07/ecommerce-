// app/product/[slug]/page.jsx
import ProductDetails from "../productdetails";

const ProductPage = async ({ params }) => {
  // Ensure params is awaited correctly
  const { slug } = await Promise.resolve(params);

  // Fetch product data on the server-side
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/client/products/${slug}`,
    {
      next: { revalidate: 60 },
    }
  );

  if (!response.ok) {
    console.error("Failed to fetch product:", response.statusText);
    return <p>Product not found</p>;
  }

  const data = await response.json();
  const product = data.product;

  return <ProductDetails product={product} />; // Pass product as prop
};

export default ProductPage;
