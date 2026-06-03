import dbConnect from "../../../lib/mongodb";
import Project from "../../../models/Project";
import { authenticate } from "../../../middleware/auth";

async function handler(req, res) {
  await dbConnect();

  const { id } = req.query;

  switch (req.method) {
    case "GET":
      return getProject(req, res, id);
    case "PUT":
      return updateProject(req, res, id);
    case "DELETE":
      return deleteProject(req, res, id);
    default:
      return res
        .status(405)
        .json({ success: false, message: "Method not allowed" });
  }
}

// GET - Public
async function getProject(req, res, id) {
  try {
    const project = await Project.findById(id);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    return res.status(200).json({ success: true, data: project });
  } catch (error) {
    console.error("Get project error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// PUT - Protected
async function updateProject(req, res, id) {
  try {
    const project = await Project.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    return res.status(200).json({ success: true, data: project });
  } catch (error) {
    console.error("Update project error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// DELETE - Protected
async function deleteProject(req, res, id) {
  try {
    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    return res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error("Delete project error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export default function (req, res) {
  if (req.method === "GET") {
    return handler(req, res);
  }
  return authenticate(handler)(req, res);
}
