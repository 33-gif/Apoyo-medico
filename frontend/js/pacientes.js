let listaPacientes = [];
let pacienteEditando = null;
let pacienteEditandoId = null;

function textoPaciente(valor) {
  return String(valor || '').trim();
}

function normalizarPacienteTexto(valor) {
  return textoPaciente(valor).toLowerCase();
}

function edadPaciente(paciente) {
  const edad = Number(paciente.edad);
  return Number.isFinite(edad) ? edad : 0;
}

function tieneDiagnostico(paciente) {
  const diagnostico = normalizarPacienteTexto(paciente.diagnostico);
  return diagnostico !== '' && diagnostico !== 'n/a' && diagnostico !== 'sin diagnóstico';
}

function clasificarPaciente(paciente) {
  if (!tieneDiagnostico(paciente)) return { label: 'Pendiente', className: 'status-pendiente' };
  if (edadPaciente(paciente) >= 60) return { label: 'Seguimiento', className: 'status-seguimiento' };
  return { label: 'Estable', className: 'status-estable' };
}

async function cargarPacientes() {
  const pacientes = await apiGet('/pacientes');
  listaPacientes = Array.isArray(pacientes) ? pacientes : [];

  actualizarResumenPacientes();
  renderizarPacientes(listaPacientes);
}

function actualizarResumenPacientes() {
  const total = listaPacientes.length;
  const conDiagnostico = listaPacientes.filter(tieneDiagnostico).length;
  const adultosMayores = listaPacientes.filter(p => edadPaciente(p) >= 60).length;
  const sinDiagnostico = total - conDiagnostico;

  actualizarTextoPaciente('resumenPacientes', total);
  actualizarTextoPaciente('pacientesPrioridad', conDiagnostico);
  actualizarTextoPaciente('pacientesAdultosMayores', adultosMayores);
  actualizarTextoPaciente('pacientesSinDiagnostico', sinDiagnostico);

  const overview = document.querySelector('.overview-card:nth-child(3) strong');
  if (overview) {
    const hombres = listaPacientes.filter(p => p.sexo === 'Masculino').length;
    const mujeres = listaPacientes.filter(p => p.sexo === 'Femenino').length;
    overview.innerText = `${hombres} / ${mujeres}`;
  }
}

function actualizarTextoPaciente(id, valor) {
  const elemento = document.getElementById(id);
  if (elemento) elemento.textContent = valor;
}

function renderizarPacientes(pacientes) {
  const tabla = document.getElementById('tablaPacientes');
  if (!tabla) return;

  if (!pacientes.length) {
    tabla.innerHTML = `
      <tr>
        <td colspan="7" class="table-empty">No hay pacientes para mostrar</td>
      </tr>
    `;
    return;
  }

  tabla.innerHTML = pacientes.map(paciente => {
    const estado = clasificarPaciente(paciente);
    return `
      <tr>
        <td>${paciente.id}</td>
        <td>
          <div class="patient-cell">
            <strong>${paciente.nombre}</strong>
            <span>${estado.label}</span>
          </div>
        </td>
        <td>${paciente.documento}</td>
        <td>${paciente.edad}</td>
        <td>${paciente.sexo}</td>
        <td>
          <span class="patient-status ${estado.className}">${paciente.diagnostico || 'Sin diagnóstico'}</span>
        </td>
        <td class="table-actions">
          <button title="Editar paciente" onclick="editarPaciente(${paciente.id})">Editar</button>
          <button title="Eliminar paciente" onclick="eliminarPaciente(${paciente.id})">Eliminar</button>
          <button title="Ver historial clínico" onclick="verHistorial(${paciente.id})">Historial</button>
        </td>
      </tr>
    `;
  }).join('');
}

