
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require("../config/config");

const authMiddleware = async (req, res, next) => {
  try {
    const _auth_header = req.headers.authorization;
    if (!_auth_header || !_auth_header.startsWith("Bearer")) {
      return res.status(403).json({
        message: "Unauthorized"
      })
    }
    const token = _auth_header.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized"
    })

  }
};

module.exports = {
  authMiddleware
};