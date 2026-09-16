import { NextRequest, NextResponse } from "next/server";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "*",
    },
  });
}

function srtToVtt(srt: string): string {
  const normalized = srt.replace(/\r\n|\r/g, "\n");
  const withVttTime = normalized.replace(
    /(\d{2}:\d{2}:\d{2}),(\d{3})/g,
    (match, p1, p2) => `${p1}.${p2}`
  );
  if (!withVttTime.startsWith("WEBVTT")) {
    return "WEBVTT\n\n" + withVttTime;
  }
  return withVttTime;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");
  const isDownload = searchParams.get("download") === "true";
  const filename = searchParams.get("filename") || "arabic_subtitles.vtt";

  if (!targetUrl) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  try {
    const res = await fetch(targetUrl);
    if (!res.ok) {
      return new NextResponse("Failed to fetch upstream subtitle file", { status: 502 });
    }

    const rawText = await res.text();
    const vttContent = srtToVtt(rawText);

    const headers: Record<string, string> = {
      "Content-Type": "text/vtt; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=86400",
    };

    if (isDownload) {
      headers["Content-Disposition"] = `attachment; filename="${filename}"`;
    }

    return new NextResponse(vttContent, {
      status: 200,
      headers,
    });
  } catch (err: any) {
    console.error("VTT proxy error:", err);
    return new NextResponse("Error processing subtitle file", { status: 500 });
  }
}
