// Import package
const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const isAuthenticated = require("../middlewares/isAuthenticated");
const axios = require("axios");

// Import models
const User = require("../models/User");

// route POST /user/signup
router.post("/user/signup", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.fields.email });

    if (user) {
      res.status(409).json({ message: "This email already has an account" });
    } else {
      if (req.fields.email && req.fields.password && req.fields.username) {
        const token = uid2(64);
        const salt = uid2(64);
        const hash = SHA256(req.fields.password + salt).toString(encBase64);

        const newUser = new User({
          email: req.fields.email,
          token: token,
          hash: hash,
          salt: salt,
          account: {
            username: req.fields.username,
          },
        });

        await newUser.save();
        res.status(200).json({
          _id: newUser._id,
          email: newUser.email,
          token: newUser.token,
          account: newUser.account,
        });
      } else {
        console.log(newUser);
        res.status(400).json({ message: "Missing parameters" });
      }
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
});

// route POST /user/login
router.post("/user/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.fields.email });

    if (user) {
      if (
        SHA256(req.fields.password + user.salt).toString(encBase64) ===
        user.hash
      ) {
        res.status(200).json({
          _id: user._id,
          token: user.token,
          account: user.account,
        });
      } else {
        res.status(401).json({ error: "Unauthorized" });
      }
    } else {
      res.status(400).json({ message: "User not found" });
    }
  } catch (error) {
    res.json({ error: error.message });
  }
});

router.put("/user/favorite/character", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findOne({ token: req.fields.token });
    for (let i = 0; i < user.charactersFavorites.length; i++) {
      if (user.charactersFavorites[i]._id === req.fields.favorite._id) {
        return res.status(400).json("Already put in favorites");
      }
    }
    for (let i = 0; i < user.comicsFavorites.length; i++) {
      if (user.comicsFavorites[i]._id === req.fields.favorite._id) {
        return res.status(400).json("Already put in favorites");
      }
    }
    if (req.fields.favorite._id && req.fields.favorite.name) {
      user.charactersFavorites.push(req.fields.favorite);
      // Tell at Mongoose we modified the array : charactersFavorites.
      user.markModified("charactersFavorites");
    } else if (req.fields.favorite.title && req.fields.favorite._id) {
      user.comicsFavorites.push(req.fields.favorite);
      // Tell at Mongoose we modified the array : comicsFavorites.
      user.markModified("comicsFavorites");
    }

    await user.save();
    res.status(200).json("favory added");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
