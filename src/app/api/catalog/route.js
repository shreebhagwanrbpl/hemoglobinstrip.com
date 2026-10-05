import { NextResponse } from "next/server";
import {
  fetchFullCatalog,
} from "@/lib/data-fetcher-server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const headers = {
  "Cache-Control":
    "no-store, no-cache, must-revalidate, max-age=0",
  Pragma: "no-cache",
  Expires: "0",
};

export async function GET() {
  try {
    const products =
      await fetchFullCatalog();

    return NextResponse.json(
      Array.isArray(products)
        ? products
        : [],
      { headers }
    );
  } catch (error) {
    console.error(
      "[catalog] Admin API error:",
      error
    );

    return NextResponse.json(
      [],
      {
        status: 200,
        headers,
      }
    );
  }
}
