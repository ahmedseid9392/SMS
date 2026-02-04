import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import Student from "../models/Student.model.js";
import Teacher from "../models/Teacher.model.js";
import Parent from "../models/Parent.model.js";

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "No token, unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user =
      (await User.findById(decoded.id)) ||
      (await Teacher.findById(decoded.id)) ||
      (await Student.findById(decoded.id)) ||
      (await Parent.findById(decoded.id));

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = {
      id: user._id,
      role: user.role,
    };

    next();
  } catch (err) {
    console.error("AUTH ERROR:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default protect;
