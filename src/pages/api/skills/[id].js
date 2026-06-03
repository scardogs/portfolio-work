import dbConnect from "../../../lib/mongodb";
import Skill from "../../../models/Skill";
import { authenticate } from "../../../middleware/auth";

async function handler(req, res) {
  await dbConnect();

  const { id } = req.query;

  switch (req.method) {
    case "GET":
      return getSkill(req, res, id);
    case "PUT":
      return updateSkill(req, res, id);
    case "DELETE":
      return deleteSkill(req, res, id);
    default:
      return res
        .status(405)
        .json({ success: false, message: "Method not allowed" });
  }
}

// GET - Public
async function getSkill(req, res, id) {
  try {
    const skill = await Skill.findById(id);

    if (!skill) {
      return res
        .status(404)
        .json({ success: false, message: "Skill not found" });
    }

    return res.status(200).json({ success: true, data: skill });
  } catch (error) {
    console.error("Get skill error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// PUT - Protected
async function updateSkill(req, res, id) {
  try {
    const skill = await Skill.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!skill) {
      return res
        .status(404)
        .json({ success: false, message: "Skill not found" });
    }

    return res.status(200).json({ success: true, data: skill });
  } catch (error) {
    console.error("Update skill error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// DELETE - Protected
async function deleteSkill(req, res, id) {
  try {
    const skill = await Skill.findByIdAndDelete(id);

    if (!skill) {
      return res
        .status(404)
        .json({ success: false, message: "Skill not found" });
    }

    return res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error("Delete skill error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export default function (req, res) {
  if (req.method === "GET") {
    return handler(req, res);
  }
  return authenticate(handler)(req, res);
}
