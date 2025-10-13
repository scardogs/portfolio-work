import dbConnect from "../../../lib/mongodb";
import Skill from "../../../models/Skill";
import { authenticate } from "../../../middleware/auth";

async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case "GET":
      return getSkills(req, res);
    case "POST":
      return createSkill(req, res);
    default:
      return res
        .status(405)
        .json({ success: false, message: "Method not allowed" });
  }
}

// GET - Public
async function getSkills(req, res) {
  try {
    const skills = await Skill.find().sort({ order: 1, createdAt: -1 });
    return res.status(200).json({ success: true, data: skills });
  } catch (error) {
    console.error("Get skills error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// POST - Protected
async function createSkill(req, res) {
  try {
    const skill = await Skill.create(req.body);
    return res.status(201).json({ success: true, data: skill });
  } catch (error) {
    console.error("Create skill error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export default function (req, res) {
  if (req.method === "GET") {
    return handler(req, res);
  }
  return authenticate(handler)(req, res);
}
