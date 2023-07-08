const express = require("express");
const router = express.Router();
const authJwt = require("../middlewares/authMiddleware");
const loginMiddleware = require("../middlewares/loginMiddleware"); // 로그인한 회원 확인을 위한 middleware
const AlarmsController = require("../controllers/alarms.controller");
const alarmsController = new AlarmsController();
router.get("/alarm", loginMiddleware, alarmsController.findAllAlarm);
router.post("/boat/:boatId/join", authJwt, alarmsController.joinAlarm);
router.post("/boat/:boatId/release", authJwt, alarmsController.releaseAlarm);
router.post("/boat/:boatId/exit", authJwt, alarmsController.exitAlarm);

module.exports = router;
