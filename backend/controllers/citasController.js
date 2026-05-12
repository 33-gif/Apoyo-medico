const pool = require("../config/db");

exports.crearCita = async (req, res) => {
  const { paciente_id, fecha, hora, motivo } = req.body;

  if (!paciente_id || !fecha || !hora || !motivo) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO citas
      (paciente_id, fecha, hora, motivo)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [paciente_id, fecha, hora, motivo]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerCitas = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        c.*,
        p.nombre AS paciente_nombre
      FROM citas c
      JOIN pacientes p
      ON c.paciente_id = p.id
      ORDER BY c.fecha DESC, c.hora DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.actualizarCita = async (req, res) => {
  const { id } = req.params;
  const { paciente_id, fecha, hora, motivo } = req.body;

  try {
    const result = await pool.query(
      `UPDATE citas
      SET paciente_id=$1,
          fecha=$2,
          hora=$3,
          motivo=$4
      WHERE id=$5
      RETURNING *`,
      [paciente_id, fecha, hora, motivo, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.eliminarCita = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM citas WHERE id=$1", [id]);
    res.json({ mensaje: "Cita eliminada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
