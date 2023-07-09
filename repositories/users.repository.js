const { Users, Boats, Crews } = require("../models");

class UsersRepository {
  // user 정보 받기
  findOneUser = async (userId) => {
    try {
      return await Users.findOne({
        where: { userId },
        raw: true,
      });
    } catch (e) {
      console.error(e.message);
      throw new Error("UserRepository / findOneUser");
    }
  };

  // user의 nickName 가져오기
  findOneUserNickName = async (userId) => {
    try {
      return await Users.findOne({
        attributes: ["nickName"],
        where: { userId },
      });
    } catch (e) {
      console.error(e.message);
      throw new Error("UserRepository / findOneUserNickName");
    }
  };

  // 작성한 글 가져오기
  findWritedBoats = async (userId) => {
    try {
      return await Boats.findAll({
        attributes: ["boatId", "captain", "title", "createdAt", "isDone"],
        where: { userId, deletedAt: null },
        order: [["createdAt", "DESC"]],
        raw: true,
      });
    } catch (e) {
      console.error(e.message);
      throw new Error("UserRepository / findWritedBoats");
    }
  };

  // 참여한 boatId 찾기
  findAttenedBoatId = async (userId) => {
    try {
      return await Crews.findAll({
        attributes: ["boatId"],
        where: { userId },
        raw: true,
      });
    } catch (e) {
      console.error(e.message);
      throw new Error("UserRepository / findAttenedBoatId");
    }
  };

  // 참여한 모임 글 조회
  findAttenedBoat = async (boatId) => {
    try {
      return await Boats.findOne({
        attributes: ["boatId", "title", "createdAt", "isDone"],
        where: { boatId, deletedAt: null },
        raw: true,
      });
    } catch (e) {
      console.error(e.message);
      throw new Error("UserRepository / findAttenedBoat");
    }
  };
}

module.exports = UsersRepository;
