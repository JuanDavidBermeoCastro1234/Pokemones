// imports
import dotenv from "dotenv";
import express from "express";
import pokemonRouter from "./routers/pokemonRouter.js";
import { connect } from "./db/config.js";

//configs
dotenv.config();
// PORT=5500
// DB_URI=mongodb://localhost:27017/
// DB_NAME=pokemonDB

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json()); //Middleware de interpretacion de JSON

// Rutas
app.use("/pokemon", pokemonRouter);

//endpoints
app.get("/api", function (req, res) {
  res.send("Api OK!");
});

connect().then(() => {
  app.listen(port, () => {
    console.log("http://localhost:" + port + "/api");
  });
});
