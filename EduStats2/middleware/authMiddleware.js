const jwt = require("jsonwebtoken");
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res
      .status(401)
      .json({ status: false, message: "Unauthorized, Please login first" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(500).json({ status: false, message: "internal server error" });
  }
};
module.exports = authMiddleware;