import { MetadataRoute } from "next";

// Aturan untuk crawler Google — halaman mana yang boleh dan tidak boleh diindeks
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/films", "/genres"],
        disallow: ["/admin", "/profile"],
      },
    ],
    sitemap: "https://film-management-71qmggopw-yuus-projects-1d9c129c.vercel.app/sitemap.xml",
  };
}