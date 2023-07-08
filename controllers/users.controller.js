const UsersService = require("../services/users.service");

class UsersController {
  usersService = new UsersService();

  // user의 nickName 가져오기
  findMyPage = async (req, res, next) => {
    try {
      // user 정보
      const { userId } = res.locals.user;

      // userId에 맞춰 작성한 글 가져오기
      const writedBoats = await this.usersService.findWritedBoats(userId);

      // 참여한 boatId 찾기
      const attendedBoatsData = await this.usersService.findAttenedBoatId(
        userId
      );

      const attendedBoats = [];

      for (let i = 0; i < attendedBoatsData.length; i++) {
        const boatId = attendedBoatsData[i].boatId;

        const boat = await this.usersService.findAttenedBoat(boatId);
        if (boat) {
          attendedBoats.push(boat);
        }
      }
      return res.status(200).json({
        writedBoats,
        attendedBoats: attendedBoats,
      });
    } catch (e) {
      console.error(e.message);
      return res.status(400).json({
        errorMessage: "Mypage를 불러오지 못했습니다. 요청이 올바르지 않습니다.",
      });
    }
  };
}

module.exports = UsersController;
