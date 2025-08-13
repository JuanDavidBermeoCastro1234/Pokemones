// imports
import { Router } from "express";
import { getDB } from "../db/config.js";
import { parse } from "dotenv";

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
  try {
    const idPokemon= parseInt(req.params.id,10);
    const collection = getDB().collection("pokemones");
    const pokemon = await collection.findOne({id:idPokemon})
    if (!pokemon) {
      return res.status(404).json({error:"pokemon no encontrado"});
    }
    const {nombre,habilidad,debilitado}= req.body;
    if (!nombre||!habilidad||debilitado===undefined) {
     return res.status(400).json({error: "invalid input"});
    } 

    const result = await collection.updateOne(
      {id:idPokemon},
      {$set:{nombre,habilidad,debilitado}}
    );

   return res.status(200).json({message:"pokemon actualizado correctamente"})
  } catch (error) {
    console.log(error);
    return res.status(500).json({error:"error en el servidor "})
  }
})

router.patch("/patch/:id", async function (req,res) {
  try {
    const idPokemon = parseInt(req.params.id,10);
    const collection = getDB().collection("pokemones");

    const  {nombre,habilidad,debilitado}= req.body;
    const update = {}
    if (nombre !== undefined) update.nombre=nombre;
    if (habilidad !== undefined) update.habilidad=nombre;
    if (debilitado !== undefined) update.debilitado=nombre;
    if (Object.keys(update).length===0) {
      return res.status(400).json({error:"no hay campos para actualizar"})
    }
    const result = await collection.updateOne(
      {id:idPokemon},
      {$set:update}
    );
    if (result.matchedCount===0) {
      return res.status(400).json({error:"pokemon no encontrado"})
    }
    
    return res.status(200).json({message:"todo bien pa"})
  } catch (error) {
    return res.status(500).json({error:"pailas pana error en la conexion"})
  }
})
export default router;


