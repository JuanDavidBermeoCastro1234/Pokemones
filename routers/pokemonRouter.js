// imports
import { Router } from "express";
import { getDB } from "../db/config.js";

const router = Router();

router.get("/getall", async function (req, res) {
  try {
    const pokemones = await getDB().collection("pokemones").find().toArray();
    res.status(200).json(pokemones);
  } catch (error) {
    res.error(500).json({ error: "Internal server error" });
  }
});

router.get("/get/:id", async function (req, res) {
  try {
    const idPokemon = parseInt(req.params.id);
    const pokemon = await getDB()
      .collection("pokemones")
      .findOne({ id: idPokemon });
    if (!pokemon) {
      res.status(404).json({ error: "Pokemon doesn't exists!" });
    }
    res.status(200).json(pokemon);
  } catch (er) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/create", async function (req, res) {
  try {
    const { id, nombre, habilidad, debilitado } = req.body;
    if (!id || !nombre || !habilidad || debilitado === undefined) {
      res.status(400).json({ error: "Invalid input!" });
    }
    const pokemon = {
      id,
      nombre,
      habilidad,
      debilitado,
    };
    await getDB().collection("pokemones").insertOne(pokemon);
    res.status(201).json({ message: "Pokemon created!!" });
  } catch (error) {
    res.error(500).json({ error: "Internal server error" });
  }
});

router.put("/put/:id", async function (req,res) {
  const idPokemon= parseInt(req.params.id);
  try {
    if (!idPokemon) {
      res.status(400).json({error:"id no valido"})
    }
    const pokemon = await getDB().collection.findOne({id:idPokemon})
    if (!pokemon) {
      return res.status(404).json({error:"pokemon no encontrado"});
    }
    

    const {nombre,habilidad,debilitado}= req.body;

    if (!nombre||!habilidad||debilitado===undefined) {
      res.status(400).json({error: "invalid input"});
    } 

    await getDB().collection.updateOne(
      {id:idPokemon},
    {$set: {nombre,habilidad,debilitado}}
    )

    res.status(200).json({message:"pokemon actualizado correctamente"})
  } catch (error) {
    console.log(error);
    res.status(500).json({error:"error en el servidor "})
  }
})

export default router;


