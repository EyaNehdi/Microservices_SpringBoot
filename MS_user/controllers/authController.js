const bcryptjs = require('bcryptjs');
const User = require('../models/userModel');
const generateToken = require('../utils/generateTokenAndSetCookie');
const bcrypt = require('bcryptjs');

const crypto = require('crypto');

const jwt = require('jsonwebtoken');

const axios = require('axios');
//signup function
const register = async (req, res) => {
  console.log("🔹 Received Request Body:", req.body); // Log request body

  const { firstName, lastName, email, password } = req.body; // Ensure role is extracted

  try {
    // Validate input fields
    if (!firstName || !lastName || !email || !password  ) {
      console.error("❌ Validation Failed: Missing Fields", { firstName, lastName, email, password });
      return res.status(400).json({ error: "All fields are required" });
    }

    console.log("🔍 Checking if email already exists:", email);
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.error("❌ Validation Failed: Email already registered", email);
      return res.status(400).json({ error: "Email already registered" });
    }

    console.log("✅ Email is available. Creating new user...");

    // Generate a 6-digit verification token
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // Token expires in 24 hours
    });

    await newUser.save();
    console.log("✅ User saved successfully:", newUser);

    // Generate JWT Token (you can still generate the token for now, but don't use it for verification)
    generateToken(res, newUser._id);
    console.log("✅ JWT Token generated for user:", newUser._id);

    // Send the verification email with the token
    console.log("📧 Verification email sent to:", newUser.email);

    res.status(201).json({
      success: true,
      message: "Registration successful. Please check your email for the verification code.",
      user: {
        ...newUser._doc,
        password: undefined, // Don't send password back in response
      },
    });

  } catch (err) {
    console.error("🔥 Unexpected Error:", err);
    res.status(500).json({ error: "Registration failed: " + err.message });
  }
};




const checkAuth = async (req, res) => {

  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });

    }


    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in checkAuth ", error);
    signOut();
    res.status(400).json({ success: false, message: error.message });
  }
};

const signIn = async (req, res) => {
  const { email, password, stayLoggedIn } = req.body;
  console.log("StayLoggedIn:", stayLoggedIn);

  try {
    const user = await User.findOne({ email });
    if (stayLoggedIn === undefined) {
      return res.status(400).json({ message: "Missing stayLoggedIn value" });
    }
    if (!user) {
      console.log("🔴 User not found");
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    console.log("🟢 Found user:", user.email);
    console.log("🟢 Stored hashed password:", user.password);

    const isPasswordValid = await bcrypt.compare(password, user.password);


    if (!isPasswordValid) {
      console.log("🔴 Password does not match");
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Set token expiration based on stayLoggedIn
    generateToken(res, user._id, stayLoggedIn);

    console.log("🟢 Login successful for user:", user.email);

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });

  } catch (error) {
    console.error("🔴 Error in login:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// Generate a secure random token
const generateResetToken = () => {
  return crypto.randomBytes(20).toString('hex');
};


const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    // Check if the user exists in the database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate a password reset token (using a library like crypto)
    const resetToken = generateResetToken(); // Implement this function to generate a secure token
    user.resetToken = resetToken;
    user.resetTokenExpiresAt = Date.now() + 3600000; // Token valid for 1 hour
    await user.save();

    // Send the password reset email
    await sendPasswordResetEmail(user.email, resetToken);

    res.status(200).json({
      message: "Password reset email sent! Please check your inbox.",
    });
  } catch (error) {
    console.error("Error sending password reset email:", error);
    res.status(500).json({ error: "Failed to send password reset email" });
  }
};


const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body
  console.log("Reset password request body:", { token, passwordLength: newPassword?.length })

  if (!token || !newPassword) {
    return res.status(400).json({ error: "Token and new password are required" })
  }

  try {
    // Find user with valid token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiresAt: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" })
    }

    console.log("✅ Found user with valid token:", user.email)

    // Set the plain text password - the pre-save hook will handle hashing
    user.password = newPassword
    user.resetToken = undefined
    user.resetTokenExpiresAt = undefined

    // Save the user
    await user.save()

    // Verify the password was saved correctly
    const updatedUser = await User.findById(user._id)
    console.log("Stored password hash after save:", updatedUser.password)

    // Test password verification using the model's method
    const verificationTest = await updatedUser.comparePassword(newPassword)
    console.log("Password verification test:", verificationTest ? "PASSED ✅" : "FAILED ❌")

    // Generate token after resetting password
    generateToken(res, user._id, false)

    res.status(200).json({
      success: true,
      message: "Password reset successfully!",
    })
  } catch (error) {
    console.error("❌ Error resetting password:", error)
    res.status(500).json({
      success: false,
      error: "Failed to reset password",
    })
  }
}








const markChapterAsCompleted = async (req, res) => {
  const { userId, chapterId } = req.query; // Retrieving query params

  try {
    // Ensure both userId and chapterId are provided
    if (!userId || !chapterId) {
      return res.status(400).json({ error: "UserId and chapterId are required" });
    }

    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the chapterId is already in the completedChapters array
    const completedChapters = user.completedChapters || [];

    // If the chapter is not already completed, add it to the completedChapters array
    if (!completedChapters.includes(chapterId)) {
      completedChapters.push(chapterId);

      // Update the user's completedChapters array in the database
      user.completedChapters = completedChapters;
      await user.save();
    }

    // Return the updated completedChapters array
    return res.status(200).json({ completedChapters });

  } catch (err) {
    console.error("Error marking chapter as completed:", err);
    return res.status(500).json({ error: "An error occurred while marking the chapter as completed" });
  }
};





const signOut = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};


const trackCurrentLocation = async (req, res) => {
  console.log("User ID from Token:", req.userId); // Log this to verify it is available here

  if (!req.userId) return res.status(400).json({ error: "User ID not found in token" });

  try {
    let location;
    try {
      const ipResponse = await fetch("https://api.ipify.org?format=json");
      const ipData = await ipResponse.json();
      const ip = ipData.ip;

      const geoResponse = await fetch(`https://ipinfo.io/${ip}/json`);
      location = await geoResponse.json();

      console.log("Location Data:", location);

      const user = await User.findById(req.userId);
      if (!user) return res.status(404).json({ error: "User not found" });

      user.lastLoginLocation = {
        city: location.city || "Unknown",
        region: location.region || "",
        country: location.country || "Unknown",
        loggedInAt: new Date(),
      };

      await user.save();
      res.json({ message: "Location updated", location: user.lastLoginLocation, userId: req.userId, userData: user });
    } catch (apiError) {
      console.error("API Error:", apiError);
      if (req.userId) {
        const user = await User.findById(req.userId);
        if (user) {
          user.lastLoginLocation = {
            city: "Fallback City",
            region: "",
            country: "Fallback Country",
            loggedInAt: new Date(),
          };
          await user.save();
          return res.json({ message: "Using fallback location due to API errors", location: user.lastLoginLocation });
        }
      }
      return res.status(500).json({ error: "Could not fetch location data" });
    }
  } catch (err) {
    console.error("Failed to track location:", err);
    res.status(500).json({ error: "Could not update location" });
  }
};



module.exports = {
  checkAuth, signIn,
  signOut,
  forgotPassword,
  resetPassword,
  markChapterAsCompleted,
  trackCurrentLocation,
  register,

};

