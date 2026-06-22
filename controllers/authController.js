import bcrypt from "bcrypt";
import api from "../prisma/config/prisma.js";

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
      select: {
        id: true,
        name: true,
        phone: true,
        state: true,
        country: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
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
        success: false,
        error: "Email and password are required",
      });
    }

    const user = await api.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: "Failed to login",
    });
  }
};
