import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import api from "../prisma/config/prisma.js";

const userSelect = {
  id: true,
  name: true,
  phone: true,
  state: true,
  country: true,
  email: true,
  createdAt: true,
  updatedAt: true,
};

const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "agritech-secret", {
    expiresIn: "7d",
  });
};

const sendOtpEmail = async (email, otp) => {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS
  ) {
    console.log(`Password reset OTP for ${email}: ${otp}`);
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: "AgriTech password reset OTP",
    text: `Your AgriTech password reset OTP is ${otp}. It will expire in 10 minutes.`,
  });

  return true;
};

export const signup = async (req, res) => {
  try {
    const { name, phone, state, country, email, password } = req.body;

    if (!name || !phone || !state || !country || !email || !password) {
      return res.status(400).json({
        error: "name, phone, state, country, email, and password are required",
      });
    }

    const existingUser = await api.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        error: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await api.user.create({
      data: {
        name,
        phone,
        state,
        country,
        email,
        password: hashedPassword,
      },
      select: userSelect,
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      token: createToken(user.id),
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: "Failed to create user",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "email and password are required",
      });
    }

    const user = await api.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const { password: _password, ...safeUser } = user;

    return res.json({
      message: "Login successful",
      token: createToken(user.id),
      user: safeUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Failed to login",
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req);

    if (!userId) {
      return res.status(401).json({
        error: "Authorization token is required",
      });
    }

    const user = await api.user.findUnique({
      where: { id: Number(userId) },
      select: userSelect,
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    return res.json({ user });
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      error: "Invalid or expired token",
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await api.user.findUnique({
      where: { id: Number(id) },
      select: userSelect,
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    return res.json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Failed to fetch user",
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: "email is required",
      });
    }

    const user = await api.user.findUnique({
      where: { email },
      select: { id: true, email: true },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await api.passwordResetOtp.deleteMany({
      where: { email },
    });

    await api.passwordResetOtp.create({
      data: {
        email,
        otp,
        expiresAt,
      },
    });

    const emailSent = await sendOtpEmail(email, otp);

    return res.json({
      message: "OTP generated successfully",
      emailSent,
      ...(emailSent ? {} : { otp }),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Failed to generate OTP",
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        error: "email and otp are required",
      });
    }

    const savedOtp = await api.passwordResetOtp.findFirst({
      where: { email, otp },
      orderBy: { createdAt: "desc" },
    });

    if (!savedOtp || savedOtp.expiresAt < new Date()) {
      return res.status(400).json({
        error: "Invalid or expired OTP",
      });
    }

    await api.passwordResetOtp.update({
      where: { id: savedOtp.id },
      data: { verified: true },
    });

    return res.json({
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Failed to verify OTP",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      return res.status(400).json({
        error: "email, otp, and password are required",
      });
    }

    const savedOtp = await api.passwordResetOtp.findFirst({
      where: { email, otp },
      orderBy: { createdAt: "desc" },
    });

    if (!savedOtp || !savedOtp.verified || savedOtp.expiresAt < new Date()) {
      return res.status(400).json({
        error: "OTP verification is required",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await api.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    await api.passwordResetOtp.deleteMany({
      where: { email },
    });

    return res.json({
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Failed to reset password",
    });
  }
};

export const createProfile = signup;

export const updateProfile = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req);

    if (!userId) {
      return res.status(401).json({
        error: "Authorization token is required",
      });
    }

    const { name, phone, state, country } = req.body;

    const user = await api.user.update({
      where: { id: Number(userId) },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(state && { state }),
        ...(country && { country }),
      },
      select: userSelect,
    });

    return res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Failed to update profile",
    });
  }
};
