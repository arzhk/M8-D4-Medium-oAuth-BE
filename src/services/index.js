const router = require("express").Router();

const usersRouter = require("./users");
const loginRouter = require("./login");
const articlesRouter = require("./articles");

router.use("/users", usersRouter);
router.use("/login", loginRouter);
router.use("/articles", articlesRouter);

module.exports = router;
