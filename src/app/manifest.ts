import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FilmologyX - Free Movie & TV Streaming",
    short_name: "FilmologyX",
    description: "Stream thousands of movies and TV series online in 1080p for free.",
    start_url: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#e11d48",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
