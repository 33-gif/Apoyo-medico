class UsuariosService {
  async crearUsuario(nombre, email, password, rol = "recepcionista") {
    return apiService.post("/usuarios", { nombre, email, password, rol });
  }

  async obtenerUsuarios() {
    return apiService.get("/usuarios");
  }

  async actualizarUsuario(id, datos) {
    return apiService.put(`/usuarios/${id}`, datos);
  }

  async eliminarUsuario(id) {
    return apiService.delete(`/usuarios/${id}`);
  }
}

const usuariosService = new UsuariosService();
