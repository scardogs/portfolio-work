import { authenticate } from "../../../middleware/auth";
import cloudinary from "../../../lib/cloudinary";

async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    const { publicId } = req.body;

    if (!publicId) {
      return res
        .status(400)
        .json({ success: false, message: "No public ID provided" });
    }

    await cloudinary.uploader.destroy(publicId);

    return res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Delete failed", error: error.message });
  }
}

export default authenticate(handler);
