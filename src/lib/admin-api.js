import "server-only";

import {
  WEBSITE_ID,
  COMPANY_ID,
} from "./catalog-utils";

export const ADMIN_API_BASE_URL = (
  process.env.ADMIN_API_BASE_URL ||
  process.env.ADMIN_API_URL ||
  "https://admin.rajbiosis.app"
).replace(/\/+$/, "");

function buildUrl(pathname, params = {}) {
  const path = String(pathname || "");
  const url = new URL(
    `${ADMIN_API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`
  );

  const query = {
    websiteId: WEBSITE_ID,
    companyId: COMPANY_ID,
    ...params,
  };

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  return url;
}

export async function adminFetch(pathname, options = {}, params = {}) {
  const url = buildUrl(pathname, params);

  const response = await fetch(url.toString(), {
    ...options,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...(options.headers || {}),
    },
  });

  const text = await response.text();

  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  if (
    !response.ok ||
    body?.success === false ||
    body?.ok === false
  ) {
    const message =
      typeof body === "string"
        ? body
        : JSON.stringify(body);

    throw new Error(
      `Admin API ${response.status}: ${message}`
    );
  }

  return body;
}

export async function postAdminQuery(
  endpoint,
  payload = {}
) {
  return adminFetch(
    endpoint,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
        websiteId: WEBSITE_ID,
        companyId: COMPANY_ID,
      }),
    }
  );
}

export async function fetchCatalogFromAdmin() {
  const response = await adminFetch("/api/catalog");

  const products =
    response?.products ??
    response?.data?.products ??
    response?.data ??
    response;

  return Array.isArray(products)
    ? products
    : [];
}
