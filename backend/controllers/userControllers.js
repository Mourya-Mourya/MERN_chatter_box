/* 
Here we will write logics
and to contol any error in controller we have something called async handler 
so install npm i express-async-handler
*/

const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  // it takes few things from request body.
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Feilds");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create user");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

// /api/user?serach=mourya
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        //The $or operator performs a logical or operation on an array of 2 or more expressions.
        $or: [
          // regex help for pattern matching strings in queires
          { name: { $regex: req.query.search, $options: "i" } }, // i means case sensitive
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  // here we need to provide token for _id or else it won't work. so for that logic we wrote in authMiddleware
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } }); // ne not equal to.. retrives users expect user logined
  res.send(users);
});

module.exports = { registerUser, authUser, allUsers };
