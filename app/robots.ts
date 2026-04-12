import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/films", "/genres"],
        disallow: ["/admin", "/profile"],
      },
    ],
    sitemap: "https://film-management.vercel.app/sitemap.xml",
  };
}