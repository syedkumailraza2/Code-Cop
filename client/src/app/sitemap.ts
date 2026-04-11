import type { MetadataRoute } from "next";

const BASE_URL = "https://codecop.kumailrazas.in/";
const lastModified = new Date("2026-04-11");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/analyze`,
      lastModified: lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];
}
