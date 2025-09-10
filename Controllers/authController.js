const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsync = require("./catchasync");
const AppError = require("./../utils/appError");
const sendEmail = require("./../utils/sendEmail");

const signInToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { firstname, lastname, email, password, passwordConfirm } = req.body;

  let user = await User.findOne({ email });

  if (user) {
    if (user.verified) {
      return next(new AppError("Email already exists. Please Login!", 400));
    }

    if (user.verificationTokenExpires < Date.now()) {
      const newToken = user.createVerificationToken();
      await user.save({ validateBeforeSave: false });

      const verifyUrl = `${req.protocol}://${req.get(
        "host"
      )}/api/v1/users/verify/${newToken}`;

      const message = `Your previous link is expired. Please verify your email using this link ${verifyUrl}`;

      await sendEmail({
        email: user.email,
        subject: "Resend Verification Link",
        message,
      });

      return res.status(200).json({
        status: "success",
        message: "Verification link expired. New link sent to your email.",
      });
    }

    return next(
      new AppError(
        "You already signed up. Please check your email for verification"
      )
    );
  }

  newUser = await User.create({
    firstname,
    lastname,
    email,
    password,
    passwordConfirm,
  });

  const verifyToken = newUser.createVerificationToken();
  await newUser.save({ validateBeforeSave: false });

  const verifyUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/verify/${verifyToken}`;

  const message = `Welcome! Please verify your email by clicking here ${verifyUrl}`;

  await sendEmail({
    email: newUser.email,
    subject: "Verify your email",
    message,
  });

  res.status(200).json({
    status: "success",
    message: "Verification email sent. Please  check your inbox",
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new AppError("Please provide the valid email and password", 401)
    );
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password!", 401));
  }

  if (!user.verified) {
    return next(
      new AppError("Please verify your email before logging in ", 403)
    );
  }

  const token = signInToken(user._id);

  res.status(200).json({
    status: "success",
    token,
  });
});

exports.verifyEmail = catchAsync(async (req, res, next) => {
  const hashToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    verificationToken: hashToken,
    verificationTokenExpires: { $gt: Date.now() },
  });

  console.log(user);

  if (!user) {
    return next(new AppError("Token is invalid or expires", 400));
  }

  user.verified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save({ validateBeforeSave: false });

  const token = signInToken(user._id);

  res.status(200).json({
    status: "success",
    token,
    message: "Email verified successfully",
  });
});
