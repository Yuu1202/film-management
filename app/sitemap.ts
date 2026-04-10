import { MetadataRoute } from "next";

// Daftar semua halaman statis untuk diindeks Google
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://film-management-71qmggopw-yuus-projects-1d9c129c.vercel.app/";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/films`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/genres`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "never",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: "never",
      priority: 0.5,
    },
  ];
}