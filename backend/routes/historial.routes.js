const express = require("express");
const router = express.Router();
const historialController = require("../controllers/historialController");
const { requireRole } = require("../middlewares");
const roles = require("../config/roles");

router.post(
  "/",
  requireRole(roles.ADMIN, roles.DOCTOR),
  historialController.crearHistorial
);
router.get(
  "/:pacienteId",
  requireRole(roles.ADMIN, roles.DOCTOR, roles.RECEPCIONISTA),
  historialController.obtenerHistorialPorPaciente
);

module.exports = router;
