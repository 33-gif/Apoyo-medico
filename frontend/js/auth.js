// LOGIN
async function login(email, password) {
  try {
    const res = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Error en login");
      return false;
    }

    // Guardar token
    localStorage.setItem("token", data.token);

    return true;

  } catch (error) {
    alert("Error conectando servidor");
    return false;
  }
}
// INICIAR SESIÓN DESDE EL FORMULARIO
async function iniciarSesion() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const ok = await login(email, password);

  if (ok) {
    window.location.href = "dashboard.html";
  }
}


// VERIFICAR SI ESTÁ LOGUEADO
function verificarAuth() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "login.html";
  }
}

// VERIFICAR SI YA ESTÁ AUTENTICADO EN LOGIN
function verificarAuthLogin() {
  const token = localStorage.getItem("token");
  
  if (token) {
    // Si ya tiene token, ir al dashboard
    window.location.href = "dashboard.html";
  }
}


// CERRAR SESIÓN
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}
