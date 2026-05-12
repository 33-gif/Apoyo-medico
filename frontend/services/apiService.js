const API_URL = "http://localhost:3000/api";

class ApiService {
  constructor() {
    this.baseURL = API_URL;
  }

  getHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    };
  }

  async get(endpoint) {
    const res = await fetch(this.baseURL + endpoint, {
      headers: this.getHeaders(),
    });

    if (res.status === 401) {
      this.logout();
    }

    return res.json();
  }

  async post(endpoint, data) {
    const res = await fetch(this.baseURL + endpoint, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async put(endpoint, data) {
    const res = await fetch(this.baseURL + endpoint, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async delete(endpoint) {
    const res = await fetch(this.baseURL + endpoint, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
    return res.json();
  }

  logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  }
}

const apiService = new ApiService();
