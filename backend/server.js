const express = require("express");
const cors = require("cors");
const pool = require("./db");
const authRoutes = require("./auth");
app.use(cors({
  origin: "*", // desarrollo
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

/* ==============================
   RUTAS DE AUTENTICACIÓN
app.use("/api", authRoutes);

/* ==============================
   TEST DE SERVIDOR

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
app.get("/api/perfil", verificarToken, (req, res) => {
  res.json({
    mensaje: "Ruta privada",
    usuario: req.user
  });
});

/* ==============================
   CRUD PACIENTES

/* ➜ CREAR */
app.post("/api/pacientes", verificarToken, async (req, res) => {
  const { nombre, documento, edad, sexo, diagnostico } = req.body;

  // Validación de entrada
  if (!nombre || !documento || !edad || !sexo) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }

  if (typeof edad !== "number" || edad < 0) {
    return res.status(400).json({ error: "La edad debe ser un número positivo" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO pacientes (nombre, documento, edad, sexo, diagnostico)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [nombre, documento, edad, sexo, diagnostico]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/* ➜ OBTENER TODOS */
app.get("/api/pacientes", verificarToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM pacientes ORDER BY id DESC"
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ➜ ACTUALIZAR */
app.put("/api/pacientes/:id", verificarToken, async (req, res) => {
  const { id } = req.params;
  const { nombre, documento, edad, sexo, diagnostico } = req.body;

  try {
    const result = await pool.query(
      `UPDATE pacientes
       SET nombre=$1, documento=$2, edad=$3, sexo=$4, diagnostico=$5
       WHERE id=$6
       RETURNING *`,
      [nombre, documento, edad, sexo, diagnostico, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ➜ ELIMINAR */
app.delete("/api/pacientes/:id", verificarToken, async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      "DELETE FROM pacientes WHERE id=$1",
      [id]
    );

    res.json({ mensaje: "Paciente eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ==============================
   CRUD HISTORIAL CLÍNICO

/* ➜ CREAR HISTORIAL */
app.post("/api/historial", verificarToken, async (req, res) => {
  const { paciente_id, fecha, sintomas, diagnostico, tratamiento } = req.body;

  // Validación de entrada
  if (!paciente_id || !fecha || !sintomas || !diagnostico) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO historial_clinico (paciente_id, fecha, sintomas, diagnostico, tratamiento)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [paciente_id, fecha, sintomas, diagnostico, tratamiento]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/* ➜ OBTENER HISTORIAL POR PACIENTE */
app.get("/api/historial/:pacienteId", verificarToken, async (req, res) => {
  try {
    const { pacienteId } = req.params;

    const result = await pool.query(`
      SELECT 
        h.*, 
        p.nombre AS paciente_nombre 
      FROM historial_clinico h
      JOIN pacientes p ON h.paciente_id = p.id
      WHERE h.paciente_id = $1
      ORDER BY h.fecha DESC
    `, [pacienteId]);

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/* ==============================
   CRUD CITAS

/* ➜ CREAR CITAS */
app.post("/api/citas", verificarToken, async (req, res) => {
  const { paciente_id, fecha, hora, motivo } = req.body;

  // Validación de entrada
  if (!paciente_id || !fecha || !hora || !motivo) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO citas (paciente_id, fecha, hora, motivo)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [paciente_id, fecha, hora, motivo]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/* ➜ OBTENER CITAS POR PACIENTE */
app.get("/api/citas/:pacienteId", verificarToken, async (req, res) => {
  try {
    const { pacienteId } = req.params;

    const result = await pool.query(`
      SELECT 
        c.*, 
        p.nombre AS paciente_nombre 
      FROM citas c
      JOIN pacientes p ON c.paciente_id = p.id
      WHERE c.paciente_id = $1
      ORDER BY c.fecha DESC
    `, [pacienteId]);

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/* ➜ ACTUALIZAR CITAS */
app.put("/api/citas/:id", verificarToken, async (req, res) => {
  const { id } = req.params;
  const { paciente_id, fecha, hora, motivo } = req.body;

  try {
    const result = await pool.query(
      `UPDATE citas
       SET paciente_id=$1, fecha=$2, hora=$3, motivo=$4
       WHERE id=$5
       RETURNING *`,
      [paciente_id, fecha, hora, motivo, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ➜ ELIMINAR CITAS */
app.delete("/api/citas/:id", verificarToken, async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      "DELETE FROM citas WHERE id=$1",
      [id]
    );

    res.json({ mensaje: "Cita eliminada" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ==============================
   INICIAR SERVIDOR
app.listen(3000, () => {
  console.log("🚀 Servidor activo en http://localhost:3000");
    console.error(error);
    res.status(500).json({ error: "Error en base de datos" });
  }
});

app.listen(3000, () => {
  console.log("Servidor activo en http://localhost:3000");
});