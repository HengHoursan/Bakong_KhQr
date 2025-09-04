const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied. You are not allowed to perform this action.",
      });
    }
    next();
  };
};

module.exports = authorizeRoles;
