import dbConnect from "../../../lib/mongodb";
import WorkExperience from "../../../models/WorkExperience";

export default async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case "GET":
      return getWorkExperiences(req, res);
    default:
      return res
        .status(405)
        .json({ success: false, message: "Method not allowed" });
  }
}

async function getWorkExperiences(req, res) {
  try {
    const workExperiences = await WorkExperience.find().sort({ order: 1 });
    return res.status(200).json({ success: true, data: workExperiences });
  } catch (error) {
    console.error("Get work experiences error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
