const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuariosController");
const { requireRole } = require("../middlewares");
const roles = require("../config/roles");

router.post(
  "/",
  requireRole(roles.ADMIN),
  usuariosController.crear
);

router.get(
  "/",
  requireRole(roles.ADMIN),
  usuariosController.obtener
);

router.put(
  "/:id",
  requireRole(roles.ADMIN),
  usuariosController.actualizar
);

router.delete(
  "/:id",
  requireRole(roles.ADMIN),
  usuariosController.eliminar
);

module.exports = router;
