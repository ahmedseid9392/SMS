import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import Student from "../models/Student.model.js";
import Teacher from "../models/Teacher.model.js";
import Parent from "../models/Parent.model.js";

const protect = async (req, res, next) => {
  try {
    let token = null;

    // Extract Bearer token
    if (req.headers.authorization?.startsWith("Bearer")) {
      const parts = req.headers.authorization.split(" ");
      if (parts.length === 2) token = parts[1];
    }

    // No Token
    if (!token) {
      return res.status(401).json({ message: "No token, unauthorized" });
    }

    // Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return res.status(401).json({ message: "Invalid token data" });
    }

    // Search in all user types
    const user =
      (await User.findById(decoded.id)) ||
      (await Teacher.findById(decoded.id)) ||
      (await Student.findById(decoded.id)) ||
      (await Parent.findById(decoded.id));

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach user info to request
    req.user = {
      id: user._id,
      role: user.role,
    };

    next();

  } catch (err) {
    console.error("AUTH ERROR:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default protect;
