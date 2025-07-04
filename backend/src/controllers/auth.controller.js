import User from "../models/User.js";
import Submission from "../models/Submission.js";
import jwt from "jsonwebtoken";

export async function signupUser(req, res) {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must have more than 6 letters" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already exists, please use a diffrent one" });
    }
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    const newUser = await User.create({
      email,
      username,
      password,
      profilePic: randomAvatar,
    });
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.log("Error in signupUser controller ", error);
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in loginUser controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function logoutUser(req, res) {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  res.status(200).json({ success: true, message: "Logout successful" });
}

export async function onboardingUser(req, res) {
  try {
    const userId = req.user._id;
    const { fullName, bio } = req.body;

    if (!fullName || !bio) {
      return res.status(400).json({
        message: "All fields are required",
        missingFields: [!fullName && "fullName", !bio && "bio"].filter(Boolean),
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullName: fullName,
        bio: bio,
        isOnboarded: true,
      },
      { new: true }
    );

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });
    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Onboarding error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getAllUsers(req, res) {
  try {
    const users = await User.find({});
    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.log("Error in getAllUser controller", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching users",
    });
  }
}

export async function makeAdmin(req, res) {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        success: false,
        message: "User is already an admin",
      });
    }

    user.role = "admin";
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User promoted to admin",
      user,
    });
  } catch (error) {
    console.error("Error in makeAdmin controller:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while making admin",
    });
  }
}

export async function updateUserAccount(req, res) {
  try {
    const userId = req.user._id;

    const allowedFields = ["fullName", "bio"];
    const updates = {};

    for (let field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Account updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating account:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update account." });
  }
}

export async function deleteUserAccount(req, res) {
  try {
    const userId = req.user._id;
    console.log(userId);
    await Submission.deleteMany({ user: userId });

    await User.findByIdAndDelete(userId);

    res
      .status(200)
      .json({ success: true, message: "Account deleted successfully." });
  } catch (error) {
    console.error("Error deleting account:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete account." });
  }
}
