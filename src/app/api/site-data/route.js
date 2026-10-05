import { NextResponse } from "next/server";
import {
  adminFetch,
} from "@/lib/admin-api";
import {
  WEBSITE_ID,
  COMPANY_ID,
  normalizeWebsiteId,
  isVisibleForWebsite,
} from "@/lib/catalog-utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const headers = {
  "Cache-Control":
    "no-store, no-cache, must-revalidate, max-age=0",
  Pragma: "no-cache",
  Expires: "0",
};

function response(data, status = 200) {
  return NextResponse.json(data, {
    status,
    headers,
  });
}

function unwrap(responseBody) {
  return (
    responseBody?.data ??
    responseBody?.page ??
    responseBody?.result ??
    responseBody
  );
}

function unwrapDistricts(responseBody) {
  const value =
    responseBody?.data?.districts ??
    responseBody?.districts ??
    responseBody?.data ??
    responseBody;

  if (!Array.isArray(value)) return [];

  return value.map((item, index) => ({
    ...(item || {}),
    id:
      item?.id ||
      item?.slug ||
      `dist-${index}`,
    slug:
      item?.slug ||
      item?.id ||
      item?.district ||
      item?.name ||
      `dist-${index}`,
  }));
}

export async function GET(request) {
  try {
    const { searchParams } =
      new URL(request.url);

    const websiteId =
      searchParams.get("websiteId") ||
      WEBSITE_ID;

    const companyId =
      searchParams.get("companyId") ||
      COMPANY_ID;

    const pageTypeParam =
      searchParams.get("pageType") ||
      searchParams.get("type");

    const districtParam =
      searchParams.get("district");

    const districtsParam =
      searchParams.get("districts");

    const collection =
      searchParams.get("collection");

    let path =
      searchParams.get("path") || "";

    /*
     * 1. District list.
     */
    if (
      districtsParam === "1" ||
      pageTypeParam === "districts" ||
      pageTypeParam === "districtList"
    ) {
      const result = await adminFetch(
        "/api/site-data",
        {},
        {
          type: "districts",
          pageType: "districts",
          websiteId,
          companyId,
        }
      );

      return response(
        unwrapDistricts(result)
      );
    }

    /*
     * 2. Single District.
     */
    if (districtParam || pageTypeParam === "district") {
      const targetDistrict =
        districtParam ||
        searchParams.get("slug") ||
        searchParams.get("name");

      if (targetDistrict) {
        const result = await adminFetch(
          "/api/site-data",
          {},
          {
            type: "district",
            pageType: "district",
            district: targetDistrict,
            websiteId,
            companyId,
          }
        );

        return response(
          unwrap(result)
        );
      }
    }

    /*
     * 3. Collection compatibility.
     *
     * This is kept for the old client-side
     * Firestore shim so existing components
     * do not break.
     */
    if (collection) {
      const result = await adminFetch(
        "/api/site-data",
        {},
        {
          collection,
          websiteId,
          companyId,
        }
      );

      const value = unwrap(result);

      if (Array.isArray(value)) {
        return response(
          value.filter((item) =>
            isVisibleForWebsite(
              item?.data || item,
              websiteId
            )
          )
        );
      }

      return response(value);
    }

    /*
     * 4. Direct pageType / type query (home, contact, services, about, etc.)
     */
    if (
      pageTypeParam &&
      pageTypeParam !== "district" &&
      pageTypeParam !== "districts"
    ) {
      const result = await adminFetch(
        "/api/site-data",
        {},
        {
          type: pageTypeParam,
          pageType: pageTypeParam,
          websiteId,
          companyId,
        }
      );

      return response(
        unwrap(result)
      );
    }

    /*
     * 5. Preferred website-page path route.
     *
     * __website__/pages/home
     * __website__/pages/contact
     * __website__/pages/services
     */
    if (path) {
      if (path.startsWith("__website__/")) {
        path = path.replace(
          "__website__/",
          ""
        );
      }

      const pathParts = path
        .split("/")
        .filter(Boolean);

      if (
        pathParts[0] === "pages" &&
        pathParts[1]
      ) {
        const pageType = pathParts[1];

        const result = await adminFetch(
          "/api/site-data",
          {},
          {
            type: pageType,
            pageType,
            websiteId,
            companyId,
          }
        );

        return response(
          unwrap(result)
        );
      }

      /*
       * District page.
       *
       * __website__/districts/jaipur
       */
      if (
        pathParts[0] === "districts" &&
        pathParts[1]
      ) {
        const district =
          pathParts[1];

        const result = await adminFetch(
          "/api/site-data",
          {},
          {
            type: "district",
            pageType: "district",
            district,
            websiteId,
            companyId,
          }
        );

        return response(
          unwrap(result)
        );
      }

      /*
       * Backward compatibility for callers
       * passing a website page path directly.
       */
      if (
        pathParts.length >= 4 &&
        pathParts[0] === "websites"
      ) {
        const normalized =
          normalizeWebsiteId(
            pathParts[1]
          );

        const wanted =
          normalizeWebsiteId(
            websiteId
          );

        if (normalized === wanted) {
          if (
            pathParts[2] === "pages" &&
            pathParts[3]
          ) {
            const pageType =
              pathParts[3];

            const result =
              await adminFetch(
                "/api/site-data",
                {},
                {
                  type: pageType,
                  pageType,
                  websiteId,
                  companyId,
                }
              );

            return response(
              unwrap(result)
            );
          }

          if (
            pathParts[2] === "districts" &&
            pathParts[3]
          ) {
            const district =
              pathParts[3];

            const result =
              await adminFetch(
                "/api/site-data",
                {},
                {
                  type: "district",
                  pageType: "district",
                  district,
                  websiteId,
                  companyId,
                }
              );

            return response(
              unwrap(result)
            );
          }
        }
      }
    }

    return response(null);
  } catch (error) {
    console.error(
      "[site-data] Admin API error:",
      error
    );

    return response(null, 200);
  }
}
