const express = require("express");
const router = express.Router();
const pacientesController = require("../controllers/pacientesController");
const { requireRole } = require("../middlewares");
const roles = require("../config/roles");

router.post(
  "/",
  requireRole(roles.ADMIN, roles.DOCTOR),
  pacientesController.crearPaciente
);
router.get(
  "/",
  requireRole(roles.ADMIN, roles.DOCTOR, roles.RECEPCIONISTA),
  pacientesController.obtenerPacientes
);
router.put(
  "/:id",
  requireRole(roles.ADMIN, roles.DOCTOR),
  pacientesController.actualizarPaciente
);
router.delete(
  "/:id",
  requireRole(roles.ADMIN),
  pacientesController.eliminarPaciente
);

module.exports = router;
