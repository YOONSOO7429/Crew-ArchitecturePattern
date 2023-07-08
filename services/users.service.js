const UsersRepository = require("../repositories/users.repository");

class UsersService {
  usersRepository = new UsersRepository();

  // user의 nickName 가져오기
  findOneUserNickName = async (userId) => {
    try {
      return await this.usersRepository.findOneUserNickName(userId);
    } catch (e) {
      console.error(e.message);
      throw new Error("UsersService / findOneUserNickName");
    }
  };

  // 작성한 글 가져오기
  findWritedBoats = async (userId) => {
    try {
      return await this.usersRepository.findWritedBoats(userId);
    } catch (e) {
      console.error(e.message);
      throw new Error("UsersService / findWritedBoats");
    }
  };

  // 참여한 boatId 찾기
  findAttenedBoatId = async (userId) => {
    try {
      return await this.usersRepository.findAttenedBoatId(userId);
    } catch (e) {
      console.error(e.message);
      throw new Error("UsersService / findAttenedBoatId");
    }
  };

  // 참여한 모임 글 조회
  findAttenedBoat = async (boatId) => {
    try {
      return await this.usersRepository.findAttenedBoat(boatId);
    } catch (e) {
      console.error(e.message);
      throw new Error("UsersService / findAttenedBoat");
    }
  };
}

module.exports = UsersService;
