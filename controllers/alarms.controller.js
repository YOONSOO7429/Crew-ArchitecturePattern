const AlarmsService = require("../services/alarms.service");
const BoatsService = require("../services/boats.service");
const UsersService = require("../services/users.service");
const CrewsService = require("../services/crews.service");
const CommentsService = require("../services/comments.service");

class AlarmsController {
  alarmsService = new AlarmsService();
  usersService = new UsersService();
  boatsService = new BoatsService();
  crewsService = new CrewsService();
  commentsService = new CommentsService();

  // 1. 회원에 따라 알림 목록 조회
  findAllAlarm = async (req, res, next) => {
    try {
      // user 정보
      const { userId } = res.locals.user;

      // user 정보에 맞춰 알람 호출 해주기
      const alarms = await this.alarmsService.findAllAlarm(userId);
      // alarms 없을 경우
      if (!alarms) {
        return res
          .status(404)
          .json({ errorMessage: "조회된 알림이 없습니다." });
      }
      return res.status(200).json({ alarms });
    } catch (e) {
      console.error(e.message);
      return res.status(400).json({
        errorMessage: "알람 목록조회 실패. 요청이 올바르지 않습니다.",
      });
    }
  };

  // 2. 참가하기
  joinAlarm = async (req, res, next) => {
    try {
      // user 정보
      const { userId } = res.locals.user;
      const user = await this.usersService.findOneUserNickName(userId);

      // params로 boatId
      const { boatId } = req.params;
      // 글 조회
      const boat = await this.boatsService.findOneBoatDetail(boatId);
      // 글이 존재하지 않을 경우
      if (!boat) {
        return res
          .status(404)
          .json({ errorMessage: "글이 존재하지 않습니다." });
      }
      if (boat.userId === userId) {
        return res
          .status(400)
          .json({ errorMessage: "본인이 작성한 글에는 참가할 수 없습니다." });
      } else {
        // 이미 참가한 사용자인지 확인
        const existingCrew = await this.crewsService.isExistCrew(
          userId,
          boatId
        );
        if (existingCrew) {
          if (existingCrew.isReleased === false) {
            return res
              .status(400)
              .json({ errorMessage: "이미 참가한 글입니다." });
          } else if (existingCrew.isRelease === true) {
            return res
              .status(400)
              .json({ errorMessage: "Captain의 권한으로 참가할 수 없습니다." });
          }
        }
      }

      // maxCrewNum, crewNum 숫자 비교
      if (boat.maxCrewNum > boat.crewNum) {
        await this.crewsService.createCrew({
          userId,
          boatId,
          nickName: user.nickName,
          isReleased: false,
        });
        await this.alarmsService.createAlarm({
          userId: boat.userId,
          isRead: false,
          message: `${user.nickName}님이 모임에 참가했습니다.`,
        });
        return res.status(200).json({ message: "참가 성공." });
      } else {
        return res.status(203).json({ message: "모집이 마감되었습니다." });
      }
    } catch (e) {
      console.error(e.message);
      return res
        .status(400)
        .json({ errorMessage: "참가 요청 실패. 요청이 올바르지 않습니다." });
    }
  };

  // 내보내기
  releaseAlarm = async (req, res, next) => {
    try {
      // user 정보
      const { userId } = res.locals.user;
      // params로 boatId
      const { boatId } = req.params;
      const boat = await this.boatsService.findOneBoat(boatId);

      // body로 내보낼 crew의 nickName 보내기
      const { nickName } = req.body;

      // 글 확인
      if (!boat) {
        return res
          .status(404)
          .json({ errorMessage: "글이 존재하지 않습니다." });
      }
      // 권한이 있는지 확인하기
      if (userId !== boat.userId) {
        return res
          .status(401)
          .json({ errorMessage: "모임 내보내기 권한이 없습니다." });
      }
      // boatId로 crew 조회
      const crew = await this.crewsService.findOneByNickName(boatId, nickName);

      // crew 확인
      if (crew) {
        const updateCount = await this.crewsService.releaseCrew(
          boatId,
          nickName
        );
        if (!updateCount) {
          return res.status(404).json({ errorMessage: "내보내기 실패." });
        } else {
          await this.alarmsService.createAlarm({
            userId: crew.userId,
            isRead: false,
            message: `"${boat.title}" 모임에서 내보내졌습니다.`,
          });
          return res.status(200).json({ message: "내보내기 성공." });
        }
      } else {
        return res
          .status(412)
          .json({ errorMessage: `${nickName}님이 crew가 아닙니다.` });
      }
    } catch (e) {
      console.error(e);
      return res.status(400).json({
        errorMessage: "내보내기 요청 실패. 요청이 올바르지 않습니다.",
      });
    }
  };

  // 3. 나가기
  exitAlarm = async (req, res, next) => {
    try {
      //user 정보
      const { userId } = res.locals.user;
      const user = await this.usersService.findOneUserNickName(userId);
      // params로 boatId
      const { boatId } = req.params;

      // 글 확인
      const boat = await this.boatsService.findOneBoat(boatId);
      if (!boat) {
        return res
          .status(404)
          .json({ errorMessage: "글이 존재하지 않습니다." });
      }

      // Crew인지 확인
      const crew = await this.crewsService.isExistCrew(userId, boatId);
      if (!crew) {
        return res.status(404).json({ errorMessage: "crew가 아닙니다." });
      }

      // Crews table에서 삭제
      const deleteCount = await this.crewsService.exitCrew(userId, boatId);
      if (deleteCount < 1) {
        return res.status(401).json({
          errorMessage: "나가기가 정상적으로 처리되지 않았습니다.",
        });
      }
      // 작성했던 comment deletedAt으로 처리하기
      await this.commentsService.deleteComment(
        { deletedAt: new Date() },
        boatId,
        userId
      );

      // 알람생성
      await Alarms.create({
        userId: boat.userId,
        isRead: false,
        message: `${user.nickName}님이 모임에 나갔습니다.`,
      });
      return res.status(200).json({ message: "나가기 성공." });
    } catch (e) {
      console.error(e);
      return res
        .status(400)
        .json({ errorMessage: "나가기 실패. 요청이 올바르지 않습니다." });
    }
  };
}

module.exports = AlarmsController;
