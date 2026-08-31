export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/api",
        "/*?", // Disallow query parameters to prevent crawling filtered/sorted duplicate pages
      ],
    },
    sitemap: "https://hemoglobinstrip.com/sitemap.xml",
  };
}