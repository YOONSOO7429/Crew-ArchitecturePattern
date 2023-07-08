const { Alarms } = require("../models");

class AlarmsRepository {
  // 참가하기
  createAlarm = async (userId, isRead, message) => {
    try {
      return await Alarms.create(userId, isRead, message);
    } catch (e) {
      console.error(e.message);
      throw new Error("AlarmsRepository / createAlarm");
    }
  };
  // 회원에 해당하는 알림 목록 조회
  findAllAlarm = async (userId) => {
    try {
      return await Alarms.findAll({
        attributes: ["alarmId", "isRead", "message"],
        where: { userId, isRead: false },
        raw: true,
      });
    } catch (e) {
      console.error(e.message);
      throw new Error("AlarmsRepository / findAllAlarm");
    }
  };
}

module.exports = AlarmsRepository;
