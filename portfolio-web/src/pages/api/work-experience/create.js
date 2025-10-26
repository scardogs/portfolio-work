import dbConnect from "../../../lib/mongodb";
import WorkExperience from "../../../models/WorkExperience";
import { authenticate } from "../../../middleware/auth";

export default authenticate(async function handler(req, res) {
  await dbConnect();

  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    const workExperience = await WorkExperience.create(req.body);
    return res.status(201).json({ success: true, data: workExperience });
  } catch (error) {
    console.error("Create work experience error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

