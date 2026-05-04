const express = require("express");
const router = express.Router();
const pool = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const SECRET = process.env.JWT_SECRET || "sistema_clinico_secreto";


// REGISTRO
router.post("/register", async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    const hash = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO usuarios(nombre,email,password,rol) VALUES($1,$2,$3,$4)",
      [nombre, email, hash, rol]
    );

    res.json({
      mensaje: "Usuario creado correctamente"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error registrando usuario"
    });
  }
});


// LOGIN JWT
router.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM usuarios WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: "Usuario no existe"
      });
    }

    const usuario = result.rows[0];

    const valido = await bcrypt.compare(
      password,
      usuario.password
    );

    if (!valido) {
      return res.status(401).json({
        error: "Contraseña incorrecta"
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        rol: usuario.rol,
        email: usuario.email
      },
      SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      mensaje: "Login correcto",
      token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error login"
    });
  }
});

module.exports = router;