"use client";

import { useState, useRef, useEffect } from "react";

export default function VideoPlayer({ 
  movieVideoUrl, 
  thumbnailUrl 
}: { 
  movieVideoUrl: string | null; 
  thumbnailUrl: string | null;
}) {
  const [clickCount, setClickCount] = useState(0);
  const REQUIRED_CLICKS = 3; // Number of popups before the video works
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFakeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // CPM AD NETWORK DIRECT LINKS
    // Once you sign up for Adsterra or Monetag, they will give you a "Direct Link".
    // Paste that link right here. Every time it opens, you get paid a fraction of a cent!
    const AD_NETWORK_DIRECT_LINK = "YOUR_DIRECT_LINK_HERE";
    
    // Open a popup in a new tab (this triggers the ad network to pay you for the view)
    const popupUrls = [
      AD_NETWORK_DIRECT_LINK, 
      AD_NETWORK_DIRECT_LINK,
      AD_NETWORK_DIRECT_LINK
    ];
    
    // We only open the popup if they haven't pasted their real link yet
    // (To prevent opening broken 'YOUR_DIRECT_LINK_HERE' tabs locally)
    if (AD_NETWORK_DIRECT_LINK !== "YOUR_DIRECT_LINK_HERE") {
      window.open(popupUrls[clickCount % popupUrls.length], "_blank");
    } else {
      console.log("Ad opened! (Replace YOUR_DIRECT_LINK_HERE to see the real ad)");
      // Fallback for testing so the UI still works
      window.open("about:blank", "_blank");
    }
    setClickCount(prev => prev + 1);
  };

  // Auto-play the real video once the required clicks are met
  useEffect(() => {
    if (clickCount >= REQUIRED_CLICKS && videoRef.current) {
      videoRef.current.play().catch(e => console.log("Autoplay blocked:", e));
    }
  }, [clickCount]);

  if (!movieVideoUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        No video available for this movie yet.
      </div>
    );
  }

  const needsPopups = clickCount < REQUIRED_CLICKS;

  return (
    <div className="relative w-full h-full bg-black group">
      {needsPopups && (
        <div 
          className="absolute inset-0 z-50 flex flex-col items-center justify-center cursor-pointer bg-black/80 hover:bg-black/70 transition-all"
          onClick={handleFakeClick}
        >
          {/* Fake Play Button to entice the click */}
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.6)] group-hover:scale-110 transition-transform mb-6">
            <svg className="w-10 h-10 text-white ml-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          
          {/* Shady Ad Message Box */}
          <div className="bg-gray-900/90 border border-gray-700 px-6 py-4 rounded-lg text-center max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">Sponsor Verification Required</h3>
            <p className="text-gray-300 mb-4 text-sm leading-relaxed">
              To keep our service free, you must open and view our sponsors' pages. Click play to continue.
            </p>
            <div className="w-full bg-gray-800 rounded-full h-3 mb-2 overflow-hidden border border-gray-700">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                style={{ width: `${(clickCount / REQUIRED_CLICKS) * 100}%` }}
              ></div>
            </div>
            <p className="text-yellow-500 font-bold text-sm">
              Ads completed: {clickCount} / {REQUIRED_CLICKS}
            </p>
          </div>
        </div>
      )}

      {/* Actual Movie Player */}
      <video 
        ref={videoRef}
        key="movie-player"
        controls={!needsPopups} // Hide real controls until popups are done
        className="w-full h-full" 
        poster={thumbnailUrl || undefined}
        src={movieVideoUrl}
      />
    </div>
  );
}

