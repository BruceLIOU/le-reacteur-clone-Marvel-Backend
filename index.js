const express = require("express");
const formidable = require("express-formidable");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(formidable({ multiples: true }));
app.use(cors());

// Connection DB
mongoose
  .connect(process.env.MANGODB_URI_DEV, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// Immport routes
const charactersRoutes = require("./routes/character");
const comicsRoutes = require("./routes/comics");
app.use(charactersRoutes);
app.use(comicsRoutes);

app.get("/", (req, res) => {
  res.status(201).json("Bienvenue sur le clone de MARVEL");
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "Page not found !" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
