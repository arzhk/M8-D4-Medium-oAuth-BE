const jwt = require("jsonwebtoken");

const authenticate = async (user) => {
  try {
    // create tokens
    const accessToken = await generateAccessToken({ _id: user._id });
    const refreshToken = await generateRefreshToken({ _id: user._id });

    // save new refresh token in db

    user.refreshTokens = user.refreshTokens.concat({ token: refreshToken });
    await user.save();

    // return them
    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const generateAccessToken = (payload) =>
  new Promise((res, rej) =>
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" }, (err, token) => {
      if (err) rej(err);
      res(token);
    })
  );

const verifyAccessToken = (token) =>
  new Promise((res, rej) =>
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) rej(err);
      res(decoded);
    })
  );

const generateRefreshToken = (payload) =>
  new Promise((res, rej) =>
    jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1 week" }, (err, token) => {
      if (err) rej(err);
      res(token);
    })
  );

const verifyRefreshToken = (token) =>
  new Promise((res, rej) =>
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) rej(err);
      res(decoded);
    })
  );

module.exports = { authenticate };
