class CitasService {
  async crear(paciente_id, fecha, hora, motivo) {
    return apiService.post("/citas", { paciente_id, fecha, hora, motivo });
  }

  async obtener() {
    return apiService.get("/citas");
  }

  async actualizar(id, datos) {
    return apiService.put(`/citas/${id}`, datos);
  }

  async eliminar(id) {
    return apiService.delete(`/citas/${id}`);
  }
}

const citasService = new CitasService();
