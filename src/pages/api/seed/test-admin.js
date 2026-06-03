import dbConnect from "../../../lib/mongodb";
import Admin from "../../../models/Admin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    await dbConnect();
    
    const existing = await Admin.findOne({ username: "tester" });
    if (existing) {
      return res.status(200).json({ success: true, message: "Tester already exists" });
    }

    const admin = await Admin.create({
      username: "tester",
      password: "password123",
      email: "tester@example.com",
    });

    return res.status(201).json({ success: true, message: "Tester created", data: admin });
  } catch (error) {
    console.error("Create tester error:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
}
