import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { fetchFullCatalog } from "@/lib/data-fetcher-server";
import { makeSlug } from "@/lib/seo-engine";

export const revalidate = 86400; // Sitemap cache: 24 hours

export default async function sitemap() {
  const baseUrl = "https://hemoglobinstrip.com";
  const urls = [];

  // 1. Static Pages
  urls.push(
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/services`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
    { url: `${baseUrl}/products`, lastModified: new Date() }
  );

  try {
    // 2. Fetch active products from the server-cached dynamic catalog
    const products = await fetchFullCatalog();

    // 3. Fetch all serviceable districts from Firestore
    const districtSnap = await getDocs(
      collection(db, "websites", "hemoglobinstripcom", "districts")
    );
    const districts = districtSnap.docs.map((doc) => doc.data());

    // 4. Unique Categories and Brands
    const uniqueCategories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
    const uniqueBrands = Array.from(new Set(products.map((p) => p.brand).filter(Boolean)));

    // 5. Generate Category Silos
    uniqueCategories.forEach((category) => {
      const slug = makeSlug(category);
      urls.push({
        url: `${baseUrl}/category/${slug}`,
        lastModified: new Date(),
      });
      // Intent equipment silos
      urls.push(
        { url: `${baseUrl}/laboratory-equipment/${slug}`, lastModified: new Date() },
        { url: `${baseUrl}/diagnostic-equipment/${slug}`, lastModified: new Date() },
        { url: `${baseUrl}/biomedical-equipment/${slug}`, lastModified: new Date() }
      );
    });

    // 6. Generate Brand Silos
    uniqueBrands.forEach((brand) => {
      urls.push({
        url: `${baseUrl}/brand/${makeSlug(brand)}`,
        lastModified: new Date(),
      });
    });

    // 7. Generate Product Canonical Pages
    products.forEach((product) => {
      if (!product.slug) return;
      urls.push({
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: new Date(),
      });
      // Keep legacy items path indexable
      urls.push({
        url: `${baseUrl}/items/${product.slug}`,
        lastModified: new Date(),
      });
    });

    // 8. Generate Location & Localized Product Pages
    // To stay safely under Google's 50k sitemap limit, we build location pages dynamically
    districts.forEach((district) => {
      const distSlug = district.slug;
      if (!distSlug) return;

      // Local Hub Pages
      urls.push(
        {
          url: `${baseUrl}/district/${distSlug}`,
          lastModified: new Date(),
        },
        {
          url: `${baseUrl}/district/${distSlug}/products`,
          lastModified: new Date(),
        }
      );

      // Local Product Pages (limit to top products to keep sitemap under 50,000 URLs limit)
      // We will slice the product array if there are too many products in the catalog
      const activeProductsSlice = products.slice(0, 40);
      activeProductsSlice.forEach((product) => {
        if (!product.slug) return;
        urls.push({
          url: `${baseUrl}/district/${distSlug}/${product.slug}`,
          lastModified: new Date(),
        });
      });
    });

  } catch (error) {
    console.error("Sitemap Generation Error:", error);
  }

  return urls;
}