import { NextResponse } from "next/server";
import { CURATED_CATALOG } from "@/lib/catalog";

const INDEXNOW_KEY = "9f4a8b72c1e64901ba538d3ef7182904";
const HOST = "streaming-web-ochre.vercel.app";

export async function GET() {
  return handleSubmit();
}

export async function POST() {
  return handleSubmit();
}

async function handleSubmit() {
  const baseUrl = `https://${HOST}`;
  
  // Build list of top URLs to notify search engines about
  const urlList = [
    `${baseUrl}/`,
    `${baseUrl}/movies`,
    `${baseUrl}/series`,
    `${baseUrl}/search`,
    ...CURATED_CATALOG.slice(0, 50).map((c) => `${baseUrl}/movie/${c.id}`),
  ];

  try {
    const payload = {
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: `${baseUrl}/${INDEXNOW_KEY}.txt`,
      urlList,
    };

    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    return NextResponse.json({
      success: response.ok || response.status === 200 || response.status === 202,
      status: response.status,
      submittedUrls: urlList.length,
      engine: "IndexNow (Bing, Yahoo, DuckDuckGo, Yandex)",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "IndexNow submission failed" },
      { status: 500 }
    );
  }
}
