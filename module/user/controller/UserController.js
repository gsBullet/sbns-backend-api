const UserModel = require("../model/UserModel");
const bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");

module.exports = {
  registerUser: async (req, res) => {
    const { username, email, password, phone, userRole } = req.body;
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already in use" });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      phone,
      userRole,
    });

    if (!user) {
      return res
        .status(500)
        .json({ success: false, message: "User registration failed" });
    }
    return res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  },
  loginUser: async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = await jwt.sign(
      {
        _id: user._id,
        username: user.username,
        phone: user.phone,
        userRole: user.userRole,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
      userData: {
        _id: user._id,
        username: user.username,
        phone: user.phone,
        userRole: user.userRole,
      },
    });
  },

  getMe: async (req, res) => {
    const userId = req.user?._id;

    try {
      const user = await UserModel.findById(userId).select("-password"); // Exclude password
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      return res.status(200).json({
        success: true,
        message: "User profile fetched successfully",
        userData: user,
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  },

  updateMyProfile: async (req, res) => {
    const { username, email, phone, userRole } = req.body;
    const userId = req.user.id; // Assuming you have user ID from authentication middleware

    try {
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { username, email, phone, userRole },
        { new: true },
      );

      if (!updatedUser) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  },
};
