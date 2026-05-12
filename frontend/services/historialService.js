class HistorialService {
  async crear(paciente_id, fecha, sintomas, diagnostico, tratamiento) {
    return apiService.post("/historial", {
      paciente_id,
      fecha,
      sintomas,
      diagnostico,
      tratamiento,
    });
  }

  async obtenerPorPaciente(pacienteId) {
    return apiService.get(`/historial/${pacienteId}`);
  }
}

const historialService = new HistorialService();
