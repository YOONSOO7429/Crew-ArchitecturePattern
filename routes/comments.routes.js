const express = require("express");
const router = express.Router();
const authJwt = require("../middlewares/authMiddleware");
const CommentsController = require("../controllers/comments.controller");
const commentsController = new CommentsController();

router.post("/boat/:boatId/comment", authJwt, commentsController.createComment);
router.put(
  "/boat/:boatId/comment/:commentId",
  authJwt,
  commentsController.updateComment
);
router.patch(
  "/boat/:boatId/comment/:commentId",
  authJwt,
  commentsController.deleteComment
);

module.exports = router;
