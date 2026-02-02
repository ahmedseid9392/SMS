import User from "../models/User.model.js";
import generateToken from "../utils/generateToken.js";

// LOGIN
export const loginUser = async (req, res) => {
  try {
     const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      username: user.username,
      role: user.role,
      isFirstLogin: user.isFirstLogin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Invalid username or password" });
  }

      
  } 
  catch (error) {
    console.log(error);
  }
};

// CHANGE PASSWORD
export const changePassword = async (req, res) => {
  const { newPassword } = req.body;

  const user = await User.findById(req.user._id);
  user.password = newPassword;
  user.isFirstLogin = false;

  await user.save();

  res.json({ message: "Password updated successfully" });
};

 
