import { authenticate } from "../../../middleware/auth";

async function handler(req, res) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  return res.status(200).json({
    success: true,
    user: req.user,
  });
}

export default authenticate(handler);
