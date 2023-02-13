const User = require("../models/User.js");

const { StatusCodes } = require("http-status-codes");

const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  const user = await User.create(req.body);

  const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({ token, user: { name: user.name } });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new BadRequestError("Must provide email and password");

  const user = await User.findOne({ email });

  if (!user) throw new UnauthenticatedError("That email is not exist");

  const isPasswordTrue = await user.isPasswordTrue(password);

  if (!isPasswordTrue) throw new UnauthenticatedError("Wrong password");

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ token, user: { name: user.name } });
};

module.exports = {
  register,
  login,
};
