const BoatsService = require("../services/boats.service");
const CommentsService = require("../services/comments.service");
const CrewsService = require("../services/crews.service");
const UsersService = require("../services/users.service");

class BoatsController {
  boatsService = new BoatsService();
  usersService = new UsersService();
  crewsService = new CrewsService();
  commentsService = new CommentsService();

  // 1. 모임 생성
  createBoat = async (req, res, next) => {
    try {
      // user 정보
      const { userId, email } = res.locals.user;
      // 첫 공개 여부는 공개로 올린다.
      const isDone = false;
      const {
        title,
        content,
        keyword,
        maxCrewNum,
        endDate,
        address,
        latitude,
        longitude,
      } = req.body;

      // user의 nickName 가져오기
      const captain = await this.usersService.findOneUserNickName(userId);

      // 작성 내용 확인
      if (title < 1) {
        return res
          .status(412)
          .json({ errorMessage: "title에 작성된 내용이 없습니다." });
      }
      if (content < 1) {
        return res
          .status(412)
          .json({ errorMessage: "content에 작성된 내용이 없습니다." });
      }
      if (keyword < 1) {
        return res
          .status(412)
          .json({ errorMessage: "keyword에 작성된 내용이 없습니다." });
      }
      if (endDate === undefined) {
        return res
          .status(412)
          .json({ errorMessage: "마감 일자 형식이 맞지 않습니다." });
      }
      if (address < 1) {
        return res
          .status(412)
          .json({ errorMessage: "address가 작성된 내용이 없습니다." });
      }
      if (latitude === null) {
        return res
          .status(412)
          .json({ errorMessage: "address가 작성된 내용이 없습니다." });
      }
      if (longitude === null) {
        return res
          .status(412)
          .json({ errorMessage: "address가 작성된 내용이 없습니다." });
      }

      // 서비스 계층에 구현된 createPost 로직을 실행합니다.
      this.boatsService.createBoat({
        userId,
        email,
        captain: captain.nickName,
        title,
        content,
        keyword,
        endDate,
        address,
        maxCrewNum,
        isDone,
        latitude,
        longitude,
      });

      return res.status(200).json({ message: "Crew 모집 글 작성에 성공" });
    } catch (e) {
      console.error(e.message);
      return res.status(400).json({
        errorMessage: "Crew 모집 글 작성 실패. 요청이 올바르지 않습니다.",
      });
    }
  };

  // 2. 모임 전체 조회
  getBoats = async (req, res, next) => {
    try {
      const boats = await this.boatsService.findAllBoat();
      // 작성된 모집 글이 없을 경우
      if (boats.length === 0) {
        return res
          .status(400)
          .json({ errorMessage: "작성된 모집 글이 없습니다." });
      }
      return res.status(200).json({ boats });
    } catch (e) {
      console.error(e.message);
      return res.status(400).json({
        errorMessage: "전체 모임 조회에 실패. 요청이 올바르지 않습니다.",
      });
    }
  };

  // 3. 모임 상세 조회
  getBoatDetail = async (req, res, next) => {
    try {
      const { boatId } = req.params;
      // userId 확인
      const userId = res.locals.user ? res.locals.user.userId : null;
      // crewMemeber 조회
      const crew = await this.crewsService.findAllCrew(boatId);

      // 모임 글 조회
      const boat = await this.boatsService.findOneBoatDetail(boatId);
      // 글이 없을 경우
      if (!boat) {
        return res
          .status(404)
          .json({ errorMessage: "글이 존재하지 않습니다." });
      }

      // 모임 글에 해당하는 comment 조회
      const comments = await this.commentsService.findAllComment(boatId);

      // captain를 check해서 조회
      if (!userId) {
        return res.status(200).json({ boat, personType: "person" });
      }
      if (userId === boat.captainId) {
        // captain
        return res
          .status(200)
          .json({ boat, crew, comments, personType: "captain" });
      }

      // crewMember일 경우
      let isCrew = false;
      for (let i = 0; i < crew.length; i++) {
        if (userId === crew[i].userId) {
          // crew일 경우
          isCrew = true;
          break;
        }
      }
      if (isCrew) {
        return res
          .status(200)
          .json({ boat, crew, comments, personType: "crew" });
      }
      return res.status(200).json({ boat, personType: "person" });
    } catch (e) {
      console.error(e.message);
      return res.status(400).json({
        errorMessage: "모집 글 상세 조회에 실패. 요청이 올바르지 않습니다.",
      });
    }
  };

