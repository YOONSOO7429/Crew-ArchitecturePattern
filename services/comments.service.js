const CommentsRepository = require("../repositories/comments.repository");

class CommentsService {
  // 객체 선언
  commentsRepository = new CommentsRepository();

  // 모임 글에 해당하는 comment 조회
  findAllComment = async (boatId) => {
    try {
      return await this.commentsRepository.findAllComment(boatId);
    } catch (e) {
      console.error(e.message);
      throw new Error("CommentsService / findAllComment");
    }
  };

  // comment 작성
  createComment = async (comment, boatId, userId) => {
    try {
      return await this.commentsRepository.createComment(
        comment,
        boatId,
        userId
      );
    } catch (e) {
      console.error(e.message);
      throw new Error("CommentsService / createComment");
    }
  };

  // Pk로 조회
  findByPkComment = async (commentId) => {
    try {
      return await this.commentsRepository.findByPkComment(commentId);
    } catch (e) {
      console.error(e.message);
      throw new Error("CommentsService / findByPkComment");
    }
  };

  // comment 수정
  updateComment = async (comment, commentId, boatId, userId) => {
    try {
      return await this.commentsRepository.updateComment(
        comment,
        commentId,
        boatId,
        userId
      );
    } catch (e) {
      console.error(e.message);
      throw new Error("CommentsService / updateComment");
    }
  };

  // comment 삭제
  deleteComment = async (deletedAt, commentId, boatId, userId) => {
    try {
      return await this.commentsRepository.deleteComment(
        deletedAt,
        commentId,
        boatId,
        userId
      );
    } catch (e) {
      console.error(e.message);
      throw new Error("CommentsService / deleteComment");
    }
  };
}

module.exports = CommentsService;
