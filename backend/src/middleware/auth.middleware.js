import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import Student from "../models/Student.model.js";
import Teacher from "../models/Teacher.model.js";
import Parent from "../models/Parent.model.js";
import Course from "../models/Courses.js";

const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization?.split(" ")[1];

    if (!token)
      return res.status(401).json({ message: "No token, unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 Search user in all collections
    const user =
      (await User.findById(decoded.id)) ||
      (await Teacher.findById(decoded.id)) ||
      (await Student.findById(decoded.id)) ||
      (await Parent.findById(decoded.id)) ;
      

    if (!user)
      return res.status(401).json({ message: "User not found in database" });

    req.user = { id: user._id, role: user.role };

    next();
  } catch (err) {
    console.error("PROTECT ERROR:", err);
    res.status(500).json({ message: "Token validation failed" });
  }
};

export default protect;
