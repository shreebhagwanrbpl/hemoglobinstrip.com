import ProductDetails from "../../../items/[slug]/ProductDetails";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { fetchFullCatalog } from "@/lib/data-fetcher-server";

export const revalidate = 3600;

export async function generateMetadata({ params }) {
    const { slug, district } = await params;

    try {
        const districtSnap = await getDoc(doc(db, "websites", "hemoglobinstripcom", "districts", district));
        const districtData = districtSnap.exists() ? districtSnap.data() : null;
        const city = districtData?.district || district.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        const state = districtData?.state || "India";

        const products = await fetchFullCatalog();
        const product = products.find((p) => p.slug === slug);
        const fallbackName = slug?.replace(/-/g, " ")?.replace(/\b\w/g, (c) => c.toUpperCase());
        const productName = product?.title || fallbackName;
        const brandName = product?.brand || "Raj Biosis";

        const title = `${productName} Supplier in ${city}, ${state} | Price & Specifications | Raj Biosis`;
        const description = `Get quotes for ${productName} by ${brandName} in ${city}, ${state}. We provide secure packaging, prompt shipment delivery, and technical engineering installation.`;
        const url = `https://hemoglobinstrip.com/${district}/items/${slug}`;

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
    } catch (err) {
        console.error("Error generating metadata in [district]/items/[slug]:", err);
        return {
            title: `Biomedical Supplier | Raj Biosis`,
        };
    }
}

export default async function Page({ params }) {
    const { slug, district } = await params;

    return (
        <ProductDetails
            slug={slug}
            district={district}
        />
    );
}