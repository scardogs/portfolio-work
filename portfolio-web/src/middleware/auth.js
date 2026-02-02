import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

export function generateToken(user, expiresIn = "7d") {
  return jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, {
    expiresIn: expiresIn,
  });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function authenticate(handler) {
  return async (req, res) => {
    try {
      const token =
        req.headers.authorization?.replace("Bearer ", "") || req.cookies?.token;

      if (!token) {
        return res
          .status(401)
          .json({ success: false, message: "No token provided" });
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid token" });
      }

      req.user = decoded;
      return handler(req, res);
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication failed" });
    }
  };
}
