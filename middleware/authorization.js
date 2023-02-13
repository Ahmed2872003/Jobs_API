const User = require("../models/User");
const { UnauthenticatedError } = require("../errors");
const JWT = require("jsonwebtoken");

const authorization = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer "))
    throw new UnauthenticatedError(
      "You're not allowed to access that resource"
    );
  try {
    const token = authorization.split(" ")[1];

    const payload = JWT.verify(token, process.env.JWT_SECRET);

    req.user = { id: payload.userId, name: payload.name };

    next();
  } catch (err) {
    throw new UnauthenticatedError(
      "You're not allowed to access that resource"
    );
  }
};

module.exports = authorization;
