const { Crews, sequelize } = require("../models");

class CrewsRepository {
  // 참가하기
  createCrew = async (userId, boatId, nickName, isReleased) => {
    try {
      return await Crews.create(userId, boatId, nickName, isReleased);
    } catch (e) {
      console.error(e.message);
      throw new Error("CrewsRepository / createCrew");
    }
  };

  // 내보내기
  releaseCrew = async (boatId, userId) => {
    try {
      return await Crews.update(
        { isReleased: true },
        { where: { boatId, userId } }
      );
    } catch (e) {
      console.error(e.message);
      throw new Error("CrewsRepository / releaseCrew");
    }
  };

  // 나가기
  exitCrew = async (boatId, userId) => {
    try {
      return await Crews.destroy({ where: { boatId, userId } });
    } catch (e) {
      console.error(e.message);
      throw new Error("CrewsRepository / exitCrew");
    }
  };

  // crewMember 조회
  findAllCrew = async (boatId) => {
    try {
      return await Crews.findAll({
        attributes: ["userId", "nickName"],
        where: { boatId, isReleased: false },
        raw: true,
      });
    } catch (e) {
      console.error(e.message);
      throw new Error("CrewsRepository / findAllCrew");
    }
  };

  // Crew인지 확인
  isExistCrew = async (boatId, userId) => {
    try {
      return await Crews.findOne({
        where: { boatId, userId, isReleased: false },
      });
    } catch (e) {
      console.error(e.message);
      throw new Error("CrewsRepository / isExistCrew");
    }
  };

  // 방출된 Crew인지 확인
  isReleasedCrew = async (boatId, userId) => {
    try {
      return await Crews.findOne({
        where: { boatId, userId, isReleased: true },
      });
    } catch (e) {
      console.error(e.message);
      throw new Error("CrewsRepository / isReleasedCrew");
    }
  };

  // nickName으로 Crew 확인
  findOneByNickName = async (boatId, userId) => {
    try {
      return await Crews.findOne({
        attributes: ["userId"],
        where: { boatId, userId },
        raw: true,
      });
    } catch (e) {
      console.error(e.message);
      throw new Error("CrewsRepository / findOneByNickName");
    }
  };

  destroyCrews = async (boatId) => {
    try {
      return await Crews.destroy({ where: { boatId } });
    } catch (e) {
      console.error(e.message);
      throw new Error("CrewsRepository / destroyCrews");
    }
  };
}

module.exports = CrewsRepository;
