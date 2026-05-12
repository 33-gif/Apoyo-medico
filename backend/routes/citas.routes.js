const express = require("express");
const router = express.Router();
const citasController = require("../controllers/citasController");
const { requireRole } = require("../middlewares");
const roles = require("../config/roles");

router.post(
  "/",
  requireRole(roles.ADMIN, roles.DOCTOR, roles.RECEPCIONISTA),
  citasController.crearCita
);
router.get(
  "/",
  requireRole(roles.ADMIN, roles.DOCTOR, roles.RECEPCIONISTA),
  citasController.obtenerCitas
);
router.put(
  "/:id",
  requireRole(roles.ADMIN, roles.DOCTOR),
  citasController.actualizarCita
);
router.delete(
  "/:id",
  requireRole(roles.ADMIN),
  citasController.eliminarCita
);

module.exports = router;
