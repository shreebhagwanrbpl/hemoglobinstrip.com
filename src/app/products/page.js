import { fetchFullCatalog } from "@/lib/data-fetcher-server";
import ProductsClient from "@/app/items/ProductsClient";

export const revalidate = 3600; // Cache refresh rate: 1 hour

export async function generateMetadata() {
  const url = "https://hemoglobinstrip.com/products";
  return {
    title: "Buy Biomedical, Laboratory & Diagnostic Equipment | Raj Biosis",
    description: "Browse our complete catalog of medical laboratory equipment, diagnostic analyzers, rapid test kits, and reagents at best prices. Order from trusted suppliers in India.",
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: "Biomedical & Laboratory Equipment Catalog | Raj Biosis",
      description: "Explore advanced healthcare instruments and laboratory diagnostic systems.",
      url,
      type: "website",
    },
  };
}

export default async function ProductsPage() {
  const allProducts = await fetchFullCatalog();

  return (
    <ProductsClient
      initialProducts={allProducts}
      district={null}
      city={null}
    />
  );
}