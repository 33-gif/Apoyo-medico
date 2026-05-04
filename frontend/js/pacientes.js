let listaPacientes = [];
let pacienteEditando = null; 
let pacienteEditandoId = null;

async function cargarPacientes() {
  const pacientes = await apiGet("/pacientes");
  listaPacientes = pacientes;

  let tabla = document.getElementById("tablaPacientes");
  tabla.innerHTML = "";

  pacientes.forEach(p => {
    tabla.innerHTML += `
<tr>
<td>${p.id}</td>
<td>${p.nombre}</td>
<td>${p.documento}</td>
<td>${p.edad}</td>
<td>${p.sexo}</td>
<td>${p.diagnostico}</td>
<td>
<button onclick="editarPaciente(${p.id})">✏️</button>
<button onclick="eliminarPaciente(${p.id})">🗑️</button>
<button onclick="verHistorial(${p.id})">📋</button>
</td>
</tr>
`;
  });
}
// GUARDADO
async function guardarPaciente() {

  const nombre = document.getElementById("nombre").value;
  const documento = document.getElementById("documento").value;
  const edad = document.getElementById("edad").value;
  const sexo = document.getElementById("sexo").value;
  const diagnostico = document.getElementById("diagnostico").value;

  const data = { nombre, documento, edad, sexo, diagnostico };

  try {

    if (pacienteEditandoId) {
      // ✏️ EDITAR
      await apiPut(`/pacientes/${pacienteEditandoId}`, data);
      alert("Paciente actualizado correctamente");
    } else {
      // ➕ CREAR
      await apiPost("/pacientes", data);
      alert("Paciente creado correctamente");
    }

    cerrarModal();
    limpiarFormulario();
    pacienteEditandoId = null;

    cargarPacientes();

  } catch (error) {
    console.error(error);
    alert("Error al guardar paciente");
  }
}
// FILTRADO 
function filtrarPacientes() {

  const texto = document.getElementById("buscador").value.toLowerCase();

  const filtrados = listaPacientes.filter(p =>
    p.nombre.toLowerCase().includes(texto) ||
    String(p.documento).toLowerCase().includes(texto)
  );

  let tabla = document.getElementById("tablaPacientes");
  tabla.innerHTML = "";

  filtrados.forEach(p => {
    tabla.innerHTML += `
<tr>
<td>${p.id}</td>
<td>${p.nombre}</td>
<td>${p.documento}</td>
<td>${p.edad}</td>
<td>${p.sexo}</td>
<td>${p.diagnostico}</td>
<td>
<button onclick="editarPaciente(${p.id})">✏️</button>
<button onclick="eliminarPaciente(${p.id})">🗑️</button>
<button onclick="verHistorial(${p.id})">📋</button>
</td>
</tr>
`;
  });
}
// EDICIÓN
function editarPaciente(id) {

  const paciente = listaPacientes.find(p => p.id === id);

  if (!paciente) {
    alert("Paciente no encontrado");
    return;
  }

  pacienteEditandoId = id;

  document.getElementById("nombre").value = paciente.nombre;
  document.getElementById("documento").value = paciente.documento;
  document.getElementById("edad").value = paciente.edad;
  document.getElementById("sexo").value = paciente.sexo;
  document.getElementById("diagnostico").value = paciente.diagnostico;

  document.querySelector("#modalPaciente h2").innerText = "Editar Paciente";

  abrirFormulario();
}
// LIMPIEZA
function limpiarFormulario() {
  document.getElementById("nombre").value = "";
  document.getElementById("documento").value = "";
  document.getElementById("edad").value = "";
  document.getElementById("sexo").value = "";
  document.getElementById("diagnostico").value = "";

  document.querySelector("#modalPaciente h2").innerText = "Nuevo Paciente";
}
// MODAL
function cerrarModal() {
  document.getElementById("modalPaciente").style.display = "none";
  pacienteEditandoId = null;
  limpiarFormulario();
}
// NUEVO
function nuevoPaciente() {
  pacienteEditandoId = null;
  limpiarFormulario();
  abrirFormulario();
}

// EDICIÓN CON HISTORIAL
function verHistorial(pacienteId) {
  abrirHistorial(pacienteId);
}

// ABRIR FORMULARIO
function abrirFormulario() {
  pacienteEditando = null; // modo crear
  document.getElementById("modalPaciente").style.display = "block";
  document.getElementById("tituloModal").innerText = "Nuevo Paciente";
  limpiarFormulario();
}
// ELIMINACIÓN
async function eliminarPaciente(id) {
  if (!confirm("¿Eliminar paciente?")) return;

  await apiDelete("/pacientes/" + id);

  alert("Paciente eliminado");
  cargarPacientes();
}