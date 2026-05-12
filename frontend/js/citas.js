const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  res.json([]);
});

module.exports = router;

// GESTIÓN DE CITAS
let citasLista = [];
let calendario;

// ABRIR MODAL NUEVA CITA (nombre corregido para coincidir con dashboard.html)
function abrirFormularioCita() {
  document.getElementById('modalCitas').style.display = 'flex';
  cargarPacientesEnSelect();
}

// CARGAR PACIENTES EN EL SELECT DEL MODAL
async function cargarPacientesEnSelect() {
  const select = document.getElementById('citaPaciente');
  select.innerHTML = '<option value="">-- Seleccionar Paciente --</option>';

  try {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:3000/api/pacientes', {
      headers: { 'Authorization': 'Bearer ' + token }
    });

    if (!res.ok) throw new Error('Error al cargar pacientes');

    const pacientes = await res.json();
    pacientes.forEach(p => {
      const option = document.createElement('option');
      option.value = p.id;
      option.textContent = p.nombre;
      select.appendChild(option);
    });

  } catch (error) {
    console.error('Error al cargar pacientes en select:', error);
  }
}

// CARGAR CITAS
async function cargarCitas() {
  const contenedor = document.getElementById('citasLista');
  contenedor.innerHTML = 'Cargando citas...';

  try {
    const token = localStorage.getItem('token');

    const res = await fetch('http://localhost:3000/api/citas', {
      headers: { 'Authorization': 'Bearer ' + token }
    });

    if (!res.ok) throw new Error('Error al cargar citas');

    citasLista = await res.json();
    renderizarCitas();
    renderizarCalendario();

  } catch (error) {
    console.error(error);
    contenedor.innerHTML = '<p style="color: #ef4444; text-align: center;">Error al cargar citas. Verifica que el servidor esté corriendo.</p>';
  }
}
// RENDERIZAR CALENDARIO CON FULLCALENDAR
function renderizarCalendario() {

  const calendarEl = document.getElementById('calendarioCitas');

  // Destruir calendario anterior
  if (calendario) {
    calendario.destroy();
  }

  const eventos = citasLista.map(cita => ({
    title: `${cita.hora} - ${cita.paciente_nombre}`,
    start: `${cita.fecha}T${cita.hora}`,
    backgroundColor: '#10b981',
    borderColor: '#10b981'
  }));

  calendario = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    locale: 'es',
    height: 650,

    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },

    buttonText: {
      today: 'Hoy',
      month: 'Mes',
      week: 'Semana',
      day: 'Día'
    },

    events: eventos,

    eventClick(info) {
      alert(info.event.title);
    }
  });

  calendario.render();
}


// CERRAR MODAL CITAS
function cerrarModalCitas() {
  document.getElementById('modalCitas').style.display = 'none';
  limpiarFormularioCita();
}

// LIMPIAR FORMULARIO CITA
function limpiarFormularioCita() {
  document.getElementById('citaPaciente').value = '';
  document.getElementById('citaFecha').value = '';
  document.getElementById('citaHora').value = '';
  document.getElementById('citaMotivo').value = '';
  document.getElementById('citaNota').value = '';
  // Resetear el id de edición si existiera
  delete document.getElementById('modalCitas').dataset.editandoId;
}

// GUARDAR O ACTUALIZAR CITA
async function guardarCita() {
  const paciente_id = document.getElementById('citaPaciente').value;
  const fecha      = document.getElementById('citaFecha').value;
  const hora       = document.getElementById('citaHora').value;
  const motivo     = document.getElementById('citaMotivo').value;
  const nota       = document.getElementById('citaNota').value;

  if (!paciente_id || !fecha || !hora || !motivo) {
    alert('Por favor completa todos los campos requeridos');
    return;
  }

  const editandoId = document.getElementById('modalCitas').dataset.editandoId;
  const esEdicion  = !!editandoId;
  const url        = esEdicion
    ? `http://localhost:3000/api/citas/${editandoId}`
    : 'http://localhost:3000/api/citas';
  const method     = esEdicion ? 'PUT' : 'POST';

  try {
    const token = localStorage.getItem('token');

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        paciente_id: parseInt(paciente_id),
        fecha,
        hora,
        motivo,
        nota
      })
    });

    if (!res.ok) throw new Error('Error al guardar cita');

    alert(esEdicion ? 'Cita actualizada correctamente' : 'Cita guardada correctamente');
    cerrarModalCitas();
   renderizarCitas();
   renderizarCalendario();

  } catch (error) {
    console.error(error);
    alert('Error al guardar cita. Verifica que el servidor esté corriendo.');
  }
}

// ELIMINAR CITA
async function eliminarCita(citaId) {
  if (!confirm('¿Estás seguro de que deseas eliminar esta cita?')) return;

  try {
    const token = localStorage.getItem('token');

    const res = await fetch(`http://localhost:3000/api/citas/${citaId}`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + token }
    });

    if (!res.ok) throw new Error('Error al eliminar cita');

    alert('Cita eliminada correctamente');
    cargarCitas();

  } catch (error) {
    console.error(error);
    alert('Error al eliminar cita');
  }
}

// EDITAR CITA (carga datos en el modal y guarda el id para el PUT)
function editarCita(citaId) {
  const cita = citasLista.find(c => c.id === citaId);
  if (!cita) return;

  document.getElementById('citaPaciente').value = cita.paciente_id;
  document.getElementById('citaFecha').value    = cita.fecha;
  document.getElementById('citaHora').value     = cita.hora;
  document.getElementById('citaMotivo').value   = cita.motivo;
  document.getElementById('citaNota').value     = cita.nota || '';

  // Guardar id para saber que es edición
  document.getElementById('modalCitas').dataset.editandoId = citaId;

 // document.getElementById('modalCitas').style.display = 'flex';
}
