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

// route POST /user/favorite/character
router.post("/user/favorite/character", isAuthenticated, async (req, res) => {
  try {
    const { characterId, id } = req.fields;
    if (id) {
      //search the user
      const userToUpdate = await User.findById(id);
      // if characterId is new add to favorite
      if (userToUpdate.favorite_characters.length === 0) {
        const response = await axios.get(
          `${process.env.API_URL}/comics/${characterId}`
        );
        userToUpdate.favorite_characters.push({
          thumbnail: response.data.thumbnail,
          _id: characterId,
          name: response.data.name,
          description: response.data.description,
          comics: response.data.comics,
        });
        await userToUpdate.save();
        res.status(200).json({
          _id: userToUpdate._id,
          favorite_characters: userToUpdate.favorite_characters,
          favorite_comics: userToUpdate.favorite_comics,
        });
      } else if (userToUpdate.favorite_characters.length > 0) {
        const response = await axios.get(
          `${process.env.API_URL}/comics/${characterId}`
        );
        const found = userToUpdate.favorite_characters.find(
          (element) => element._id === characterId
        );
        if (found) {
          //if characterId found in user favorite list
          userToUpdate.favorite_characters.map((character, index) => {
            if (character._id === characterId) {
              userToUpdate.favorite_characters.splice(index, 1);
            }
          });
        } else {
          userToUpdate.favorite_characters.push({
            thumbnail: response.data.thumbnail,
            _id: characterId,
            name: response.data.name,
            description: response.data.description,
            comics: response.data.comics,
          });
        }
        await userToUpdate.save();
        res.status(200).json({
          _id: userToUpdate._id,
          favorite_characters: userToUpdate.favorite_characters,
          favorite_comics: userToUpdate.favorite_comics,
        });
      }
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// route GET /user/favorites/comic
router.post("/user/favorite/comic", isAuthenticated, async (req, res) => {
  try {
    const { comicId, id, title, path, extension, description } = req.fields;

    if (id) {
      const userToUpdate = await User.findById(id);
      if (userToUpdate.favorite_comics.length === 0) {
        userToUpdate.favorite_comics.push({
          thumbnail: {
            path: path,
            extension: extension,
          },
          _id: comicId,
          title: title,
          description: description !== "null" ? description : " ",
        });
        await userToUpdate.save();
        res.status(200).json({
          _id: userToUpdate._id,
          favorite_characters: userToUpdate.favorite_characters,
          favorite_comics: userToUpdate.favorite_comics,
        });
      } else if (userToUpdate.favorite_comics.length > 0) {
        const found = userToUpdate.favorite_comics.find(
          (element) => element._id === comicId
        );
        if (found) {
          userToUpdate.favorite_comics.map((comic, index) => {
            if (comic._id === comicId) {
              userToUpdate.favorite_comics.splice(index, 1);
            }
          });
        } else {
          userToUpdate.favorite_comics.push({
            thumbnail: {
              path: path,
              extension: extension,
            },
            _id: comicId,
            title: title,
            description: description !== "null" ? description : " ",
          });
        }
        await userToUpdate.save();
        res.status(200).json({
          _id: userToUpdate._id,
          favorite_characters: userToUpdate.favorite_characters,
          favorite_comics: userToUpdate.favorite_comics,
        });
      }
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// route GET /user/favorites/:_id
router.get("/user/favorites/:_id", async (req, res) => {
  try {
    const user = await User.findById(req.params._id);
    res.status(200).json({
      _id: user._id,
      favorite_characters: user.favorite_characters,
      favorite_comics: user.favorite_comics,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
