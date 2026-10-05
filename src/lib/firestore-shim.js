"use client";
/*
 * Compatibility layer for existing components.
 *
 * This file no longer talks to Firebase or
 * Firestore. All reads/writes go through the
 * website's internal Next.js API, which in turn
 * uses the central Admin MongoDB API.
 */

const pathOf = (parts) =>
  parts
    .filter(Boolean)
    .join("/");

export const db = {
  __catalogApi: true,
};

export function serverTimestamp() {
  return new Date().toISOString();
}

export function doc(
  _db,
  ...parts
) {
  return {
    kind: "doc",
    path: pathOf(parts),
  };
}

export function collection(
  _db,
  ...parts
) {
  return {
    kind: "collection",
    path: pathOf(parts),
  };
}

async function request(
  url,
  options = {}
) {
  const response =
    await fetch(url, {
      ...options,
      cache: "no-store",
      headers: {
        Accept:
          "application/json",
        "Cache-Control":
          "no-cache, no-store",
        ...(options.headers || {}),
      },
    });

  const text =
    await response.text();

  let body = null;

  try {
    body = text
      ? JSON.parse(text)
      : null;
  } catch {
    body = text;
  }

  if (!response.ok) {
    throw new Error(
      `Catalog API ${response.status}: ${
        typeof body === "string"
          ? body
          : JSON.stringify(body)
      }`
    );
  }

  if (
    body?.ok === false ||
    body?.success === false
  ) {
    throw new Error(
      body?.error ||
      "Catalog API request failed"
    );
  }

  return body;
}

function snapshot(
  data,
  id = ""
) {
  const exists =
    data !== null &&
    data !== undefined;

  return {
    exists: () => exists,
    id,
    data: () => data || {},
  };
}

function siteDataUrl(
  path
) {
  const parts = String(
    path || ""
  )
    .split("/")
    .filter(Boolean);

  let params = null;

  if (
    parts[0] === "__website__" &&
    parts[1] === "pages" &&
    parts[2]
  ) {
    params = new URLSearchParams({
      type: parts[2],
      pageType: parts[2],
    });
  } else if (
    parts[0] === "__website__" &&
    parts[1] === "districts" &&
    parts[2]
  ) {
    params = new URLSearchParams({
      type: "district",
      pageType: "district",
      district: parts[2],
    });
  } else if (
    parts[0] === "websites" &&
    parts[2] === "pages" &&
    parts[3]
  ) {
    params = new URLSearchParams({
      type: parts[3],
      pageType: parts[3],
    });
  } else if (
    parts[0] === "websites" &&
    parts[2] === "districts" &&
    parts[3]
  ) {
    params = new URLSearchParams({
      type: "district",
      pageType: "district",
      district: parts[3],
    });
  } else {
    return null;
  }

  return `/api/site-data?${params.toString()}`;
}

export async function getDoc(
  reference
) {
  const url =
    siteDataUrl(
      reference?.path
    );

  if (!url) {
    return snapshot(
      null,
      reference?.path
        ?.split("/")
        .pop() || ""
    );
  }

  const data =
    await request(url);

  return snapshot(
    data,
    reference.path
      .split("/")
      .pop()
  );
}

export async function getDocs(
  reference
) {
  const path =
    reference?.path || "";

  const params =
    new URLSearchParams({
      collection: path,
    });

  const data =
    await request(
      `/api/site-data?${params.toString()}`
    );

  const rows =
    Array.isArray(data)
      ? data
      : [];

  const docs = rows.map(
    (row) =>
      snapshot(
        row?.data || row,
        row?.id ||
          row?.doc_id ||
          ""
      )
  );

  return {
    docs,
    forEach(callback) {
      docs.forEach(callback);
    },
    size: docs.length,
    empty:
      docs.length === 0,
  };
}

export async function addDoc(
  reference,
  data
) {
  const path =
    reference?.path || "";

  const endpoint =
    path.includes(
      "productQueries"
    )
      ? "/api/product-query"
      : "/api/contact-query";

  const result =
    await request(
      endpoint,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(
          data || {}
        ),
      }
    );

  return {
    id:
      result?.id ||
      result?.docId ||
      `query-${Date.now()}`,
  };
}

export function onSnapshot(
  reference,
  callback
) {
  let stopped = false;

  const run = async () => {
    if (stopped) return;

    try {
      const snap =
        await getDoc(
          reference
        );

      if (!stopped) {
        callback(snap);
      }
    } catch (error) {
      if (!stopped) {
        console.error(
          "Catalog API realtime sync error:",
          error
        );
      }
    }
  };

  run();

  /*
   * Firebase-style realtime compatibility.
   * The actual source is Admin/MongoDB.
   */
  const timer =
    setInterval(
      run,
      3000
    );

  return () => {
    stopped = true;
    clearInterval(timer);
  };
}
