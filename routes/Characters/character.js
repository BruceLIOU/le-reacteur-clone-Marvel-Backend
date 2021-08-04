// Import packages
const express = require("express");
const md5 = require("md5");
const axios = require("axios");
const router = express.Router();

const app = express();

// route GET /characters
// Ex : https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=YOUR_API_KEY
/* Get a list of characters
Query	Info	Required
apiKey	API key received	Yes
limit	between 1 and 100	No
skip	number of results to ignore	No
name	search a character by name	No */
router.get("/characters", async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.API_URL}/characters?apiKey=${process.env.API_KEY}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    //console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
