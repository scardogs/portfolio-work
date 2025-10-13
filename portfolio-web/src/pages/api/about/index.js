import dbConnect from "../../../lib/mongodb";
import About from "../../../models/About";
import { authenticate } from "../../../middleware/auth";

async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case "GET":
      return getAbout(req, res);
    case "POST":
      return createAbout(req, res);
    case "PUT":
      return updateAbout(req, res);
    default:
      return res
        .status(405)
        .json({ success: false, message: "Method not allowed" });
  }
}

// GET - Public
async function getAbout(req, res) {
  try {
    let about = await About.findOne();

    // If no about data exists, create default
    if (!about) {
      about = await About.create({
        name: "John Michael T. Escarlan",
        profileImage: "/profile.png",
        description:
          "Passionate about building reliable, efficient, and user-friendly systems. Skilled in solving technical challenges, improving processes, and delivering high-quality solutions. Eager to learn new technologies and contribute to impactful projects.",
        languages: [
          "English (Intermediate)",
          "Tagalog (Fluent)",
          "Hiligaynon (Fluent)",
        ],
        education: "Bachelor of Science in Information Technology",
      });
    }

    return res.status(200).json({ success: true, data: about });
  } catch (error) {
    console.error("Get about error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// POST - Protected
async function createAbout(req, res) {
  try {
    const about = await About.create(req.body);
    return res.status(201).json({ success: true, data: about });
  } catch (error) {
    console.error("Create about error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// PUT - Protected
async function updateAbout(req, res) {
  try {
    const about = await About.findOneAndUpdate({}, req.body, {
      new: true,
      runValidators: true,
      upsert: true,
    });

    return res.status(200).json({ success: true, data: about });
  } catch (error) {
    console.error("Update about error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export default function (req, res) {
  // Only protect POST and PUT methods
  if (req.method === "GET") {
    return handler(req, res);
  }
  return authenticate(handler)(req, res);
}
