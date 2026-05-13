const BASE_API_URL = "http://localhost:3000/api";

function getHeaders() {
  const token = localStorage.getItem("token");
  
  if (!token) {
    console.warn("No token found in localStorage. User may not be authenticated.");
    // Redirect to login if no token
    if (window.location.pathname !== "/login.html") {
      window.location.href = "login.html";
    }
  }

  return {
    "Content-Type": "application/json",
    Authorization: "Bearer " + (token || "")
  };
}

async function apiGet(endpoint) {
  const res = await fetch(BASE_API_URL + endpoint, {
    headers: getHeaders()
  });

  if (res.status === 401) {
    console.error("❌ Token expirado o inválido");
    logout();
    return null;
  }

  if (res.status === 403) {
    console.error("❌ Acceso denegado: Verifica que tu usuario tiene los permisos correctos");
    return null;
  }

  if (!res.ok) {
    console.error(`❌ Error ${res.status}:`, res.statusText);
  }

  return res.json();
}
async function apiPost(endpoint, data) {
  const res = await fetch(BASE_API_URL + endpoint, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  return res.json();
}

async function apiPut(endpoint, data) {
  const res = await fetch(BASE_API_URL + endpoint, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  return res.json();
}

async function apiDelete(endpoint) {
  const res = await fetch(BASE_API_URL + endpoint, {
    method: "DELETE",
    headers: getHeaders()
  });
  return res.json();
}