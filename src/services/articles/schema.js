const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const articleSchema = new Schema(
  {
    headLine: String,
    content: String,
    category: {
      img: String,
      name: String,
    },
    author: {
      name: String,
      img: String,
    },
    cover: String,
    responses: [String],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Article", articleSchema);
