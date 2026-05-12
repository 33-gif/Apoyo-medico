const express = require("express");
const cors = require("cors");
const { verificarToken } = require("./middlewares");

const authRoutes = require("./routes/auth.routes");
const pacientesRoutes = require("./routes/pacientes.routes");
const historialRoutes = require("./routes/historial.routes");
const citasRoutes = require("./routes/citas.routes");
const usuariosRoutes = require("./routes/usuarios.routes");

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/pacientes", verificarToken, pacientesRoutes);
app.use("/api/historial", verificarToken, historialRoutes);
app.use("/api/citas", verificarToken, citasRoutes);
app.use("/api/usuarios", verificarToken, usuariosRoutes);

app.get("/api/perfil", verificarToken, (req, res) => {
  res.json({
    mensaje: "Acceso a perfil protegido",
    usuario: req.user,
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
});

module.exports = app;
