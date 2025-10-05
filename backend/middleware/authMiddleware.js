import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      return res
        .status(401)
        .json({ error: { code: "NOT_AUTHORIZED", message: "Token failed" } });
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ error: { code: "NO_TOKEN", message: "No token provided" } });
  }
};

export const requireRole = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: { code: "NO_TOKEN" } });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: { code: "FORBIDDEN" } });
    }
    next();
  };
};
