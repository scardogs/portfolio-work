import dbConnect from "../../../lib/mongodb";
import WorkExperience from "../../../models/WorkExperience";
import { authenticate } from "../../../middleware/auth";

async function handler(req, res) {
  await dbConnect();

  const { id } = req.query;

  switch (req.method) {
    case "PUT":
      return updateWorkExperience(req, res, id);
    case "DELETE":
      return deleteWorkExperience(req, res, id);
    default:
      return res
        .status(405)
        .json({ success: false, message: "Method not allowed" });
  }
}

async function updateWorkExperience(req, res, id) {
  try {
    const workExperience = await WorkExperience.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!workExperience) {
      return res
        .status(404)
        .json({ success: false, message: "Work experience not found" });
    }

    return res.status(200).json({ success: true, data: workExperience });
  } catch (error) {
    console.error("Update work experience error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

async function deleteWorkExperience(req, res, id) {
  try {
    const workExperience = await WorkExperience.findByIdAndDelete(id);

    if (!workExperience) {
      return res
        .status(404)
        .json({ success: false, message: "Work experience not found" });
    }

    return res.status(200).json({ success: true, data: workExperience });
  } catch (error) {
    console.error("Delete work experience error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export default authenticate(handler);
