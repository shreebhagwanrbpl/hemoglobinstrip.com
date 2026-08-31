import { fetchFullCatalog } from "@/lib/data-fetcher-server";
import ProductsClient from "@/app/items/ProductsClient";
import { makeSlug } from "@/lib/seo-engine";
import { notFound } from "next/navigation";

export const revalidate = 3600; // Cache refresh: 1 hour

// Generate static params for categories
export async function generateStaticParams() {
  try {
    const products = await fetchFullCatalog();
    const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
    return categories.map((cat) => ({
      slug: makeSlug(cat),
    }));
  } catch (error) {
    console.error("Error generating static params for categories:", error);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const products = await fetchFullCatalog();
  
  // Find the exact category name
  const matchedProduct = products.find((p) => makeSlug(p.category) === slug);
  if (!matchedProduct) {
    return { title: "Category Not Found | Raj Biosis" };
  }
  
  const categoryName = matchedProduct.category;
  const title = `${categoryName} Supplier in India | Price & Specifications | Raj Biosis`;
  const description = `Buy premium ${categoryName} and laboratory equipment. Find top brands, technical specifications, and dealer price quotes from Raj Biosis.`;
  const url = `https://hemoglobinstrip.com/category/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
    },
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const allProducts = await fetchFullCatalog();
  
  // Filter products for this specific category
  const filteredProducts = allProducts.filter(
    (p) => p.category && makeSlug(p.category) === slug
  );

  if (filteredProducts.length === 0) {
    notFound();
  }

  return (
    <ProductsClient
      initialProducts={filteredProducts}
      district={null}
      city={null}
    />
  );
}
