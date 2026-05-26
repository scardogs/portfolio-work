import dbConnect from "../../../lib/mongodb";
import BlogPost from "../../../models/BlogPost";
import { authenticate } from "../../../middleware/auth";

function slugify(str) {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  switch (req.method) {
    case "GET":
      return listPosts(req, res);
    case "POST":
      return createPost(req, res);
    case "PUT":
      return updatePost(req, res, id);
    case "DELETE":
      return deletePost(req, res, id);
    default:
      return res.status(405).json({ success: false, message: "Method not allowed" });
  }
}

async function listPosts(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const isAdmin = req.query.admin === "1";
    const filter = isAdmin ? {} : { status: "published" };

    const [items, total] = await Promise.all([
      BlogPost.find(filter)
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      BlogPost.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);
    return res.status(200).json({
      success: true,
      data: items,
      pagination: { page, limit, total, totalPages, hasMore: page < totalPages },
    });
  } catch (error) {
    console.error("List blog posts error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

async function createPost(req, res) {
  try {
    const data = { ...req.body };
    if (!data.slug && data.title) data.slug = slugify(data.title);
    if (data.slug) data.slug = slugify(data.slug);

    const post = await BlogPost.create(data);
    return res.status(201).json({ success: true, data: post });
  } catch (error) {
    console.error("Create blog post error:", error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Slug already exists" });
    }
    return res.status(500).json({ success: false, message: error.message || "Server error" });
  }
}

async function updatePost(req, res, id) {
  try {
    if (!id) return res.status(400).json({ success: false, message: "ID is required" });
    const data = { ...req.body };
    if (data.slug) data.slug = slugify(data.slug);

    const post = await BlogPost.findById(id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    Object.assign(post, data);
    await post.save();
    return res.status(200).json({ success: true, data: post });
  } catch (error) {
    console.error("Update blog post error:", error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Slug already exists" });
    }
    return res.status(500).json({ success: false, message: error.message || "Server error" });
  }
}

async function deletePost(req, res, id) {
  try {
    if (!id) return res.status(400).json({ success: false, message: "ID is required" });
    const post = await BlogPost.findByIdAndDelete(id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    return res.status(200).json({ success: true, message: "Post deleted" });
  } catch (error) {
    console.error("Delete blog post error:", error);
    return res.status(500).json({ success: false, message: error.message || "Server error" });
  }
}

export default async function (req, res) {
  const method = req.method?.toUpperCase();
  if (method === "GET") {
    return handler(req, res);
  }
  return authenticate(handler)(req, res);
}
