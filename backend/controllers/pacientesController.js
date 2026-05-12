const pool = require("../config/db");

exports.crearPaciente = async (req, res) => {
  const { nombre, documento, edad, sexo, diagnostico } = req.body;

  if (!nombre || !documento || !edad || !sexo) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }

  if (isNaN(edad) || edad < 0) {
    return res.status(400).json({ error: "Edad inválida" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO pacientes
      (nombre, documento, edad, sexo, diagnostico)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [nombre, documento, edad, sexo, diagnostico]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerPacientes = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM pacientes ORDER BY id DESC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.actualizarPaciente = async (req, res) => {
  const { id } = req.params;
  const { nombre, documento, edad, sexo, diagnostico } = req.body;

  try {
    const result = await pool.query(
      `UPDATE pacientes
      SET nombre=$1,
          documento=$2,
          edad=$3,
          sexo=$4,
          diagnostico=$5
      WHERE id=$6
      RETURNING *`,
      [nombre, documento, edad, sexo, diagnostico, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.eliminarPaciente = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM pacientes WHERE id=$1", [id]);
    res.json({ mensaje: "Paciente eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
