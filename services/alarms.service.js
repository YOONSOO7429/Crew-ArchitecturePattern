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

  // 내보내기
  releaseAlarm = async (userId, isRead, message) => {
    try {
      return await this.alarmsRepository.releaseAlarm(userId, isRead, message);
    } catch (e) {
      console.error(e.message);
      throw new Error("AlarmsRepository / releaseAlarm");
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
}

module.exports = AlarmsService;
