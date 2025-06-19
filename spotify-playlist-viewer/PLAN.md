# Detailed Plan for Spotify Playlist API Route

This document outlines the plan to create a Next.js backend API route that receives a Spotify playlist URL, extracts the playlist ID, authenticates with the Spotify Web API using Client Credentials Flow, and returns a JSON list of all tracks in the playlist (track name, artist(s), and album cover image).

The API route will be created at `spotify-playlist-viewer/src/app/api/playlist/route.js` to align with the project's existing `app` directory structure.

## Phase 1: Planning and Setup (Completed)

1.  **API Route Location**: The API route will be created at `spotify-playlist-viewer/src/app/api/playlist/route.js`.
2.  **Dependencies**: `node-fetch` will be installed for making API calls.
3.  **Environment Variables**: It is assumed that `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` are correctly set in the `.env.local` file in the root of the `spotify-playlist-viewer` project.

## Phase 2: Implementation (To be executed in Code Mode)

1.  **Install Dependencies**:
    *   Install `node-fetch` by running `npm install node-fetch` in the `spotify-playlist-viewer` directory.
2.  **Create API Route File**:
    *   Create the directory `spotify-playlist-viewer/src/app/api/playlist/`.
    *   Create the file `spotify-playlist-viewer/src/app/api/playlist/route.js` inside this new directory.
3.  **Implement API Logic within `route.js`**:
    *   **Import necessary modules**: `node-fetch` and `NextResponse` from `next/server`.
    *   **Define Request Handler**: Export an `async function POST(request)` to handle incoming POST requests.
    *   **Extract Playlist URL**: Get the playlist URL from the `request.json()` body.
    *   **Extract Playlist ID**: Implement a helper function to parse the playlist ID from the URL.
    *   **Spotify Authentication (Client Credentials Flow)**:
        *   Retrieve `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` from `process.env`.
        *   Encode these credentials for the Basic Authorization header.
        *   Make a POST request to `https://accounts.spotify.com/api/token` with `grant_type=client_credentials` to obtain an `access_token`.
        *   Include error handling for authentication failures.
    *   **Fetch Playlist Tracks**:
        *   Make a GET request to `https://api.spotify.com/v1/playlists/{playlist_id}/tracks` using the obtained `access_token` in the `Authorization` header.
        *   Include error handling for Spotify API call failures.
    *   **Process Track Data**:
        *   Iterate through the `items` array from the Spotify API response.
        *   For each track, extract its name, artist name(s), and the album cover image URL.
        *   Format this data into a clean JSON array.
    *   **Return JSON Response**: Return `NextResponse.json({ tracks: formattedTracks })` with the processed data.
    *   **Error Handling**: Implement `try-catch` blocks to gracefully handle errors and return appropriate `NextResponse` error messages (e.g., 400 for bad requests, 500 for internal server errors).

## Phase 3: Testing and Verification (To be executed in Code Mode / User Interaction)

1.  **Local Testing Instructions**: I will provide instructions for you to run the Next.js development server (`npm run dev`) and test the new API route using a tool like Postman, Insomnia, or `curl`.
2.  **Deployment Verification**: After successful local testing, you will commit and push the changes to GitHub, then redeploy to Vercel and verify the API route works on the deployed version.

## Mermaid Diagram for API Flow:

```mermaid
graph TD
    A[Client (Frontend)] -->|POST /api/playlist| B{API Route: src/app/api/playlist/route.js};
    B --> C{Parse Request Body (Playlist URL)};
    C --> D{Extract Playlist ID};
    D --> E{Get Spotify Client ID/Secret from .env};
    E --> F[Request Spotify Access Token];
    F -->|Access Token| G{Fetch Playlist Tracks};
    G --> H{Process Track Data};
    H --> I[Return JSON Response];
    F --x J[Authentication Error];
    G --x K[Spotify API Error];
    D --x L[Invalid URL/ID Error];