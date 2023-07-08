const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const authJwt = require("../middlewares/authMiddleware");
const { Users } = require("../models");
const UsersController = require("../controllers/users.controller");
const usersController = new UsersController();

router.get("/mypage", authJwt, usersController.findMyPage);

//로그인
router.post("/login", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Users.findOne({ where: { email } });

    const token = jwt.sign(
      {
        userId: user.userId,
      },
      process.env.JWT_SECRET
    );

    res.cookie("authorization", `Bearer ${token}`);

    return res.status(201).json({ token: token, message: "로그인 성공" });
  } catch (error) {
    console.log("error : ", error);
    return res.json({ errorMessage: "요청이 올바르지 않습니다." } + error);
  }
});

module.exports = router;
