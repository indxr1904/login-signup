const User = require("./../models/userModel");
const AppError = require("./../utils/appError");
const catchAsync = require("./catchasync");
const Factory = require("./handleFactory");

exports.getAllUsers = Factory.getAll(User);
exports.getUser = Factory.getOne(User);

exports.createUser = async (req, res, next) => {
  console.log("1111");
  const { email, password, passwordConfirm } = req.body;

  if (!email || !password || !passwordConfirm) {
    return next(new AppError("Please provide email and password"));
  }

  const newUser = await User.create({
    email,
    password,
    passwordConfirm,
  });
  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
};
