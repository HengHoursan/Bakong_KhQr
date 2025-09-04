const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // const authHeader = req.headers.authorization;

  // if (!authHeader || !authHeader.startsWith("Bearer")) {
  //   return res
  //     .status(401)
  //     .json({ message: "Access denied. No token provided." });
  // }

  // const token = authHeader.split(" ")[1];

  // try {
  //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //   req.user = decoded;
  //   next();
  // } catch (err) {
  //   return res.status(403).json({ message: "Invalid token." });
  // }
  const token = req.cookies.accessToken;
  console.log("Token from cookie:", token);

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access denied. No token provided." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded) {
      req.user = decoded;
      next();
    } else {
      return res
        .status(403)
        .json({ success: false, message: "Invalid token." });
    }
  } catch (err) {
    return res
      .status(403)
      .json({ success: false, message: err.message || "Invalid token." });
  }
};

module.exports = verifyToken;
