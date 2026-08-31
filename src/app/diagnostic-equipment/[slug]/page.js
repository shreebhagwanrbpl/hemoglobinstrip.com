import { fetchFullCatalog } from "@/lib/data-fetcher-server";
import ProductsClient from "@/app/items/ProductsClient";
import { makeSlug } from "@/lib/seo-engine";
import { notFound } from "next/navigation";

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const products = await fetchFullCatalog();
    const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
    return categories.map((cat) => ({
      slug: makeSlug(cat),
    }));
  } catch (error) {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const products = await fetchFullCatalog();
  const matchedProduct = products.find((p) => makeSlug(p.category) === slug);
  if (!matchedProduct) return { title: "Diagnostic Equipment | Raj Biosis" };

  const categoryName = matchedProduct.category;
  const title = `Diagnostic ${categoryName} Analyzer Supplier in India | Raj Biosis`;
  const description = `Find specifications and pricing details for diagnostic-grade ${categoryName} systems and analyzers supplied by Raj Biosis.`;
  
  // Canonicalizes to the primary category page to prevent duplicate content
  const canonicalUrl = `https://hemoglobinstrip.com/category/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function DiagnosticEquipmentPage({ params }) {
  const { slug } = await params;
  const allProducts = await fetchFullCatalog();
  const filteredProducts = allProducts.filter(
    (p) => p.category && makeSlug(p.category) === slug
  );

  if (filteredProducts.length === 0) notFound();

  return (
    <ProductsClient
      initialProducts={filteredProducts}
      district={null}
      city={null}
    />
  );
}
