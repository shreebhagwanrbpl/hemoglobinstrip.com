import AboutPage from "@/app/about/page";

export async function generateMetadata() {
  return {
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: "https://hemoglobinstrip.com/about",
    },
  };
}

export default async function Page({ params }) {

  const { district = "jaipur" } = await params;

  const city = district
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return <AboutPage city={city} />;
}