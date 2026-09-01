import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://example.com",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    // Add more landing routes here if you add them in the future.
    // Do NOT add /app/* routes — they're noindex.
  ];
}
