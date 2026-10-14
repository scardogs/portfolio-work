import dbConnect from "../../../lib/mongodb";
import Project from "../../../models/Project";
import { authenticate } from "../../../middleware/auth";

async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case "GET":
      return getProjects(req, res);
    case "POST":
      return createProject(req, res);
    default:
      return res
        .status(405)
        .json({ success: false, message: "Method not allowed" });
  }
}

// GET - Public
async function getProjects(req, res) {
  try {
    const pageParam = req.query?.page ? parseInt(req.query.page, 10) : null;
    const limitParam = req.query?.limit ? parseInt(req.query.limit, 10) : null;

    if (pageParam && limitParam && pageParam > 0 && limitParam > 0) {
      const total = await Project.countDocuments();
      const totalPages = Math.max(1, Math.ceil(total / limitParam));
      const projects = await Project.find()
        .sort({ order: 1, createdAt: -1 })
        .skip((pageParam - 1) * limitParam)
        .limit(limitParam);

      return res.status(200).json({
        success: true,
        data: projects,
        pagination: {
          page: pageParam,
          limit: limitParam,
          total,
          totalPages,
          hasMore: pageParam < totalPages,
        },
      });
    }

    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: projects,
      pagination: {
        page: 1,
        limit: projects.length,
        total: projects.length,
        totalPages: 1,
        hasMore: false,
      },
    });
  } catch (error) {
    console.error("Get projects error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// POST - Protected
async function createProject(req, res) {
  try {
    const project = await Project.create(req.body);
    return res.status(201).json({ success: true, data: project });
  } catch (error) {
    console.error("Create project error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export default async function (req, res) {
  const method = req.method?.toUpperCase();
  if (method === "GET") {
    return handler(req, res);
  }
  return authenticate(handler)(req, res);
}
