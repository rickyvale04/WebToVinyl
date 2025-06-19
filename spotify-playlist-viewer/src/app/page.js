export default function Home() {
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

        {/* Input and Drag & Drop Area */}
        <div className="w-full max-w-2xl bg-gray-900 p-8 rounded-lg shadow-lg border border-gray-700">
          <input
            type="text"
            placeholder="Paste your Spotify/SoundCloud URL here"
            className="w-full p-4 mb-6 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <div className="border-2 border-dashed border-gray-600 rounded-md p-12 text-center flex flex-col items-center justify-center">
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
