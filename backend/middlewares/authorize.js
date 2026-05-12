function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Token requerido" });
    }

    if (!allowedRoles.includes(req.user.rol)) {
      return res.status(403).json({ error: "Acceso denegado" });
    }

    next();
  };
}

function requireSelfOrRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Token requerido" });
    }

    const isOwner = req.user.id === Number(req.params.id);
    const hasRole = allowedRoles.includes(req.user.rol);

    if (!isOwner && !hasRole) {
      return res.status(403).json({ error: "Acceso denegado" });
    }

    next();
  };
}

module.exports = {
  requireRole,
  requireSelfOrRole,
};
