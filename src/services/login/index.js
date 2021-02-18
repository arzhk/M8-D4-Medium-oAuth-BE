const express = require("express");
const userSchema = require("../users/schema");
const bcrypt = require("bcrypt");
const passport = require("passport");

const loginRouter = express.Router();

loginRouter.post("/", async (req, res, next) => {
  try {
    const user = await userSchema.findOne({ username: req.body.username });
    if (user) {
      const isLoginSuccessful = await bcrypt.compare(req.body.password, user.password);
      if (isLoginSuccessful) {
        const response = {
          isSuccess: true,
          username: user.username,
          userID: user._id,
          httpstatuscode: 200,
          msg: "Success!",
        };
        res.send(response);
      } else {
        const error = new Error();
        error.msg = "Invalid username or password.";
        error.httpStatusCode = 400;
        next(error);
      }
    } else {
      const error = new Error();
      error.msg = "Invalid username or password.";
      error.httpStatusCode = 400;
      next(error);
    }
  } catch (err) {
    next(err);
  }
});

loginRouter.get("/googleLogin", passport.authenticate("google", { scope: ["profile", "email"] }));

loginRouter.get("/googleRedirect", passport.authenticate("google"), async (req, res, next) => {
  try {
    res.cookie("accessToken", req.user.tokens.accessToken, {
      httpOnly: true,
    });
    res.cookie("refreshToken", req.user.tokens.refreshToken, {
      httpOnly: true,
      path: "/users/refreshToken",
    });

    res.status(200).redirect("http://localhost:3000/");
  } catch (error) {
    next(error);
  }
});

module.exports = loginRouter;
