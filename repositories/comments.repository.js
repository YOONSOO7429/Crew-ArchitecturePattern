const { sequelize, Comments, Users } = require("../models");

class CommentsRepository {
  // 모임 글에 해당하는 comment 조회
  findAllComment = async (boatId) => {
    try {
      return await Comments.findAll({
        attributes: [
          "commentId",
          "userId",
          [sequelize.col("nickname"), "nickname"],
          "comment",
        ],
        where: { boatId, deletedAt: null },
        include: [
          {
            model: Users,
            attributes: [],
          },
        ],
        raw: true,
      });
    } catch (e) {
      console.error(e.message);
      throw new Error("CommentsRepository / findAllComment");
    }
  };

  // comment 작성
  createComment = async (comment, boatId, userId) => {
    try {
      console.log(comment, boatId, userId);
      return await Comments.create({ comment, boatId, userId });
    } catch (e) {
      console.error(e.message);
      throw new Error("CommentsRepository / createComment");
    }
  };

  // Pk로 조회
  findByPkComment = async (commentId) => {
    try {
      return await Comments.findByPk(commentId);
    } catch (e) {
      console.error(e.message);
      throw new Error("CommentsRepository / findByPkComment");
    }
  };

  // comment 수정
  updateComment = async (comment, commentId, boatId, userId) => {
    try {
      return await Comments.update(
        { comment },
        { where: { commentId, boatId, userId } }
      );
    } catch (e) {
      console.error(e.message);
      throw new Error("CommentsRepository / updateComment");
    }
  };

  // comment 삭제
  deleteComment = async (deletedAt, commentId, boatId, userId) => {
    try {
      return await Comments.update(
        { deletedAt },
        { where: { commentId, boatId, userId } }
      );
    } catch (e) {
      console.error(e.message);
      throw new Error("CommentsRepository / deleteComment");
    }
  };
}

module.exports = CommentsRepository;
