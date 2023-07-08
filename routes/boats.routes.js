const express = require("express");
const authJwt = require("../middlewares/authMiddleware"); // Crew 회원 확인을 위한 middleware
const loginMiddleware = require("../middlewares/loginMiddleware"); // 로그인한 회원 확인을 위한 middleware
const router = express.Router();
const BoatsController = require("../controllers/boats.controller");
const boatsController = new BoatsController();

router.post("/boat/write", authJwt, boatsController.createBoat);
router.get("/boat/map", boatsController.getBoats);
router.get("/boat/:boatId", loginMiddleware, boatsController.getBoatDetail);
router.put("/boat/:boatId", authJwt, boatsController.updateBoat);
router.patch("/boat/:boatId/isDone", authJwt, boatsController.isDoneUpdate);
router.patch("/boat/:boatId/delete", authJwt, boatsController.deleteBoat);

module.exports = router;
