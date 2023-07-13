const BoatsRepository = require("../repositories/boats.repository");

class BoatsService {
  // 객체 선언
  boatsRepository = new BoatsRepository();

  // 모임글 생성
  createBoat = async (
    userId,
    email,
    captain,
    title,
    content,
    keyword,
    endDate,
    address,
    maxCrewNum,
    isDone,
    latitude,
    longitude
  ) => {
    try {
      return await this.boatsRepository.createBoat(
        userId,
        email,
        captain,
        title,
        content,
        keyword,
        endDate,
        address,
        maxCrewNum,
        isDone,
        latitude,
        longitude
      );
    } catch (e) {
      console.error(e.message);
      throw new Error("BoatsService / createBoat");
    }
  };

  // 전체 모임글 조회
  findAllBoat = async (swLatitude, swLongitude, neLatitude, neLongitude) => {
    try {
      return await this.boatsRepository.findAllBoat(
        swLatitude,
        swLongitude,
        neLatitude,
        neLongitude
      );
    } catch (e) {
      console.error(e.message);
      throw new Error("BoatsService / findAllBoat");
    }
  };

  // 모임글 상세 조회
  findOneBoatDetail = async (boatId) => {
    try {
      return await this.boatsRepository.findOneBoatDetail(boatId);
    } catch (e) {
      console.error(e.message);
      throw new Error("BoatsService / findOneBoat");
    }
  };

  // 모임 글 수정에서 상세 조회
  findOneBoat = async (boatId) => {
    try {
      return await this.boatsRepository.findOneBoat(boatId);
    } catch (e) {
      console.error(e.message);
      throw new Error("BoatsService / findOneBoatUpdate");
    }
  };

  // 모임 글 수정, 삭제, isDone
  updateBoat = async (boat) => {
    try {
      return await this.boatsRepository.updateBoat(boat);
    } catch (e) {
      console.error(e.message);
      throw new Error("BoatsService / updateBoat");
    }
  };

  // Pk로 조회
  findByPkBoat = async (boatId) => {
    try {
      return await this.boatsRepository.findByPkBoat(boatId);
    } catch (e) {
      console.error(e.message);
      throw new Error("BoatsService / findByPkBoat");
    }
  };
}

module.exports = BoatsService;
