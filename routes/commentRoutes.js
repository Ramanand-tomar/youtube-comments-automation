const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const filteredcomments = require("../controllers/filteredcomments");
const fetchComments = require("../services/fetchComments");

module.exports = (youtube) => {
  router.get("/", commentController.getAllComments);
  router.get("/replied", commentController.getRepliedComments);
  router.post("/reply", (req, res) => commentController.postManualReply(req, res, youtube));
  router.get("/filtered", filteredcomments.getFilteredComments);
  router.post("/filtered/reply", (req, res) => filteredcomments.postManualReply(req, res, youtube)); 
//   router.get("/fetch", filteredcomments.fetchCommentsFromYoutube(req,res,youtube));   

  return router;
};
