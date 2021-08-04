// Import packages
const express = require("express");
const md5 = require("md5");
const axios = require("axios");
const router = express.Router();
require("dotenv").config();

const app = express();

// route GET /comics
// Ex : https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=YOUR_API_KEY
/* Get a list of comics
Query	Info	Required
apiKey	API key received	Yes
limit	between 1 and 100	No
skip	number of results to ignore	No
title	search a comic by title	No */
router.get("/comics", async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.API_URL}/comics?apiKey=${process.env.API_KEY}`
    );
    console.log(response.data.results[0]);
    res.status(200).json(response.data);
  } catch (error) {
    //console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// route GET /comics/:characterId
// Ex : https://lereacteur-marvel-api.herokuapp.com/comics/5fc8ba1fdc33470f788f88b3?apiKey=YOUR_API_KEY
/* Get a list of comics containing a specific character
Params
Params	Info	Required
characterId	characters mongoDB id	Yes

Query
Query	Info	Required
apiKey	API key received	Yes*/
router.get("/comics/:characterId", async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.API_URL}/comics/${req.query.id}?apiKey=${process.env.API_KEY}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    //console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
