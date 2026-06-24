import jwt from "jsonwebtoken";

export const getAuthenticatedUserId = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.send("Not authenticated please login");
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "agritech-secret",
    );
    req.id = decoded.userId;
    next();
  } catch (e) {
    return res.send(`Not authenticated please login ${e.message}`);
  }
};
