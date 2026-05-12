// ABRIR FORMULARIO DE CITA
function abrirFormularioCita() {
  // Llenar select de pacientes
  const select = document.getElementById('citaPaciente');
  select.innerHTML = '<option value="">-- Seleccionar Paciente --</option>';

  listaPacientes.forEach(p => {
    select.innerHTML += `<option value="${p.id}">${p.nombre} (${p.documento})</option>`;
  });

  document.getElementById('modalCitas').style.display = 'flex';

  // Limpiar formulario
  document.getElementById('citaFecha').value = '';
  document.getElementById('citaHora').value = '';
  document.getElementById('citaMotivo').value = '';
  document.getElementById('citaNota').value = '';
}
