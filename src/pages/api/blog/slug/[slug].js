import dbConnect from "../../../../lib/mongodb";
import BlogPost from "../../../../models/BlogPost";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }
  await dbConnect();
  try {
    const { slug } = req.query;
    const post = await BlogPost.findOne({ slug, status: "published" }).lean();
    if (!post) return res.status(404).json({ success: false, message: "Not found" });
    return res.status(200).json({ success: true, data: post });
  } catch (error) {
    console.error("Get blog post by slug error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
