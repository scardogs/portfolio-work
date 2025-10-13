import { authenticate } from "../../../middleware/auth";
import cloudinary from "../../../lib/cloudinary";

async function handler(req, res) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    const { resources } = await cloudinary.api.resources({
      type: "upload",
      prefix: "portfolio",
      max_results: 100,
    });

    const images = resources.map((resource) => ({
      url: resource.secure_url,
      publicId: resource.public_id,
      createdAt: resource.created_at,
    }));

    return res.status(200).json({
      success: true,
      data: images,
    });
  } catch (error) {
    console.error("Cloudinary fetch error:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch images",
        error: error.message,
      });
  }
}

export default authenticate(handler);
