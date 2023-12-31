const express = require("express");
const model = require("../model/model");
const bcrypt = require("bcrypt");
const generateToken = require("../GenToken");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const router = express.Router();
const shortid = require("shortid");

router.get("/users", async (req, res) => {
  const user = await model.find();
  if (!user) {
    return res.status(404).json({ message: "not found" });
  }
  res.status(200).json(user);
});

router.post("/signup", async (req, res) => {
  const { Name, Email, Password } = req.body;
  const user = await model.findOne({ Email });
  if (!user) {
    const hashedPassword = await bcrypt.hash(Password, 10);

    const newUser = new model({ Name, Email, Password: hashedPassword });

    await newUser.save();

    return res.status(201).json({ message: "user Created" });
  }
  res.status(404).json({ message: "user Already exist" });
});

router.post("/login", async (req, res) => {
  const { Email, Password } = req.body;

  const user = await model.findOne({ Email });

  if (!user) {
    return res.status(404).json({ message: "Incorrect email or password" });
  }

  const passwordValidate = await bcrypt.compare(Password, user.Password);

  if (!passwordValidate) {
    return res.status(404).json({ message: "Incorrect email or password" });
  }

  const token = generateToken(user._id);
  res.json({ user, token });
});

router.post("/resetpassword", async (req, res) => {
  const { Email } = req.body;
  const user = await model.findOne({ Email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const resetToken = jwt.sign({ Id: user._id }, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });

  // Send reset token via email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: user.Email,
    subject: "Password Reset",
    text: `HI ${user.Name},
    There was a request to change your password!
    If you did not make this request, please ignore this email.
    Otherwise, please click this link to change your password: https://main--extraordinary-lollipop-156693.netlify.app/save-new-password/${resetToken}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
      return res.status(500).json({ message: "Error sending email" });
    }
    console.log("Reset token email sent:", info.response);
    res.status(200).json({ message: "Password reset token sent", resetToken });
  });
});

router.post("/savepassword", async (req, res) => {
  const { NewPassword, resetToken } = req.body;
  // Verify reset token
  try {
    const decoded = jwt.verify(resetToken, process.env.SECRET_KEY);

    const userId = decoded.Id;
    const user = await model.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedNewPassword = await bcrypt.hash(NewPassword, 10);
    user.Password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.log("Error verifying reset token:", error);
    res.status(400).json({ message: "Invalid reset token" });
  }
});

module.exports = router;
