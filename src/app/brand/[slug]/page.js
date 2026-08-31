import { fetchFullCatalog } from "@/lib/data-fetcher-server";
import ProductsClient from "@/app/items/ProductsClient";
import { makeSlug } from "@/lib/seo-engine";
import { notFound } from "next/navigation";

export const revalidate = 3600; // Cache refresh: 1 hour

// Generate static params for brands (return empty array to prevent build timeout and generate on-demand)
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const products = await fetchFullCatalog();
  
  // Find the exact brand name
  const matchedProduct = products.find((p) => makeSlug(p.brand) === slug);
  if (!matchedProduct) {
    return { title: "Brand Not Found | Raj Biosis" };
  }
  
  const brandName = matchedProduct.brand;
  const title = `${brandName} Laboratory & Diagnostic Equipment Supplier | Raj Biosis`;
  const description = `Get quotes for premium diagnostic systems, reagents and equipment manufactured by ${brandName}. Verified supplier and service provider in India.`;
  const url = `https://hemoglobinstrip.com/brand/${slug}`;

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

export default async function BrandPage({ params }) {
  const { slug } = await params;
  const allProducts = await fetchFullCatalog();
  
  // Filter products for this specific brand
  const filteredProducts = allProducts.filter(
    (p) => p.brand && makeSlug(p.brand) === slug
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
