import "server-only";

import { cache } from "react";

import {
  COMPANY_ID,
  WEBSITE_ID,
  makeSlug,
  isItemVisibleOnWebsite,
  isVisibleForWebsite,
} from "./catalog-utils";

import {
  adminFetch,
  fetchCatalogFromAdmin,
} from "./admin-api";

function unwrap(value) {
  return (
    value?.data ??
    value?.page ??
    value?.result ??
    value
  );
}

function firstValue(
  object,
  keys,
  fallback = ""
) {
  for (const key of keys) {
    if (
      object?.[key] !== undefined &&
      object?.[key] !== null &&
      object[key] !== ""
    ) {
      return object[key];
    }
  }

  return fallback;
}

function normalizeProduct(
  product = {},
  index = 0
) {
  const title =
    product.title ||
    product.name ||
    product.productName ||
    "Biomedical Equipment";

  const images =
    Array.isArray(product.images) &&
    product.images.length
      ? product.images
      : product.image
        ? [product.image]
        : product.imageUrl
          ? [product.imageUrl]
          : product.imgUrl
            ? [product.imgUrl]
            : [];

  const id =
    product.id ||
    product.uid ||
    product.productId ||
    `${makeSlug(title) || "product"}-${index}`;

  return {
    ...product,

    id,
    productId:
      product.productId || id,
    uid:
      product.uid || id,

    title,
    name: title,

    slug:
      product.slug ||
      makeSlug(title),

    desc:
      product.desc ??
      product.description ??
      "",

    description:
      product.description ??
      product.desc ??
      "",

    category:
      product.category ||
      "Diagnostic & Laboratory Equipment",

    categoryId:
      product.categoryId ||
      product.categoryID ||
      makeSlug(
        product.category ||
        "diagnostic"
      ),

    subCategory:
      product.subCategory ||
      product.subcategory ||
      product.category ||
      "General",

    subcategoryId:
      product.subcategoryId ||
      product.subCategoryId ||
      makeSlug(
        product.subCategory ||
        product.subcategory ||
        product.category ||
        "general"
      ),

    companyId:
      product.companyId ||
      COMPANY_ID,

    images,

    image:
      images[0] ||
      product.image ||
      "",

    video:
      product.video || "",

    pdf:
      product.pdf || "",

    brand:
      product.brand || "",

    model:
      product.model || "",

    capacity:
      product.capacity || "",

    throughput:
      product.throughput || "",

    instrument:
      product.instrument || "",

    usage:
      product.usage || "",

    parameters:
      product.parameters || "",

    automation:
      product.automation || "",

    availability:
      product.availability || "",

    size:
      product.size || "",

    isPublished:
      product.isPublished !== false,
  };
}

export async function fetchFullCatalog({
  companyId = COMPANY_ID,
  websiteId = WEBSITE_ID,
} = {}) {
  try {
    const raw =
      await fetchCatalogFromAdmin();

    if (!Array.isArray(raw)) {
      return [];
    }

    return raw
      .filter((item) =>
        isItemVisibleOnWebsite(
          item,
          websiteId
        )
      )
      .map(normalizeProduct);
  } catch (error) {
    console.error("[data-fetcher-server] fetchFullCatalog error:", error);
    return [];
  }
}

export const fetchWebsitePage = cache(
  async (
    pageType,
    websiteId = WEBSITE_ID
  ) => {
    try {
      const response =
        await adminFetch(
          "/api/site-data",
          {},
          {
            type: pageType,
            pageType,
            websiteId,
            companyId: COMPANY_ID,
          }
        );

      return unwrap(response);
    } catch (error) {
      console.error(`[data-fetcher-server] fetchWebsitePage (${pageType}) error:`, error);
      return null;
    }
  }
);

export const fetchDocCached = cache(
  async (path) => {
    const parts = String(
      path || ""
    )
      .split("/")
      .filter(Boolean);

    if (
      parts[0] === "__website__" &&
      parts[1] === "pages" &&
      parts[2]
    ) {
      return fetchWebsitePage(
        parts[2]
      );
    }

    if (
      parts[0] === "__website__" &&
      parts[1] === "districts" &&
      parts[2]
    ) {
      return fetchDistrictData(
        parts[2]
      );
    }

    if (
      parts[0] === "pages" &&
      parts[1]
    ) {
      return fetchWebsitePage(
        parts[1]
      );
    }

    if (
      parts[0] === "districts" &&
      parts[1]
    ) {
      return fetchDistrictData(
        parts[1]
      );
    }

    return null;
  }
);

