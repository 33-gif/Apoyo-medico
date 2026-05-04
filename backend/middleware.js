const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET = process.env.JWT_SECRET || "sistema_clinico_secreto";

function verificarToken(req, res, next) {
  try {
    const token = req.headers["authorization"];

    if (!token) {
      return res.status(401).json({
        error: "Token requerido"
      });
    }

    const limpio = token.replace("Bearer ", "");

    const decoded = jwt.verify(limpio, SECRET);

    req.user = decoded;

    next();

  } catch (error) {
    return res.status(403).json({
      error: "Token inválido"
    });
  }
}

module.exports = verificarToken;