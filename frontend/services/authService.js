class AuthService {
  async login(email, password) {
    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || "Error en login" };
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      return { success: true, usuario: data.usuario };
    } catch (error) {
      return { success: false, error: "Error conectando servidor" };
    }
  }

  async getMe() {
    return apiService.get("/auth/me");
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = "login.html";
  }

  isAuthenticated() {
    return !!localStorage.getItem("token");
  }

  getUser() {
    const user = localStorage.getItem("usuario");
    return user ? JSON.parse(user) : null;
  }

  isAdmin() {
    const user = this.getUser();
    return user && user.rol === "admin";
  }

  getRole() {
    const user = this.getUser();
    return user ? user.rol : null;
  }
}

const authService = new AuthService();
