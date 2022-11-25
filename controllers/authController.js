const express = require("express");
var jwt = require("jsonwebtoken");
const User = require("../models/user");
const sendEmail = require("../utils/email");
const crypto = require("crypto");
const {promisify} = require("util")

const singToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_Secret_Key, {
    expiresIn: process.env.JWT_Expires_In,
  });
};

exports.singUp = async (req, res) => {
  let user = await User.create({
    name:req.body.name,
    email:req.body.email,
    password:req.body.password
  });
  const token = singToken(user._id);
    res.status(200).json({
      status: "Success SingUp",
      token,
    });
};










const catchAsync = fn => {
  return (req,res,next) => {
  fn(req,res,next).catch(err => console.log(err))
}}


exports.login = catchAsync(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json("Please Provide email and password");
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json("Incorrect email or password");
    }

    const token = singToken(user._id);
    res.status(200).json({
      status: "success",
      token,
    });
})









exports.protectAuth = (req, res) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401).json({
      status: "You are not logged in! Please log in to get access.",
    });
  }
  console.log('decode');

  const decode = promisify(jwt.verify)(token,process.env.JWT_Secret_Key)

    console.log(decode)

next();


};

exports.forgetPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    res.status(404).json("There is no user with email address.", 404);
  }

  const resetToken = user.createPasswordResetToken();

  await user.save();

  const restURL = `${req.protocol}:// ${req.get(
    "host"
  )}/api/v1/resetPassword/${resetToken}`;

  const message = `click in this link to go reset password page ${restURL}`;

  await sendEmail({
    email: req.body.email,
    subject: "the token is available for 10 minutes",
    message,
  });

  res.status(200).json({
    status: "success",
    message: "Token sent to email!",
  });
};

exports.resetPassword = async function (req, res) {
  const hashedToken = crypto
    .createHash("sha1")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Token is invalid or has expired" });
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  return res.status(400).json({ message: "done" });
};
