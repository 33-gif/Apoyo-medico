const API_URL = "http://localhost:3000/api";

function getHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("token")
  };
}

async function apiGet(endpoint) {
  const res = await fetch(API_URL + endpoint, {
    headers: getHeaders()
  });

  if (res.status === 401) {
    logout(); // sesión inválida
  }

  return res.json();
}
async function apiPost(endpoint, data) {
  const res = await fetch(API_URL + endpoint, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  return res.json();
}

async function apiPut(endpoint, data) {
  const res = await fetch(API_URL + endpoint, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  return res.json();
}

async function apiDelete(endpoint) {
  const res = await fetch(API_URL + endpoint, {
    method: "DELETE",
    headers: getHeaders()
  });
  return res.json();
}