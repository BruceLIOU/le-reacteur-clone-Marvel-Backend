// Import packages
const express = require("express");
const axios = require("axios");
const router = express.Router();

// route GET /comics/:characterId
// Ex : https://lereacteur-marvel-api.herokuapp.com/comics/5fc8ba1fdc33470f788f88b3?apiKey=YOUR_API_KEY
/* Get a list of comics containing a specific character
Params
Params	Info	Required
characterId	characters mongoDB id	Yes

Query
Query	Info	Required
apiKey	API key received	Yes*/
router.get("/comics/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.API_URL}/comics/${req.params.id}?apiKey=${process.env.API_KEY}`
    );
    console.log(response.data);
    res.status(200).json(response.data);
  } catch (error) {
    //console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

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
      `${process.env.API_URL}/comics?apiKey=${process.env.API_KEY}&skip=${req.query.skip}&limit=${req.query.limit}&title=${req.query.title}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.log(error.response);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