export async function fetchHomeData() {
  return fetchWebsitePage("home");
}

export async function fetchContactData() {
  return fetchWebsitePage("contact");
}

export async function fetchServicesData() {
  return fetchWebsitePage("services");
}

export const fetchDistrictData = cache(
  async (
    district,
    websiteId = WEBSITE_ID
  ) => {
    if (!district) return null;

    const response =
      await adminFetch(
        "/api/site-data",
        {},
        {
          type: "district",
          pageType: "district",
          district,
          websiteId,
          companyId: COMPANY_ID,
        }
      );

    return unwrap(response);
  }
);

export const fetchDistricts = cache(
  async ({
    companyId = COMPANY_ID,
    websiteId = WEBSITE_ID,
  } = {}) => {
    const response =
      await adminFetch(
        "/api/site-data",
        {},
        {
          type: "districts",
          pageType: "districts",
          websiteId,
          companyId,
        }
      );

    const districts =
      response?.data?.districts ??
      response?.districts ??
      response?.data ??
      response;

    if (!Array.isArray(districts)) {
      return [];
    }

    return districts.map(
      (district, index) => ({
        ...(district || {}),
        id:
          district?.id ||
          district?.slug ||
          `dist-${index}`,
        slug:
          district?.slug ||
          district?.id ||
          makeSlug(
            district?.district ||
            district?.name ||
            `dist-${index}`
          ),
      })
    );
  }
);

export const fetchActiveDistricts =
  fetchDistricts;

export const fetchAllDistricts =
  fetchDistricts;

export async function fetchCategoriesTree({
  companyId = COMPANY_ID,
  websiteId = WEBSITE_ID,
} = {}) {
  try {
    const response =
      await adminFetch(
        "/api/catalog",
        {},
        {
          websiteId,
          companyId,
        }
      );

    const raw =
      response?.categories ??
      response?.data?.categories;

    if (
      Array.isArray(raw) &&
      raw.length
    ) {
      return raw.filter((category) =>
        isItemVisibleOnWebsite(
          category,
          websiteId
        )
      );
    }
  } catch (error) {
    console.warn(
      "Admin category tree failed; deriving categories from products:",
      error
    );
  }

  const products =
    await fetchFullCatalog({
      companyId,
      websiteId,
    });

  const categoryMap =
    new Map();

  for (const product of products) {
    const categoryId =
      product.categoryId ||
      makeSlug(
        product.category ||
        "general"
      );

    const categoryName =
      product.category ||
      categoryId;

    if (
      !categoryMap.has(
        categoryId
      )
    ) {
      categoryMap.set(
        categoryId,
        {
          id: categoryId,
          name: categoryName,
          category: categoryName,
          slug: makeSlug(
            categoryName
          ),
          products: [],
          subcategories:
            new Map(),
        }
      );
    }

    const category =
      categoryMap.get(
        categoryId
      );

    category.products.push(
      product
    );

    const subcategoryId =
      product.subcategoryId ||
      makeSlug(
        product.subCategory ||
        "general"
      );

    const subcategoryName =
      product.subCategory ||
      subcategoryId;

    if (
      !category.subcategories.has(
        subcategoryId
      )
    ) {
      category.subcategories.set(
        subcategoryId,
        {
          id: subcategoryId,
          name: subcategoryName,
          subCategory:
            subcategoryName,
          slug: makeSlug(
            subcategoryName
          ),
          products: [],
          productsCount: 0,
        }
      );
    }

    const subcategory =
      category.subcategories.get(
        subcategoryId
      );

    subcategory.products.push(
      product
    );

    subcategory.productsCount += 1;
  }

  return Array.from(
    categoryMap.values()
  ).map((category) => ({
    ...category,
    subcategories:
      Array.from(
        category.subcategories.values()
      ),
    totalProductsCount:
      category.products.length,
  }));
}

export async function fetchCatalogCategories(
  options = {}
) {
  const categories =
    await fetchCategoriesTree(
      options
    );

  return categories.map(
    (category) =>
      category.name ||
      category.category ||
      category.id
  );
}
