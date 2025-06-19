import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

export async function POST(request) {
  const { code } = await request.json();

  if (!code) {
    return NextResponse.json({ error: 'Authorization code is missing' }, { status: 400 });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.json({ error: 'Spotify API credentials or redirect URI not set' }, { status: 500 });
  }

  const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
      }).toString(),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error("Spotify token exchange error:", errorData);
      return NextResponse.json({ error: 'Failed to exchange code for tokens', details: errorData }, { status: tokenResponse.status });
    }

    const tokenData = await tokenResponse.json();
    return NextResponse.json(tokenData);

  } catch (error) {
    console.error("API callback route error:", error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}