import dbConnect from "../../../lib/mongodb";
import Settings from "../../../models/Settings";
import { authenticate } from "../../../middleware/auth";

async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case "GET":
      return getSettings(req, res);
    case "PUT":
      return updateSettings(req, res);
    default:
      return res.status(405).json({ success: false, message: "Method not allowed" });
  }
}

// GET - Public
async function getSettings(req, res) {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({ splashCursorEnabled: true });
    }
    return res.status(200).json({ success: true, data: settings });
  } catch (error) {
    console.error("Get settings error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// PUT - Protected
async function updateSettings(req, res) {
  try {
    const settings = await Settings.findOneAndUpdate({}, req.body, {
      new: true,
      runValidators: true,
      upsert: true,
    });
    return res.status(200).json({ success: true, data: settings });
  } catch (error) {
    console.error("Update settings error:", error);
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
