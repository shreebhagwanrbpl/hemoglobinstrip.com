import { NextResponse } from "next/server";
import { postAdminQuery } from "@/lib/admin-api";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function POST(request) {
  try {
    const body =
      await request.json();

    const result =
      await postAdminQuery(
        "/api/contact-query",
        body
      );

    return NextResponse.json(
      result || { ok: true },
      {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error(
      "[contact-query] Admin API error:",
      error
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          error?.message ||
          "Failed to submit contact query",
      },
      {
        status: 500,
        headers: {
          "Cache-Control":
            "no-store",
        },
      }
    );
  }
}
