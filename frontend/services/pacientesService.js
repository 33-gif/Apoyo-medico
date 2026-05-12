class PacientesService {
  async crear(nombre, documento, edad, sexo, diagnostico) {
    return apiService.post("/pacientes", {
      nombre,
      documento,
      edad,
      sexo,
      diagnostico,
    });
  }

  async obtener() {
    return apiService.get("/pacientes");
  }

  async actualizar(id, datos) {
    return apiService.put(`/pacientes/${id}`, datos);
  }

  async eliminar(id) {
    return apiService.delete(`/pacientes/${id}`);
  }
}

const pacientesService = new PacientesService();
