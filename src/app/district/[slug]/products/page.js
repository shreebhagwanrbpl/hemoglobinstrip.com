import { WEBSITE_ID } from "@/lib/catalog-utils";
import ProductsPage from "@/app/items/page";
import { db, doc, collection, getDoc, getDocs, addDoc, onSnapshot } from "@/lib/firestore-shim";
import { notFound } from "next/navigation";

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  
  try {
    const snap = await getDoc(doc(db, "websites", WEBSITE_ID, "districts", slug));
    if (!snap.exists()) {
      return { title: "Products | Raj Biosis" };
    }
    
    const districtData = snap.data();
    const city = districtData.district;
    const state = districtData.state;
    
    const title = `Biomedical Equipment & Lab Analyzers in ${city}, ${state} | Raj Biosis`;
    const description = `Explore diagnostic devices, hematology cell counters, biochemistry systems, and reagents available for delivery and installation in ${city}, ${state}.`;
    const url = `https://hemoglobinstrip.com/district/${slug}/products`;
    
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
  } catch (error) {
    return { title: "Biomedical Equipment Catalog | Raj Biosis" };
  }
}

export default async function DistrictProductsPage({ params }) {
  const { slug } = await params;
  
  const snap = await getDoc(doc(db, "websites", WEBSITE_ID, "districts", slug));
  if (!snap.exists()) {
    notFound();
  }

  const districtData = snap.data();
  const city = districtData.district;

  return <ProductsPage city={city} district={slug} />;
}
