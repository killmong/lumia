import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const input = searchParams.get("channelId"); // This can now be @handle or UC... id
  const API_KEY = process.env.YOUTUBE_API_KEY;

  if (!input || !API_KEY) {
    return NextResponse.json(
      { error: "Missing input or API Key" },
      { status: 400 },
    );
  }

  try {
    let finalChannelId = input;

    // 1. Check if input is a handle (@name)
    if (input.startsWith("@")) {
      const handleUrl = `https://www.googleapis.com/youtube/v3/channels?key=${API_KEY}&forHandle=${input}&part=id`;
      const handleRes = await fetch(handleUrl);
      const handleData = await handleRes.json();

      if (handleData.items && handleData.items.length > 0) {
        finalChannelId = handleData.items[0].id;
      } else {
        return NextResponse.json(
          { error: "Channel handle not found" },
          { status: 404 },
        );
      }
    }

    // 2. Fetch the actual videos using the resolved ID
    const videoUrl = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${finalChannelId}&part=snippet,id&order=date&maxResults=4&type=video`;

    const videoRes = await fetch(videoUrl);
    const videoData = await videoRes.json();

    if (videoData.error) {
      return NextResponse.json(
        { error: videoData.error.message },
        { status: 400 },
      );
    }

    const videos = videoData.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high.url,
      publishedAt: item.snippet.publishedAt,
    }));

    return NextResponse.json(videos);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch YouTube data" },
      { status: 500 },
    );
  }
}
