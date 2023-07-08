const CrewsRepository = require("../repositories/crews.repository");

class CrewsService {
  crewsRepository = new CrewsRepository();

  // 참가하기
  createCrew = async (userId, boatId, nickName, isReleased) => {
    try {
      return await this.crewsRepository.createCrew(
        userId,
        boatId,
        nickName,
        isReleased
      );
    } catch (e) {
      console.error(e.message);
      throw new Error("CrewsService / createCrew");
    }
  };

  // 내보내기
  releaseCrew = async (boatId, nickName) => {
    try {
      return await this.crewsRepository.releaseCrew(boatId, nickName);
    } catch (e) {
      console.error(e.message);
      throw new Error("CrewsService / releaseCrew");
    }
  };

  // 나가기
  exitCrew = async (boatId, userId) => {
    try {
      return await this.crewsRepository.exitCrew(boatId, userId);
    } catch (e) {
      console.error(e.message);
      throw new Error("CrewsRepository / exitCrew");
    }
  };

  // crewMember 조회
  findAllCrew = async (boatId) => {
    try {
      return await this.crewsRepository.findAllCrew(boatId);
    } catch (e) {
      console.error(e.message);
      throw new Error("CrewsService / findAllCrew");
    }
  };

  // Crew인지 확인
  isExistCrew = async (boatId, userId) => {
    try {
      return await this.crewsRepository.isExistCrew(boatId, userId);
    } catch (e) {
      console.error(e.message);
      throw new Error("CrewsService / isExistCrew");
    }
  };

  // nickName으로 Crew 확인
  findOneByNickName = async (boatId, nickName) => {
    try {
      return await this.crewsRepository.findOneByNickName(boatId, nickName);
    } catch (e) {
      console.error(e.message);
      throw new Error("CrewsService / findOneByNickName");
    }
  };
}

module.exports = CrewsService;
