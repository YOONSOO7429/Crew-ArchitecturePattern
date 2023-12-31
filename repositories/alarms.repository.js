const { Alarms } = require("../models");

class AlarmsRepository {
  // 알림 만들기
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

  // 알람 하나만 조회
  findOneAlarm = async (alarmId, userId) => {
    try {
      return await Alarms.findOne({
        where: { alarmId, userId },
      });
    } catch (e) {
      console.error(e.message);
      throw new Error("AlarmsRepository / findOneAlarm");
    }
  };

  // 알람 업데이트
  updateAlarm = async (alarmId, userId) => {
    try {
      return await Alarms.update(
        { isRead: true },
        { where: { alarmId, userId } }
      );
    } catch (e) {
      console.error(e.message);
      throw new Error("AlarmsRepository / updateAlarm");
    }
  };
}

module.exports = AlarmsRepository;
