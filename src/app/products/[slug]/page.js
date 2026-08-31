import { fetchFullCatalog } from "@/lib/data-fetcher-server";
import ProductDetails from "@/app/items/[slug]/ProductDetails";

export const revalidate = 3600; // Cache refresh: 1 hour

// Generate dynamic sitemap parameter helper (return empty array to prevent build timeout and generate on-demand)
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const products = await fetchFullCatalog();
  const product = products.find((p) => p.slug === slug);

  // Fallback string conversion if not found in db
  const fallbackName = slug
    ?.replace(/-/g, " ")
    ?.replace(/\b\w/g, (c) => c.toUpperCase());

  const productName = product?.title || fallbackName;
  const brandName = product?.brand || "Raj Biosis";

  const title = `${productName} Supplier in India | Price, Specs & Distributor | Raj Biosis`;
  const description = `Get the best quote for ${productName} by ${brandName}. Approved medical laboratory analyzer and biomedical equipment. We supply hospitals and diagnostic centers in India.`;
  const url = `https://hemoglobinstrip.com/products/${slug}`;

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
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  return <ProductDetails slug={slug} />;
}
