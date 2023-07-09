const AlarmsRepository = require("../repositories/alarms.repository");

class AlarmsService {
  alarmsRepository = new AlarmsRepository();

  // 참가하기
  createAlarm = async (userId, isRead, message) => {
    try {
      return await this.alarmsRepository.createAlarm(userId, isRead, message);
    } catch (e) {
      console.error(e.message);
      throw new Error("AlarmsRepository / createAlarm");
    }
  };

  // 회원에 해당하는 알림 목록 조회
  findAllAlarm = async (userId) => {
    try {
      return await this.alarmsRepository.findAllAlarm(userId);
    } catch (e) {
      console.error(e.message);
      throw new Error("AlarmsService / findAllAlarm");
    }
  };

  // 알람 하나만 조회
  findOneAlarm = async (alarmId, userId) => {
    try {
      return await this.alarmsRepository.findOneAlarm(alarmId, userId);
    } catch (e) {
      console.error(e.message);
      throw new Error("AlarmsService / findOneAlarm");
    }
  };

  // 알람 업데이트
  updateAlarm = async (alarmId, userId) => {
    try {
      return await this.alarmsRepository.updateAlarm();
    } catch (e) {
      console.error(e.message);
      throw new Error("AlarmsService / updateAlarm");
    }
  };
}

module.exports = AlarmsService;
