const pool = require("../config/db");

exports.crearHistorial = async (req, res) => {
  const { paciente_id, fecha, sintomas, diagnostico, tratamiento } = req.body;

  if (!paciente_id || !fecha || !sintomas || !diagnostico) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO historial_clinico
      (paciente_id, fecha, sintomas, diagnostico, tratamiento)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [paciente_id, fecha, sintomas, diagnostico, tratamiento]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerHistorialPorPaciente = async (req, res) => {
  try {
    const { pacienteId } = req.params;
    const result = await pool.query(
      `SELECT
        h.*,
        p.nombre AS paciente_nombre
      FROM historial_clinico h
      JOIN pacientes p
      ON h.paciente_id = p.id
      WHERE h.paciente_id = $1
      ORDER BY h.fecha DESC`,
      [pacienteId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
