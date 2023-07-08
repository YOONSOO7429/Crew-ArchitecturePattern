const CommentsService = require("../services/comments.service");
const BoatsService = require("../services/boats.service");
const CrewsService = require("../services/crews.service");

class CommentsController {
  commentsService = new CommentsService();
  boatsService = new BoatsService();
  crewsService = new CrewsService();

  // 1. 댓글 생성
  createComment = async (req, res, next) => {
    try {
      // user 정보
      const { userId, nickName } = res.locals.user;
      // params로 boatId
      const { boatId } = req.params;
      // body로 comment
      const { comment } = req.body;
      // boatId를 통해 글 조회
      const boat = await this.boatsService.findOneBoat(boatId);
      // 글이 없을 경우
      if (!boat) {
        return res
          .status(404)
          .json({ errorMessage: "모집 글이 존재하지 않습니다." });
      }

      // captain일 경우 댓글 작성가능
      const captain = boat.captain;
      if (nickName === captain) {
        await this.commentsService.createComment(comment, boatId, userId);
        return res.status(200).json({ message: "댓글 작성 완료" });
      }

      // Crew인지 확인
      const isExistCrew = await this.crewsService.isExistCrew(boatId, userId);
      if (!isExistCrew) {
        return res.status(401).json({
          errorMessage: "모임에 참가하지 않아 댓글 작성 권한이 없습니다.",
        });
      }

      // 작성 내용 확인
      if (comment < 1) {
        return res
          .status(412)
          .json({ errorMessage: "작성한 내용이 없습니다." });
      }

      // boatId에 맞춰서 댓글 작성
      await this.commentsService.createComment(comment, boatId, userId);
      // 댓글 작성 완료
      return res.status(200).json({ message: "댓글 작성 완료." });
    } catch (e) {
      console.error(e.message);
      return res
        .status(400)
        .json({ errorMessage: "댓글 작성 실패. 요청이 올바르지 않습니다." });
    }
  };

  // 2. 댓글 수정
  updateComment = async (req, res, next) => {
    try {
      // user
      const { userId } = res.locals.user;
      // boatId, commentId를 params로
      const { boatId, commentId } = req.params;
      // 수정한 comment
      const { comment } = req.body;

      // 모집 글 조회
      const boat = await this.boatsService.findOneBoat(boatId);
      if (!boat) {
        return res
          .status(404)
          .json({ errorMessage: "crew 모집 글 조회 실패." });
      }

      // comment 글 확인
      const isExistComment = await this.commentsService.findByPkComment(boatId);
      if (!isExistComment) {
        return res
          .status(404)
          .json({ errorMessage: "존재하지 않는 댓글입니다." });
      }

      // comment 수정
      const updateCount = await this.commentsService.updateComment(
        comment,
        commentId,
        boatId,
        userId
      );
      if (updateCount < 1) {
        return res.status(404).json({
          errorMessage: "댓글 수정이 정상적으로 처리되지 않았습니다.",
        });
      }

      // 댓글 수정 완료
      return res.status(200).json({ message: "댓글을 수정하였습니다." });
    } catch (e) {
      console.error(e.message);
      return res
        .status(400)
        .json({ errorMessage: "댓글 수정 실패. 요청이 올바르지 않습니다." });
    }
  };

  deleteComment = async (req, res, next) => {
    try {
      // user 확인
      const { userId } = res.locals.user;
      // boatId, commentId를 params로
      const { boatId, commentId } = req.params;
      // deletedAt를 body로
      const { deletedAt } = req.body;

      // 모집 글 조회
      const boat = await this.boatsService.findOneBoat(boatId);
      if (!boat) {
        return res
          .status(404)
          .json({ errorMessage: "존재하지 않는 모집 글입니다." });
      }

      // comment 글 확인
      const isExistComment = await this.commentsService.findByPkComment(boatId);
      if (!isExistComment) {
        return res
          .status(404)
          .json({ errorMessage: "존재하지 않는 댓글입니다." });
      }

      // comment 권한 확인
      if (userId !== isExistComment.userId) {
        return res
          .status(401)
          .json({ errorMessage: "댓글 수정 권한이 없습니다." });
      }

      // deletedAt 확인
      if (deletedAt === undefined) {
        return res
          .status(412)
          .json({ errorMessage: "삭제 요청이 올바르지 않습니다." });
      } else {
        boat.deleteAt = deletedAt;
      }

      // comment 삭제
      const deleteCount = await this.commentsService.deleteComment(
        deletedAt,
        commentId,
        boatId,
        userId
      );
      if (!deleteCount) {
        return res
          .status(404)
          .json({ errorMessage: "삭제한 댓글이 없습니다." });
      }

      // 댓글 삭제 완료
      return res.status(200).json({ message: "댓글 삭제 완료." });
    } catch (e) {
      console.error(e.message);
      return res
        .status(400)
        .json({ errorMessage: "댓글 삭제 실패. 요청이 올바르지 않습니다." });
    }
  };
}

module.exports = CommentsController;
