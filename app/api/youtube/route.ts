// app/api/youtube/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { channelUrl } = await req.json();
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing YouTube API Key" },
        { status: 500 },
      );
    }

    // 1. Extract Handle from URL (e.g., https://youtube.com/@handle -> handle)
    const handleMatch = channelUrl.match(/@([\w-]+)/);
    if (!handleMatch) {
      return NextResponse.json(
        { error: "Invalid Channel URL. Please include the @handle" },
        { status: 400 },
      );
    }
    const handle = handleMatch[1];

    // 2. Get Channel ID and Uploads Playlist ID using the Handle
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forHandle=${handle}&key=${apiKey}`,
    );
    const channelData = await channelRes.json();

    if (!channelData.items || channelData.items.length === 0) {
      return NextResponse.json({ error: "Channel not found" }, { status: 404 });
    }
    const uploadsPlaylistId =
      channelData.items[0].contentDetails.relatedPlaylists.uploads;

    // 3. Fetch recent videos from the Uploads Playlist (Fetching up to 50 for a good sample size)
    const playlistRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${uploadsPlaylistId}&key=${apiKey}`,
    );
    const playlistData = await playlistRes.json();

    // Extract video IDs
    const videoIds = playlistData.items
      .map((item: any) => item.snippet.resourceId.videoId)
      .join(",");

    // 4. Fetch the real Statistics (Views) for those specific videos
    const videosRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds}&key=${apiKey}`,
    );
    const videosData = await videosRes.json();

    // 5. Format, Sort by Views, and take the Top 6
    const formattedVideos = videosData.items.map((v: any) => ({
      youtubeId: v.id,
      url: `https://www.youtube.com/watch?v=${v.id}`,
      title: v.snippet.title,
      category: "YouTube Sync", // Defaulting to generic tag
      views: parseInt(v.statistics.viewCount, 10) || 0,
    }));

    const topVideos = formattedVideos
      .sort((a: any, b: any) => b.views - a.views)
      .slice(0, 6); // Change 6 to whatever amount you want to sync

    return NextResponse.json(topVideos);
  } catch (error) {
    console.error("YouTube API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
