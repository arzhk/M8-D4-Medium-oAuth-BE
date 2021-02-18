const jwt = require("jsonwebtoken");
const UserModel = require("../users/schema");

const authorize = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = await verifyJWT(token);
    const user = await UserModel.findOne({
      _id: decoded._id,
    });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    const err = new Error("Please authenticate");
    err.httpStatusCode = 401;
    next(err);
  }
};

const authenticate = async (user) => {
  try {
    const newAccessToken = await generateJWT({ _id: user._id });
    const newRefreshToken = await generateRefreshJWT({ _id: user._id });

    user.refreshTokens = user.refreshTokens.concat({ token: newRefreshToken });
    await user.save();

    return { token: newAccessToken, refreshToken: newRefreshToken };
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const generateJWT = (payload) =>
  new Promise((res, rej) =>
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 6 }, (err, token) => {
      if (err) rej(err);
      res(token);
    })
  );

const verifyJWT = (token) =>
  new Promise((res, rej) =>
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) rej(err);
      res(decoded);
    })
  );

module.exports = {
  authorize,
  generateJWT,
  verifyJWT,
};
