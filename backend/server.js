const express = require("express");
const cors = require("cors");
const pool = require("./db");
const authRoutes = require("./auth");

const app = express();

app.use(cors());
app.use(express.json());


// RUTAS LOGIN
app.use("/api", authRoutes);


// Ruta prueba PostgreSQL
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en base de datos" });
  }
});

app.listen(3000, () => {
  console.log("Servidor activo en http://localhost:3000");
});