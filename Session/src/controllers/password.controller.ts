import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import { User } from "../models/user";
import { sendResetCodeEmail } from "../services/email.services";

// FORGOT PASSWORD
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Generate a 6-digit OTP
    const code = crypto.randomInt(100000, 1000000).toString();

    // OTP expires after 10 minutes
    user.resetCode = code;
    user.resetCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

    await user.save();

    // Send OTP through Brevo SMTP
    await sendResetCodeEmail(email, code);

    return res.status(200).json({
      message: "Reset code sent to your email",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      message: "Failed to send reset code",
    });
  }
};

// RESET PASSWORD
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({
        message: "Email, code and new password are required",
      });
    }

    // Check email, OTP and expiration
    const user = await User.findOne({
      email,
      resetCode: code,
      resetCodeExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired code",
      });
    }

    // Hash the new password
    user.password = await bcrypt.hash(newPassword, 10);

    // Remove used OTP
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;

    await user.save();

    return res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      message: "Password reset failed",
    });
  }
};

