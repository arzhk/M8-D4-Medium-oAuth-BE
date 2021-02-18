const express = require("express");
const userSchema = require("./schema");
const jwt = require("jsonwebtoken");
const userRouter = express.Router();

userRouter.get("/", async (req, res, next) => {
  try {
    const users = await userSchema.find();
    res.send(users);
  } catch (err) {
    next(err);
  }
});

userRouter.get("/me", async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    console.log(req.cookies);
    const decoded = await jwt.verify(accessToken, process.env.JWT_SECRET);
    if (decoded) {
      const user = await userSchema.findById(decoded._id);
      res.send(user);
    }
  } catch (err) {
    next(err);
  }
});

userRouter.post("/", async (req, res, next) => {
  try {
    const newUser = new userSchema(req.body);
    await newUser.save();
    res.status(201).send("Successfully registered.");
  } catch (err) {
    next(err);
  }
});

userRouter.put("/me", async (req, res, next) => {
  const updates = Object.keys(req.body);
  updates.forEach((update) => (req.user[update] = req.body[update]));
  await req.user.save();
  res.send("Successfully updated information");
  try {
  } catch (err) {
    next(err);
  }
});

userRouter.delete("/me", async (req, res, next) => {
  try {
    await userSchema.findByIdAndDelete(req.user);
    res.send("Successfully deleted user");
  } catch (err) {
    next(err);
  }
});

module.exports = userRouter;
