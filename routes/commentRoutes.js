const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");


module.exports = (youtube) => {
  router.get("/", commentController.getAllComments);
  router.get("/replied", commentController.getRepliedComments);
  router.post("/reply", (req, res) => commentController.postManualReply(req, res, youtube));


  return router;
};
