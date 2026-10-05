import { WEBSITE_ID } from "@/lib/catalog-utils";
import Home from "@/app/page";
import { db, doc, collection, getDoc, getDocs, addDoc, onSnapshot } from "@/lib/firestore-shim";
import { getLocalDeliveryText, getLocalBusinessSchema } from "@/lib/seo-engine";
import { notFound } from "next/navigation";

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  
  try {
    const snap = await getDoc(doc(db, "websites", WEBSITE_ID, "districts", slug));
    if (!snap.exists()) {
      return { title: "Location Not Found | Raj Biosis" };
    }
    
    const districtData = snap.data();
    const city = districtData.district;
    const state = districtData.state;
    
    const title = `Biomedical & Diagnostic Equipment Supplier in ${city}, ${state} | Raj Biosis`;
    const description = getLocalDeliveryText(city, state);
    const url = `https://hemoglobinstrip.com/district/${slug}`;
    
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
    console.error("Error generating metadata for district:", error);
    return { title: "Biomedical Supplier | Raj Biosis" };
  }
}

export default async function DistrictPage({ params }) {
  const { slug } = await params;
  
  const snap = await getDoc(doc(db, "websites", WEBSITE_ID, "districts", slug));
  if (!snap.exists()) {
    notFound();
  }

  const districtData = snap.data();
  const city = districtData.district;

  return <Home city={city} />;
}
