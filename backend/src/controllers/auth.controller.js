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

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullName, email, phone, address, bio, department, position, joinDate, profilePicture } = req.body;
    
    console.log("Updating profile for user:", userId);
    console.log("Update data:", { fullName, email, phone, address, bio, department, position, joinDate, profilePicture });
    
    const updateData = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (bio !== undefined) updateData.bio = bio;
    if (department !== undefined) updateData.department = department;
    if (position !== undefined) updateData.position = position;
    if (joinDate !== undefined) updateData.joinDate = joinDate;
    if (profilePicture !== undefined) updateData.profilePicture = profilePicture;
    
    const user = await User.findByIdAndUpdate(
      userId, 
      updateData, 
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    console.log("Profile updated successfully:", user);
    
    res.json({
      success: true,
      message: "Profile updated successfully",
      user
    });
    
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    
    console.log("Change password request for user:", userId);
    
    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    console.log("Current password match:", isMatch);
    
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }
    
    // Validate new password strength
    if (newPassword.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log("New password hashed successfully");
    
    // Update password
    user.password = hashedPassword;
    await user.save();
    
    console.log("Password changed successfully for user:", user.username);
    
    res.json({
      success: true,
      message: "Password changed successfully"
    });
    
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Failed to change password", error: error.message });
  }
};

// TEMPORARY - Remove after testing
export const debugCheckPassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    
    res.json({
      success: true,
      passwordMatches: isMatch,
      storedHash: user.password.substring(0, 20) + "...",
      passwordProvided: password
    });
    
  } catch (error) {
    console.error("Debug error:", error);
    res.status(500).json({ message: "Error" });
  }
};