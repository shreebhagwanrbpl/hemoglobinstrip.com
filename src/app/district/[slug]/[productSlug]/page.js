import { WEBSITE_ID } from "@/lib/catalog-utils";
import ProductDetails from "@/app/items/[slug]/ProductDetails";
import { db, doc, collection, getDoc, getDocs, addDoc, onSnapshot } from "@/lib/firestore-shim";
import { fetchFullCatalog } from "@/lib/data-fetcher-server";
import { getLocalDeliveryText, getLocalProductFAQs } from "@/lib/seo-engine";
import { notFound } from "next/navigation";

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { slug: districtSlug, productSlug } = await params;
  
  try {
    // 1. Fetch District Details
    const districtSnap = await getDoc(doc(db, "websites", WEBSITE_ID, "districts", districtSlug));
    if (!districtSnap.exists()) {
      return { title: "Product | Raj Biosis" };
    }
    const districtData = districtSnap.data();
    const city = districtData.district;
    const state = districtData.state;

    // 2. Fetch Product Catalog
    const products = await fetchFullCatalog();
    const product = products.find((p) => p.slug === productSlug);
    
    const fallbackName = productSlug
      ?.replace(/-/g, " ")
      ?.replace(/\b\w/g, (c) => c.toUpperCase());
      
    const productName = product?.title || fallbackName;
    const brandName = product?.brand || "Raj Biosis";

    const title = `${productName} Supplier in ${city}, ${state} | Price & Quote | Raj Biosis`;
    const description = `Buy ${productName} by ${brandName} in ${city}, ${state}. We provide secure shipping, onsite engineering installation, and technical service support.`;
    const url = `https://hemoglobinstrip.com/district/${districtSlug}/${productSlug}`;

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
    };
  } catch (error) {
    console.error("Error generating district-product metadata:", error);
    return { title: "Biomedical Supplier | Raj Biosis" };
  }
}

export default async function DistrictProductPage({ params }) {
  const { slug: districtSlug, productSlug } = await params;
  
  // Verify district exists
  const districtSnap = await getDoc(doc(db, "websites", WEBSITE_ID, "districts", districtSlug));
  if (!districtSnap.exists()) {
    notFound();
  }

  return (
    <ProductDetails
      slug={productSlug}
      district={districtSlug}
    />
  );
}
