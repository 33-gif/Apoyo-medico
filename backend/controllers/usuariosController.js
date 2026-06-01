const pool = require("../config/db");
const bcrypt = require("bcrypt");

exports.crear = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password) {
      return res
        .status(400)
        .json({ error: "Nombre, email y password son requeridos" });
    }

    const userRole = rol || "recepcionista";
    const hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO usuarios(nombre, email, password, rol)
       VALUES($1, $2, $3, $4)
       RETURNING id, nombre, email, rol`,
      [nombre, email, hash, userRole]
    );

    res.json({
      mensaje: "Usuario creado correctamente",
      usuario: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({ error: "El email ya está registrado" });
    }
    console.error(error);
    res.status(500).json({ error: "Error creando usuario" });
  }
};

exports.obtener = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, nombre, email, rol FROM usuarios ORDER BY id DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo usuarios" });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, rol } = req.body;

    const result = await pool.query(
      `UPDATE usuarios
       SET nombre=$1, email=$2, rol=$3
       WHERE id=$4
       RETURNING id, nombre, email, rol`,
      [nombre, email, rol, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({
      mensaje: "Usuario actualizado",
      usuario: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error actualizando usuario" });
  }
};

exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("DELETE FROM usuarios WHERE id=$1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ mensaje: "Usuario eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error eliminando usuario" });
  }
};
