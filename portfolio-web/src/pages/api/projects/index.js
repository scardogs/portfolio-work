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
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    return res.status(200).json({ success: true, data: projects });
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

export default function (req, res) {
  if (req.method === "GET") {
    return handler(req, res);
  }
  return authenticate(handler)(req, res);
}
