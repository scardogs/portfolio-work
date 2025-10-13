import { authenticate } from "../../../middleware/auth";
import cloudinary from "../../../lib/cloudinary";

async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    const { image } = req.body;

    if (!image) {
      return res
        .status(400)
        .json({ success: false, message: "No image provided" });
    }

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: "portfolio",
      resource_type: "auto",
    });

    return res.status(200).json({
      success: true,
      data: {
        url: uploadResponse.secure_url,
        publicId: uploadResponse.public_id,
      },
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Upload failed", error: error.message });
  }
}

export default authenticate(handler);

// Increase body size limit for image uploads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};
