const verificarToken = require("./auth");
const { requireRole, requireSelfOrRole } = require("./authorize");

module.exports = {
  verificarToken,
  requireRole,
  requireSelfOrRole,
};
