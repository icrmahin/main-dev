import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Abdulla Al Mahin — Product Engineer",
    short_name: "Mahin",
    description:
      "Product Engineer — I design, engineer, and ship digital products.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f7fb",
    theme_color: "#111118",
    icons: [
      {
        src: "/avater.jpeg",
        sizes: "512x512",
        type: "image/jpeg",
        purpose: "any",
      },
    ],
  };
}
