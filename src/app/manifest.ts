import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FilmologyX - Watch Free Movies 1080p",
    short_name: "FilmologyX",
    description: "Stream the best movies online in HD for free.",
    start_url: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#e11d48",
    icons: [
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  };
}
