import dbConnect from "../lib/mongodb";
import BlogPost from "../models/BlogPost";

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://jjscrl.xyz";

function urlEntry({ loc, lastmod, changefreq, priority }) {
  return `  <url>
    <loc>${loc}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}
    ${changefreq ? `<changefreq>${changefreq}</changefreq>` : ""}
    ${priority ? `<priority>${priority}</priority>` : ""}
  </url>`;
}

function generateSiteMap(posts) {
  const today = new Date().toISOString().split("T")[0];

  const staticUrls = [
    urlEntry({ loc: SITE_URL, lastmod: today, changefreq: "weekly", priority: "1.0" }),
    urlEntry({ loc: `${SITE_URL}/blog`, lastmod: today, changefreq: "weekly", priority: "0.8" }),
  ];

  const postUrls = posts.map((p) => {
    const lastmod = (p.updatedAt || p.publishedAt || p.createdAt || new Date())
      .toString()
      .split("T")[0];
    return urlEntry({
      loc: `${SITE_URL}/blog/${p.slug}`,
      lastmod,
      changefreq: "monthly",
      priority: "0.7",
    });
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...postUrls].join("\n")}
</urlset>`;
}

export async function getServerSideProps({ res }) {
  let posts = [];
  try {
    await dbConnect();
    posts = await BlogPost.find({ status: "published" })
      .select("slug publishedAt updatedAt createdAt")
      .sort({ publishedAt: -1 })
      .lean();
    posts = posts.map((p) => ({
      slug: p.slug,
      publishedAt: p.publishedAt ? new Date(p.publishedAt).toISOString() : null,
      updatedAt: p.updatedAt ? new Date(p.updatedAt).toISOString() : null,
      createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : null,
    }));
  } catch (e) {
    console.error("Sitemap blog fetch failed:", e);
  }

  const sitemap = generateSiteMap(posts);

  res.setHeader("Content-Type", "text/xml");
  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate");
  res.write(sitemap);
  res.end();

  return { props: {} };
}

export default function Sitemap() {
  return null;
}