async function guardarPaciente() {
  const nombre = textoPaciente(document.getElementById('nombre').value);
  const documento = textoPaciente(document.getElementById('documento').value);
  const edad = document.getElementById('edad').value;
  const sexo = document.getElementById('sexo').value;
  const diagnostico = textoPaciente(document.getElementById('diagnostico').value);

  if (!nombre || !documento || !edad || !sexo) {
    alert('Completa nombre, documento, edad y sexo');
    return;
  }

  const data = { nombre, documento, edad, sexo, diagnostico };

  try {
    if (pacienteEditandoId) {
      await apiPut(`/pacientes/${pacienteEditandoId}`, data);
      alert('Paciente actualizado correctamente');
    } else {
      await apiPost('/pacientes', data);
      alert('Paciente creado correctamente');
    }

    cerrarModal();
    await cargarPacientes();
  } catch (error) {
    console.error(error);
    alert('Error al guardar paciente');
  }
}

function obtenerPacientesFiltrados() {
  const texto = normalizarPacienteTexto(document.getElementById('buscador')?.value);
  const sexo = document.getElementById('filtroPacientesSexo')?.value || '';
  const riesgo = document.getElementById('filtroPacientesRiesgo')?.value || '';

  return listaPacientes.filter(paciente => {
    const coincideTexto = !texto ||
      normalizarPacienteTexto(paciente.nombre).includes(texto) ||
      normalizarPacienteTexto(paciente.documento).includes(texto) ||
      normalizarPacienteTexto(paciente.diagnostico).includes(texto);
    const coincideSexo = !sexo || paciente.sexo === sexo;
    const coincideRiesgo = !riesgo ||
      (riesgo === 'mayores' && edadPaciente(paciente) >= 60) ||
      (riesgo === 'diagnostico' && tieneDiagnostico(paciente)) ||
      (riesgo === 'pendientes' && !tieneDiagnostico(paciente));

    return coincideTexto && coincideSexo && coincideRiesgo;
  });
}

function filtrarPacientes() {
  renderizarPacientes(obtenerPacientesFiltrados());
}

function limpiarFiltrosPacientes() {
  const buscador = document.getElementById('buscador');
  const sexo = document.getElementById('filtroPacientesSexo');
  const riesgo = document.getElementById('filtroPacientesRiesgo');

  if (buscador) buscador.value = '';
  if (sexo) sexo.value = '';
  if (riesgo) riesgo.value = '';
  filtrarPacientes();
}

function editarPaciente(id) {
  const paciente = listaPacientes.find(p => p.id === id);

  if (!paciente) {
    alert('Paciente no encontrado');
    return;
  }

  pacienteEditandoId = id;
  pacienteEditando = paciente;
  document.getElementById('modalPaciente').style.display = 'block';
  document.getElementById('tituloModal').innerText = 'Editar Paciente';
  llenarFormularioPaciente(paciente);
}

function llenarFormularioPaciente(paciente) {
  document.getElementById('nombre').value = paciente.nombre || '';
  document.getElementById('documento').value = paciente.documento || '';
  document.getElementById('edad').value = paciente.edad || '';
  document.getElementById('sexo').value = paciente.sexo || '';
  document.getElementById('diagnostico').value = paciente.diagnostico || '';
}

function limpiarFormulario() {
  document.getElementById('nombre').value = '';
  document.getElementById('documento').value = '';
  document.getElementById('edad').value = '';
  document.getElementById('sexo').value = '';
  document.getElementById('diagnostico').value = '';
  document.querySelector('#modalPaciente h2').innerText = 'Nuevo Paciente';
}

function cerrarModal() {
  document.getElementById('modalPaciente').style.display = 'none';
  pacienteEditandoId = null;
  pacienteEditando = null;
  limpiarFormulario();
}

function nuevoPaciente() {
  pacienteEditandoId = null;
  pacienteEditando = null;
  limpiarFormulario();
  abrirFormulario();
}

function verHistorial(pacienteId) {
  abrirHistorial(pacienteId);
}

function abrirFormulario() {
  pacienteEditando = null;
  pacienteEditandoId = null;
  document.getElementById('modalPaciente').style.display = 'block';
  document.getElementById('tituloModal').innerText = 'Nuevo Paciente';
  limpiarFormulario();
}

async function eliminarPaciente(id) {
  if (!confirm('¿Eliminar paciente?')) return;

  await apiDelete('/pacientes/' + id);
  alert('Paciente eliminado');
  await cargarPacientes();
}
