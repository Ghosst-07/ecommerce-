import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

async function fetchProducts() {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/getproduct`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data || !Array.isArray(data.products)) {
      throw new Error("API response does not contain a valid products array");
    }

    return data.products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return []; // Return an empty array if there's an error
  }
}

export default async function Home() {
  const products = await fetchProducts();

  return (
    <div>
      <Head>
        <title>Elegant Rugs | Home</title>
        <meta
          name="description"
          content="Discover a wide range of elegant rugs for your home."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Elegant Rugs</h1>
          <nav className="mt-2">
            <Link href="/shop" className="mr-4 hover:text-gray-300">
              Shop
            </Link>
            <Link href="/about" className="mr-4 hover:text-gray-300">
              About
            </Link>
            <Link href="/contact" className="hover:text-gray-300">
              Contact
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="text-center mb-8">
          <h2 className="text-4xl font-semibold mb-4">Find Your Perfect Rug</h2>
          <p className="text-lg text-gray-600">
            Explore our curated collection of high-quality rugs to elevate your
            home decor.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.slice(0, 6).map((product) => (
            <div
              key={product._id}
              className="border rounded-lg overflow-hidden shadow-md"
            >
              <Link href={`/product/${product.slug}`}>
                <div className="relative h-64">
                  <img
                    src={product.images[0]}
                    alt={product.productName}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">
                    {product.productName}
                  </h3>
                  <p className="text-gray-600">Rs {product.price}</p>
                </div>
              </Link>
            </div>
          ))}
        </section>

        <section className="text-center mt-8">
          <Link
            href="/shop"
            className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-full inline-block"
          >
            View All Rugs
          </Link>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>
          &copy; {new Date().getFullYear()} Elegant Rugs. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
