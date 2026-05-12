function checkAuth() {
  if (!authService.isAuthenticated()) {
    window.location.href = "login.html";
  }
}

function checkAdminAuth() {
  if (!authService.isAuthenticated()) {
    window.location.href = "login.html";
    return;
  }

  if (!authService.isAdmin()) {
    alert("Acceso denegado: Se requieren permisos de administrador");
    window.location.href = "dashboard.html";
  }
}

function checkAuthLogin() {
  if (authService.isAuthenticated()) {
    window.location.href = "dashboard.html";
  }
}

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("es-ES", options);
}

function showAlert(message, type = "info") {
  const alertBox = document.createElement("div");
  alertBox.className = `alert alert-${type}`;
  alertBox.textContent = message;
  alertBox.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background: ${type === "success" ? "#10b981" : type === "error" ? "#ef4444" : "#3b82f6"};
    color: white;
    border-radius: 5px;
    z-index: 9999;
    animation: slideIn 0.3s ease-in-out;
  `;
  document.body.appendChild(alertBox);

  setTimeout(() => {
    alertBox.remove();
  }, 3000);
}
