/**
 * SEO Safety & Optimization Engine for Programmatic SEO
 * Generates location-aware metadata, structured schemas, local FAQs, and quality score gates.
 */

// Helper to clean slug text
export const makeSlug = (text = "") =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

/**
 * Generate a dynamic description based on state delivery parameters.
 * Avoids doorway duplication by tailoring the content to shipping realities.
 */
export function getLocalDeliveryText(district, state) {
  if (!district || !state) return "";
  
  const stateLower = state.toLowerCase();
  
  if (stateLower.includes("rajasthan")) {
    return `We serve medical laboratories, hospitals, and clinics in ${district}, Rajasthan with fast 24-48 hour delivery and prompt on-site technician deployment from our central headquarters in Jaipur.`;
  }
  
  if (
    stateLower.includes("gujarat") || 
    stateLower.includes("haryana") || 
    stateLower.includes("delhi") || 
    stateLower.includes("uttar pradesh") || 
    stateLower.includes("madhya pradesh")
  ) {
    return `We provide reliable delivery (3-4 business days) of advanced laboratory analyzers and diagnostics reagents to healthcare facilities in ${district}, ${state}. Technical support is available via phone, remote desktop, or on-site visits scheduled from regional clusters.`;
  }
  
  return `We support diagnostic centres and clinical laboratories across ${district}, ${state} with fully insured transport delivery and dedicated technical installation assistance from our biomedical engineering team.`;
}

/**
 * Generates structured LocalBusiness schema details if appropriate
 */
export function getLocalBusinessSchema(district, state, currentUrl, phone = "+918318368383", email = "mail@rajbiosis.com") {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `Biomedical Equipment Supplier in ${district} | Raj Biosis`,
    "description": getLocalDeliveryText(district, state),
    "url": currentUrl,
    "telephone": phone,
    "email": email,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": district,
      "addressRegion": state,
      "addressCountry": "IN"
    },
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": district
    },
    "parentOrganization": {
      "@type": "Organization",
      "name": "Raj Biosis",
      "url": "https://hemoglobinstrip.com",
      "logo": "https://hemoglobinstrip.com/logo.png"
    }
  };
}

/**
 * Generates dynamic local FAQs for a product in a specific location.
 */
export function getLocalProductFAQs(productName, district, state) {
  return [
    {
      question: `How is the ${productName} delivered to ${district}?`,
      answer: `All products, including the ${productName}, are packaged securely with shock-resistant wrapping and transit-insured carriers to ensure safe arrival in ${district}, ${state} within 3 to 5 business days.`
    },
    {
      question: `Do you provide installation and training for ${productName} in ${district}?`,
      answer: `Yes, we provide professional installation support, calibration services, and hands-on operational training for ${productName} in ${district}, ${state} through our team of expert service engineers.`
    },
    {
      question: `How can I request a quotation or price list for ${productName} in ${district}?`,
      answer: `You can submit a query using the contact form on this page or email us at mail@rajbiosis.com. Our team will prepare a custom quotation including delivery charges to ${district} and send it to you within 24 hours.`
    }
  ];
}

/**
 * SEO Quality Gate System
 * Calculates a technical quality score from 0 to 100.
 * If score is below 70, indexability is set to noindex.
 */
export function calculateSEOQualityScore({
  type, // 'home' | 'product' | 'category' | 'brand' | 'district' | 'district-product'
  title = "",
  description = "",
  hasContent = false,
  hasProducts = false,
  hasLinks = false,
  canonicalUrl = ""
}) {
  let score = 0;

  // 1. Technical Basics (30 pts)
  if (title && title.length > 20 && title.length < 80) score += 10;
  if (description && description.length > 50 && description.length < 200) score += 10;
  if (canonicalUrl && canonicalUrl.startsWith("https://")) score += 10;

  // 2. Content Substance (30 pts)
  if (hasContent) score += 15;
  if (hasProducts) score += 15;

  // 3. Navigation & Architecture (20 pts)
  if (hasLinks) score += 20;

  // 4. Intent & Authority Alignment (20 pts)
  if (type === "home" || type === "product" || type === "category" || type === "brand") {
    // High-value search intents have automatic structural bonus
    score += 20;
  } else if (type === "district-product" || type === "district") {
    // Location intent requires active dynamic content to get full authority points
    if (hasContent && hasProducts) {
      score += 20;
    } else {
      score += 5; // Penalty for thin/empty location index page
    }
  }

  const isIndexable = score >= 70;
  
  return {
    score,
    isIndexable,
    robotsRule: isIndexable ? "index, follow" : "noindex, follow"
  };
}
