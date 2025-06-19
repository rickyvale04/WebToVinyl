import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

export async function GET(request) {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Authorization header missing or invalid' }, { status: 401 });
  }

  const accessToken = authHeader.split(' ')[1];

  try {
    const playlistsResponse = await fetch('https://api.spotify.com/v1/me/playlists', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!playlistsResponse.ok) {
      const errorData = await playlistsResponse.json();
      console.error("Spotify playlists error:", errorData);
      return NextResponse.json({ error: 'Failed to fetch user playlists', details: errorData }, { status: playlistsResponse.status });
    }

    const playlistsData = await playlistsResponse.json();
    return NextResponse.json({ playlists: playlistsData.items });

  } catch (error) {
    console.error("API playlists route error:", error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}