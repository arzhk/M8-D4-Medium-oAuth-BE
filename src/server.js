const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const services = require("./services");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const oauth = require("./services/login/oauth");
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);

const { errorProcessor } = require("./errorHandling");

const server = express();

const port = process.env.PORT || 3001;

const loggerMiddleware = (req, res, next) => {
  console.log(`Logged ${req.url} ${req.method} -- ${new Date()}`);
  next();
};

const whitelist = ["http://localhost:3000", "http://strive-medium-clone-be.azurewebsites.net/"];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
server.use(cors(corsOptions));
server.use(express.json());
server.use(cookieParser());
server.use(loggerMiddleware);
server.use(passport.initialize());

server.use("/api", services);

server.use(errorProcessor);

mongoose
  .connect(process.env.MONGO_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    server.listen(port, () => {
      console.log("Server is running on port: ", port);
    })
  );
