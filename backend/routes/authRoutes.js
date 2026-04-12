import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendEmail } from "../services/emailService.js";


const router = express.Router();

// Register (User only)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hash = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const user = await User.create({
      name,
      email,
      password: hash,
      isVerified: false,
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000
    });

    console.log(`Registration for ${email}. OTP: ${otp}`);
    sendEmail(email, "Verify your email", `Your registration OTP is: ${otp}`).catch(e => console.error("Bg Mail Error:", e.message));

    res.json({ 
      message: "Registration successful. Please verify your email.", 
      email: user.email,
      requiresOTP: true
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});


// Verify OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Super Admin Bypass
    if (email.toLowerCase() === process.env.SUPER_ADMIN_EMAIL.toLowerCase()) {
      // Also verify the user in DB if exists to prevent login loops
      const superUser = await User.findOne({ email });
      if (superUser) {
        superUser.isVerified = true;
        superUser.otp = undefined;
        superUser.otpExpires = undefined;
        await superUser.save();
        console.log("Super Admin DB User marked as verified.");
      }

      const token = jwt.sign({ email: email.toLowerCase(), role: "super_admin" }, process.env.JWT_SECRET);
      return res.json({ message: "Detailed verified", token, role: "super_admin" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    // Mark as verified if they are entering a code correctly
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.json({ 
      message: "Email verified successfully.", 
      token, 
      role: user.role,
      name: user.name,
      email: user.email
    });

  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ message: "Server error during OTP verification" });
  }
});


// Resend OTP
router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;

    // Super Admin - Auto Verify if not exists, or just send success
    if (email.toLowerCase() === process.env.SUPER_ADMIN_EMAIL.toLowerCase()) {
      return res.json({ message: "Super Admin does not need OTP." });
    }

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();
    console.log(`Resend OTP for ${email}: ${otp}`);
    sendEmail(email, "Verify your email", `Your new OTP is: ${otp}`).catch(e => console.error("Bg Mail Error:", e.message));
    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Forgot Password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    console.log(`Forgot Password OTP for ${email}: ${otp}`);
    sendEmail(email, "Reset your password", `Your OTP for password reset is: ${otp}`).catch(e => console.error("Bg Mail Error:", e.message));
    res.json({ message: "OTP sent to your email." });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Reset Password
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful. You can now login." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Super Admin (Case Insensitive Email)
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || "";
  if (
    email.toLowerCase() === superAdminEmail.toLowerCase() &&
    password === process.env.SUPER_ADMIN_PASSWORD
  ) {
    const token = jwt.sign(
      { email: email.toLowerCase(), role: "super_admin" },
      process.env.JWT_SECRET
    );
    console.log("Super Admin logged in via ENV credentials");
    return res.json({ token, role: "super_admin" });
  }

  console.log(`Regular login attempt for: ${email}`);

  const user = await User.findOne({ email });
  if (!user) {
    console.log("User not found in DB");
    return res.status(404).json({ message: "User not found" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "Wrong password" });

  console.log(`User found: ${user.email}, isVerified: ${user.isVerified}`);

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpires = Date.now() + 10 * 60 * 1000;
  await user.save();

  console.log(`Login verification for ${email}. OTP: ${otp}`);
  sendEmail(email, "Login Verification Code", `Your security code is: ${otp}`).catch(e => console.error("Bg Mail Error:", e.message));

  res.json({ 
    message: "OTP sent to your email.", 
    requiresOTP: true,
    email: user.email
  });
});

// Get Current User Profile
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password -otp -otpExpires");

    if (!user) {
      // Check for Super Admin based on email in token if ID null (since super admin might not be in DB properly or just env based)
      // But for "Member Since" we need DB. If super admin is only ENV, we mock it.
      if (decoded.role === 'super_admin') {
        return res.json({
          name: "Super Admin",
          email: process.env.SUPER_ADMIN_EMAIL,
          role: "super_admin",
          createdAt: new Date(), // Just now
          isVerified: true
        });
      }
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Profile Fetch Error:", error);
    res.status(401).json({ message: "Invalid Token" });
  }
});

// Update User Profile
router.put("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role === 'super_admin') {
        return res.status(400).json({ message: "System Super Admin profile cannot be edited here." });
    }

    const { name, email } = req.body;
    const user = await User.findById(decoded.id);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    if (email && email.toLowerCase() !== user.email.toLowerCase()) {
        const emailExists = await User.findOne({ email: email.toLowerCase() });
        if (emailExists) {
            return res.status(400).json({ message: "Email already in use" });
        }
    }

    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();

    res.json({ 
        message: "Profile updated successfully", 
        user: { name: user.name, email: user.email }
    });
  } catch (error) {
    console.error("Profile Update Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
