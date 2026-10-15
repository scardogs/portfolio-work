import dbConnect from "../../../lib/mongodb";
import WorkExperience from "../../../models/WorkExperience";
import { authenticate } from "../../../middleware/auth";

async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  await dbConnect();

  try {
    const { experiences } = req.body;

    if (!Array.isArray(experiences)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid work experience list" });
    }

    const updatePromises = experiences.map((id, index) =>
      WorkExperience.findByIdAndUpdate(id, { order: index })
    );

    await Promise.all(updatePromises);

    return res
      .status(200)
      .json({ success: true, message: "Order updated successfully" });
  } catch (error) {
    console.error("Reorder work experiences error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export default authenticate(handler);
