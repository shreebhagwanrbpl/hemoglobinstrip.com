import ProductsPage from "@/app/items/page";

export async function generateMetadata() {
  return {
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: "https://hemoglobinstrip.com/items",
    },
  };
}

export default async function Page({ params }) {

  const { district = "jaipur" } = await params;

  const city = district
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return <ProductsPage city={city} />;
}
