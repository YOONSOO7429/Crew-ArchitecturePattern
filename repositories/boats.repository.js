const { Boats, sequelize, Crews } = require("../models");

class BoatsRepository {
  //

  // 모임 생성
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
      return await Boats.create(
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
      throw new Error("BoatsRepository / createBoat");
    }
  };

  // 전체 모임 조회
  findAllBoat = async () => {
    try {
      return await Boats.findAll({
        attributes: [
          "boatId",
          "title",
          "keyword",
          "endDate",
          "maxCrewNum",
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM Crews WHERE Boats.boatId = Crews.boatId AND Crews.isReleased = false) + 1`
            ),
            "crewNum",
          ],
          "address",
          "latitude",
          "longitude",
        ],
        where: { isDone: false, deletedAt: null },
        group: ["Boats.boatId"],
        raw: true,
      });
    } catch (e) {
      console.error(e.message);
      throw new Error("BoatsRepository / findAllBoat");
    }
  };

  // 모임 상세 조회
  findOneBoatDetail = async (boatId) => {
    try {
      return await Boats.findOne({
        attributes: [
          "boatId",
          ["userId", "captainId"],
          "captain",
          "title",
          "content",
          "maxCrewNum",
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM Crews WHERE Boats.boatId = Crews.boatId AND Crews.isReleased = false) + 1`
            ),
            "crewNum",
          ],
          "endDate",
          "address",
          "createdAt",
        ],
        where: { boatId, isDone: false, deletedAt: null },
        include: [
          {
            model: Crews,
            attributes: [],
          },
        ],
        group: ["Boats.boatId"],
        raw: true,
      });
    } catch (e) {
      console.error(e.message);
      throw new Error("BoatsRepository / findOneBoatDetail");
    }
  };

  // 모임 글 수정에서 상세 조회
  findOneBoat = async (boatId) => {
    try {
      return await Boats.findOne({ where: { boatId } });
    } catch (e) {
      console.error(e.message);
      throw new Error("BoatsRepository / findOneBoat");
    }
  };

  // 모임 글 수정, 삭제, isDone
  updateBoat = async (boat) => {
    try {
      return await boat.save();
    } catch (e) {
      console.error(e.message);
      throw new Error("BoatsRepository / updateBoat");
    }
  };

  // Pk로 조회
  findByPkBoat = async (boatId) => {
    try {
      return await Boats.findByPk(boatId);
    } catch (e) {
      console.error(e.message);
      throw new Error("BoatsRepository / findByPkBoat");
    }
  };
}

module.exports = BoatsRepository;
