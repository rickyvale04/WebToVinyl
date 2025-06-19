import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

// Helper function to extract playlist ID from URL
function getPlaylistIdFromUrl(url) {
  try {
    const urlObj = new URL(url);
    const pathSegments = urlObj.pathname.split('/');
    const playlistIndex = pathSegments.indexOf('playlist');
    if (playlistIndex > -1 && playlistIndex + 1 < pathSegments.length) {
      return pathSegments[playlistIndex + 1];
    }
    return null;
  } catch (error) {
    console.error("Error parsing URL:", error);
    return null;
  }
}

export async function POST(request) {
  try {
    const { playlistUrl } = await request.json();

    if (!playlistUrl) {
      return NextResponse.json({ error: 'Playlist URL is required' }, { status: 400 });
    }

    const playlistId = getPlaylistIdFromUrl(playlistUrl);
    if (!playlistId) {
      return NextResponse.json({ error: 'Invalid Spotify playlist URL' }, { status: 400 });
    }

    // Spotify Client Credentials Flow
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: 'Spotify API credentials not set' }, { status: 500 });
    }

    const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error("Spotify token error:", errorData);
      return NextResponse.json({ error: 'Failed to authenticate with Spotify', details: errorData }, { status: tokenResponse.status });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Fetch playlist tracks
    const tracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!tracksResponse.ok) {
      const errorData = await tracksResponse.json();
      console.error("Spotify tracks error:", errorData);
      return NextResponse.json({ error: 'Failed to fetch playlist tracks', details: errorData }, { status: tracksResponse.status });
    }

    const tracksData = await tracksResponse.json();

    const formattedTracks = tracksData.items.map(item => ({
      name: item.track.name,
      artists: item.track.artists.map(artist => artist.name).join(', '),
      albumCover: item.track.album.images.length > 0 ? item.track.album.images[0].url : null,
    }));

    return NextResponse.json({ tracks: formattedTracks });

  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}