  // 4. 모임 글 수정
  updateBoat = async (req, res, next) => {
    try {
      // params로 boatId
      const { boatId } = req.params;
      // user 정보
      const { userId } = res.locals.user;

      // boat 조회
      const boat = await this.boatsService.findOneBoat(boatId);

      // body로 입력받기
      const {
        title,
        content,
        keyword,
        endDate,
        maxCrewNum,
        address,
        latitude,
        longitude,
      } = req.body;

      // 모집 글이 없을 경우
      if (!boat) {
        return res
          .status(400)
          .json({ errorMessage: "존재하지 않는 배입니다." });
      }
      // 권한이 없을 경우
      if (userId !== boat.userId) {
        return res
          .status(403)
          .json({ errorMessage: "글 수정 권한이 없습니다." });
      }

      // 수정 검사
      if (title < 1) {
        return res
          .status(412)
          .json({ errorMessage: "유효하지 않은 title입니다." });
      }
      if (content < 1) {
        return res
          .status(412)
          .json({ errorMessage: "유효하지 않은 content입니다." });
      }
      if (keyword < 1) {
        return res
          .status(412)
          .json({ errorMessage: "유효하지 않은 keyword입니다." });
      }
      if (endDate < 1) {
        return res
          .status(412)
          .json({ errorMessage: "유효하지 않은 endDate입니다." });
      }
      if (address < 1) {
        return res
          .status(412)
          .json({ errorMessage: "유효하지 않은 address입니다." });
      }
      if (maxCrewNum < 1) {
        return res
          .status(412)
          .json({ errorMessage: "유효하지 않은 maxCrewNum입니다." });
      }
      if (latitude < 1) {
        return res
          .status(412)
          .json({ errorMessage: "유효하지 않은 latitude입니다." });
      }
      if (longitude < 1) {
        return res
          .status(412)
          .json({ errorMessage: "유효하지 않은 longitude입니다." });
      }

      // 수정할 내용에 따라 수정
      if (title) {
        boat.title = title;
      }
      if (content) {
        boat.content = content;
      }
      if (keyword) {
        boat.keyword = keyword;
      }
      if (endDate) {
        boat.endDate = endDate;
      }
      if (address) {
        boat.address = address;
      }
      if (maxCrewNum) {
        boat.maxCrewNum = maxCrewNum;
      }
      if (latitude) {
        boat.latitude = latitude;
      }
      if (longitude) {
        boat.longitude = longitude;
      }

      // 수정할 부분이 모두 없을 경우 / 수정할 내용이 있다면 해당 부분만 수정
      if (
        !(
          title ||
          content ||
          keyword ||
          endDate ||
          maxCrewNum ||
          address ||
          latitude ||
          longitude
        )
      ) {
        return res
          .status(412)
          .json({ errorMessage: "수정할 내용이 없습니다." });
      }

      const updateCount = await this.boatsService.updateBoat(boat);
      // 수정한 글이 없을 경우
      if (updateCount < 1) {
        return res.status(404).json({
          errorMessage: "모집 글이 정상적으로 수정되지 않았습니다.",
        });
      }

      // 수정 완료
      return res.status(200).json({ message: "모집 글을 수정 완료." });
    } catch (e) {
      console.error(e.message);
      return res
        .status(400)
        .json({ errorMessage: "모집 글 수정 실패. 요청이 올바르지 않습니다." });
    }
  };

  isDoneUpdate = async (req, res, next) => {
    try {
      // user
      const { userId } = res.locals.user;
      // params로 boatId
      const { boatId } = req.params;
      // body로 isDone 입력받기
      const { isDone } = req.body;

      // 모집 글 조회
      const boat = await this.boatsService.findOneBoat(boatId);
      // 모집 글이 없을 경우
      if (!boat) {
        return res
          .status(403)
          .json({ errorMessage: "존재하지 않는 모집 글입니다." });
      }
      // 권한이 없을 경우
      if (userId !== boat.userId) {
        return res
          .status(401)
          .json({ errorMessage: "모집 글 상태 전환 권한이 없습니다." });
      }

      // 유효성 검사
      if (isDone === 3) {
        return res
          .status(412)
          .json({ errorMessage: "올바르지 않은 상태 전환 요청입니다." });
      } else {
        boat.isDone = isDone;
      }

      const updateIsDoneCount = await this.boatsService.updateBoat(boat);
      // 수정한 모집 글이 없을 경우
      if (!updateIsDoneCount) {
        return res
          .status(404)
          .json({ errorMessage: "모집 글을 전환하지 못했습니다." });
      }

      // 전환 완료
      return res.status(200).json({ message: "모집 글 상태를 전환 완료." });
    } catch (e) {
      console.error(e.message);
      return res.status(400).json({
        errorMessage: "상태 업데이트 실패. 요청이 올바르지 않습니다.",
      });
    }
  };

  // 6. 모집 글 삭제
  deleteBoat = async (req, res, next) => {
    try {
      // user
      const { userId } = res.locals.user;
      // params로 boatId
      const { boatId } = req.params;
      // body로 deletedAt
      const { deletedAt } = req.body;

      // 모집 글 조회
      const boat = await this.boatsService.findByPkBoat(boatId);

      // 모집 글이 없을 경우
      if (!boat) {
        return res
          .status(404)
          .json({ errorMessage: "존재하지 않는 글입니다. 삭제 실패." });
      }

      // 모집 글 삭제 권한 확인
      if (userId !== boat.userId) {
        return res
          .status(401)
          .json({ errorMessage: "모집 글 삭제 권한이 없습니다." });
      }

      // 모집 글 삭제
      if (deletedAt === undefined) {
        return res
          .status(412)
          .json({ errorMessage: "삭제 요청이 올바르지 않습니다." });
      } else {
        boat.deletedAt = deletedAt;
      }

      const deletedAtCount = await this.boatsService.updateBoat(boat);
      // softDelete 안됐을 경우
      if (!deletedAtCount) {
        return res.status(404).json({ errorMessage: "삭제된 글이 없습니다." });
      }

      // 삭제 완료
      return res.status(200).json({ message: "모집 글을 삭제 완료." });
    } catch (e) {
      console.error(e.message);
      return res.status(400).json({
        errorMessage: "모집 글 삭제 실패. 요청이 올바르지 않습니다.",
      });
    }
  };
}

module.exports = BoatsController;
