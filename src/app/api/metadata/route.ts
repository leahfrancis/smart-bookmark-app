import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const response = await fetch(
      `https://api.microlink.io?url=${encodeURIComponent(url)}`,
    );

    const data = await response.json();

    return NextResponse.json({
      title: data.data?.title || "",
      description: data.data?.description || "",
      image: data.data?.image?.url || "",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch metadata" },
      { status: 500 },
    );
  }
}
