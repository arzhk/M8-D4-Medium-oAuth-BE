const express = require("express");
const fs = require("fs");
const articlesSchema = require("./schema");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const articles = await articlesSchema.find();
    res.send(articles);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const article = await articlesSchema.findById(req.params.id);
    if (article) {
      res.send(article);
    } else {
      const error = new Error();
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    console.log(req.body);
    const newArticle = new articlesSchema(req.body);
    const { _id } = await newArticle.save();
    res.status(201).send(_id);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const article = await articlesSchema.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true });
    if (article) {
      res.send(article);
    } else {
      const error = new Error(`User with that ID not found (${req.params.id})`);
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const article = await articlesSchema.findByIdAndDelete(req.params.id);
    if (article) {
      res.send("Article successfully deleted");
    } else {
      const error = new Error(`User with that ID not found (${req.params.id})`);
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.post("/:articleID", async (req, res, next) => {
  try {
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
