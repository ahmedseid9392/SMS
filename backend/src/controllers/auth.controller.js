import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Student from "../models/Student.model.js";
import Teacher from "../models/Teacher.model.js";
import Parent from "../models/Parent.model.js";
import User from "../models/User.model.js";

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check all collections for a user with this username
    let user =
      (await User.findOne({ username })) ||
      (await Teacher.findOne({ username })) ||
      (await Student.findOne({ username })) ||
      (await Parent.findOne({ username }));

    if (!user)
      return res.status(404).json({ message: "User not found" });

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });
// Create JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    const userData = {
      id: user._id,
      name: user.fullName || user.name,
      role: user.role,
      username: user.username,
      mustChangePassword: user.mustChangePassword,
    };

    res.json({
      message: "Login successful",
       token,
      user: userData,
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login error" });
  }
};
