'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Home() {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [playlists, setPlaylists] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const storedAccessToken = localStorage.getItem('spotify_access_token');
    const storedRefreshToken = localStorage.getItem('spotify_refresh_token');

    if (storedAccessToken && storedRefreshToken) {
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      fetchPlaylists(storedAccessToken);
    } else {
      const code = searchParams.get('code');
      if (code) {
        exchangeCodeForTokens(code);
      }
    }
  }, [searchParams]);

  const exchangeCodeForTokens = async (code) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to exchange code for tokens');
        setIsLoading(false);
        return;
      }

      localStorage.setItem('spotify_access_token', data.access_token);
      localStorage.setItem('spotify_refresh_token', data.refresh_token);
      setAccessToken(data.access_token);
      setRefreshToken(data.refresh_token);
      fetchPlaylists(data.access_token);
    } catch (err) {
      console.error('Token exchange error:', err);
      setError('Failed to connect to the server for token exchange.');
    } finally {
      setIsLoading(false);
      // Clear code from URL
      router.replace('/', undefined, { shallow: true });
    }
  };

  const fetchPlaylists = async (token) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/playlists', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to fetch playlists');
        return;
      }

      setPlaylists(data.playlists);
    } catch (err) {
      console.error('Fetch playlists error:', err);
      setError('Failed to connect to the server for playlists.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;
    const scope = 'playlist-read-private playlist-read-collaborative';

    if (!clientId || !redirectUri) {
      setError('Spotify client ID or redirect URI not configured.');
      return;
    }

    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}`;
    window.location.href = authUrl;
  };

  const handleLogout = () => {
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
    setAccessToken(null);
    setRefreshToken(null);
    setPlaylists(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center">
      {/* Header */}
      <header className="w-full flex justify-between items-center p-8">
        <button className="text-white text-lg font-bold">HELP</button>
        <button className="bg-gray-700 text-white px-6 py-2 rounded-full text-lg font-bold">ACCOUNT</button>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center flex-grow text-center px-4">
        <h1 className="text-6xl md:text-8xl font-extrabold mb-4 tracking-wide">
          DIGITAL TO VINYL
        </h1>
        <p className="text-xl md:text-2xl mb-12 tracking-wide">
          TRANSFORM YOUR DIGITAL PLAYLISTS INTO VINYL TREASURES
        </p>

        <div className="w-full max-w-2xl bg-gray-900 p-8 rounded-lg shadow-lg border border-gray-700">
          {!accessToken ? (
            <button
              onClick={handleLogin}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-md text-lg font-bold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 mb-6"
            >
              Login with Spotify
            </button>
          ) : (
            <>
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 text-white px-6 py-3 rounded-md text-lg font-bold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 mb-6"
              >
                Logout from Spotify
              </button>

              {isLoading && <p className="text-gray-400">Loading playlists...</p>}
              {error && <p className="text-red-500 mb-4">{error}</p>}

              {playlists && playlists.length > 0 && (
                <div className="mt-8 text-left">
                  <h2 className="text-2xl font-bold mb-4">Your Playlists:</h2>
                  <ul className="space-y-2">
                    {playlists.map((playlist) => (
                      <li key={playlist.id} className="flex items-center space-x-4">
                        {playlist.images && playlist.images.length > 0 && (
                          <img src={playlist.images[0].url} alt="Playlist Cover" className="w-12 h-12 rounded-md" />
                        )}
                        <div>
                          <p className="font-semibold">{playlist.name}</p>
                          <p className="text-gray-400 text-sm">{playlist.tracks.total} tracks</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {/* Original Drag & Drop Area - kept for now, can be removed later if not needed */}
          <div className="border-2 border-dashed border-gray-600 rounded-md p-12 text-center flex flex-col items-center justify-center mt-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-12 h-12 text-gray-400 mb-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16.5V9.75m0 0l3.75 3.75M12 9.75L8.25 13.5m-1.5 1.5h-.75A2.25 2.25 0 014.5 14.25v-2.25m13.5 0v2.25c0 1.241-.948 2.25-2.25 2.25h-.75M6 18.75h12a2.25 2.25 0 002.25-2.25v-10.5a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v10.5c0 1.241.948 2.25 2.25 2.25z"
              />
            </svg>
            <p className="text-gray-400 mb-2">
              Drag files here or <span className="text-green-500 cursor-pointer">browse</span>
            </p>
            <p className="text-gray-500 text-sm">CSV, TXT</p>
          </div>
        </div>
      </main>
    </div>
  );
}
