const mongoose = require("mongoose");
const express = require("express");
const User = require("../models/Users");
const router = express.Router();
const auth = require("../middleware/auth");
router.post("/create_user", async (req, res) => {
  console.log("inside user handler",req.body);
  const user = new User(req.body);
  console.log(user);
  try {
    const token = await user.getAuthToken();
    req.session.token = token;
    res.status(201).send({ user, token });
    
  } catch (err) {
    res.status(401).send(err);
  }
});

router.post("/login_user", async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.getAuthToken();
    res.status(200).send({ user, token });
    console.log({ user, token });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.post("/user_logout", auth, async function (req, res) {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.status(200).send(req.user);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/user_logout_all", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send(req.user);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.patch("/user/me", auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["username", "email", "password"];
    const isValidUpdate = updates.every((e) => allowedUpdates.includes(e));
    if (!isValidUpdate) {
      throw new Error("Invalid Updates");
    }
    updates.forEach((e) => (req.user[e] = req.body[e]));
    await req.user.save();
    res.status(200).send(req.user);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
