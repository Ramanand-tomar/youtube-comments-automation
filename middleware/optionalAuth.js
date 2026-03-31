const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "beyondchats-youtube-automation-secret";

async function optionalAuth(req, res, next) {
  req.user = null;

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (user) {
      req.user = user;
    }
  } catch {
    // Invalid token — continue as anonymous
  }

  next();
}

function getUserIdentity(req) {
  if (req.user) {
    return {
      userIdentifier: req.user._id.toString(),
      identifierType: "user",
    };
  }
  return {
    userIdentifier: req.ip || req.connection?.remoteAddress || "unknown",
    identifierType: "ip",
  };
}

module.exports = { optionalAuth, getUserIdentity };
