import dbConnect from "../../../lib/mongodb";
import Admin from "../../../models/Admin";
import { generateToken } from "../../../middleware/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    await dbConnect();

    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Please provide all required fields",
        });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      $or: [{ username }, { email }],
    });

    if (existingAdmin) {
      return res
        .status(400)
        .json({ success: false, message: "Username or email already exists" });
    }

    // Create new admin
    const admin = await Admin.create({ username, password, email });

    // Generate token
    const token = generateToken(admin);

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
