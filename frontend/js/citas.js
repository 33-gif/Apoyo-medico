// GESTIÓN DE CITAS
let citasLista = [];
let citasFiltradas = [];
let calendario;

function obtenerToken() {
  return localStorage.getItem('token');
}

function normalizarTexto(valor) {
  return String(valor || '').trim().toLowerCase();
}

function formatearFecha(fecha) {
  const fechaISO = normalizarFechaCita(fecha);
  if (!fechaISO) return 'Sin fecha';
  const date = new Date(`${fechaISO}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? fechaISO
    : date.toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' });
}

function normalizarFechaCita(fecha) {
  if (!fecha) return '';
  return String(fecha).slice(0, 10);
}

function formatearHora(hora) {
  if (!hora) return '';
  return hora.slice(0, 5);
}

function fechaHoyISO() {
  return new Date().toISOString().slice(0, 10);
}

function obtenerEstadoCita(cita) {
  const hoy = fechaHoyISO();
  const fecha = normalizarFechaCita(cita.fecha);
  if (fecha === hoy) return 'hoy';
  return fecha > hoy ? 'proximas' : 'vencidas';
}

function etiquetaEstado(estado) {
  const etiquetas = {
    hoy: 'Hoy',
    proximas: 'Próxima',
    vencidas: 'Vencida'
  };
  return etiquetas[estado] || 'Cita';
}

function ordenarCitasPorFecha(citas) {
  return [...citas].sort((a, b) => {
    const fechaA = `${normalizarFechaCita(a.fecha)}T${a.hora || '00:00'}`;
    const fechaB = `${normalizarFechaCita(b.fecha)}T${b.hora || '00:00'}`;
    return fechaA.localeCompare(fechaB);
  });
}

function abrirFormularioCita() {
  const modal = document.getElementById('modalCitas');
  modal.style.display = 'flex';
  document.getElementById('tituloModalCita').innerText = modal.dataset.editandoId
    ? 'Editar Cita Médica'
    : 'Nueva Cita Médica';
  cargarPacientesEnSelect();
}

async function cargarPacientesEnSelect() {
  const select = document.getElementById('citaPaciente');
  const valorActual = select.value;
  select.innerHTML = '<option value="">-- Seleccionar Paciente --</option>';

  try {
    const res = await fetch('http://localhost:3000/api/pacientes', {
      headers: { Authorization: 'Bearer ' + obtenerToken() }
    });

    if (!res.ok) throw new Error('Error al cargar pacientes');

    const pacientes = await res.json();
    pacientes.forEach(paciente => {
      const option = document.createElement('option');
      option.value = paciente.id;
      option.textContent = `${paciente.nombre} - ${paciente.documento}`;
      select.appendChild(option);
    });

    if (valorActual) select.value = valorActual;
  } catch (error) {
    console.error('Error al cargar pacientes en select:', error);
    select.innerHTML = '<option value="">No se pudieron cargar pacientes</option>';
  }
}

async function cargarCitas() {
  const contenedor = document.getElementById('citasLista');
  contenedor.innerHTML = '<p class="empty-state">Cargando citas...</p>';

  try {
    const res = await fetch('http://localhost:3000/api/citas', {
      headers: { Authorization: 'Bearer ' + obtenerToken() }
    });

    if (!res.ok) throw new Error('Error al cargar citas');

    citasLista = ordenarCitasPorFecha(await res.json());
    citasFiltradas = [...citasLista];
    actualizarResumenCitas();
    filtrarCitas();
  } catch (error) {
    console.error(error);
    contenedor.innerHTML = '<p class="empty-state error">Error al cargar citas. Verifica que el servidor esté corriendo.</p>';
  }
}

function actualizarResumenCitas() {
  const resumen = citasLista.reduce((acc, cita) => {
    acc[obtenerEstadoCita(cita)] += 1;
    return acc;
  }, { hoy: 0, proximas: 0, vencidas: 0 });

  const totalCitas = document.getElementById('totalCitas');
  const citasHoy = document.getElementById('citasHoy');
  const citasProximas = document.getElementById('citasProximas');
  const citasVencidas = document.getElementById('citasVencidas');

  if (totalCitas) totalCitas.innerText = citasLista.length;
  if (citasHoy) citasHoy.innerText = resumen.hoy;
  if (citasProximas) citasProximas.innerText = resumen.proximas;
  if (citasVencidas) citasVencidas.innerText = resumen.vencidas;

  const overview = document.querySelector('.overview-card:nth-child(2) strong');
  if (overview) overview.innerText = `${resumen.hoy + resumen.proximas} pendientes`;
}

function filtrarCitas() {
  const texto = normalizarTexto(document.getElementById('filtroCitasTexto')?.value);
  const estado = document.getElementById('filtroCitasEstado')?.value || 'todas';
  const fecha = document.getElementById('filtroCitasFecha')?.value || '';

  citasFiltradas = citasLista.filter(cita => {
    const coincideTexto = !texto ||
      normalizarTexto(cita.paciente_nombre).includes(texto) ||
      normalizarTexto(cita.motivo).includes(texto);
    const estadoCita = obtenerEstadoCita(cita);
    const coincideEstado = estado === 'todas' || estadoCita === estado;
    const coincideFecha = !fecha || normalizarFechaCita(cita.fecha) === fecha;

    return coincideTexto && coincideEstado && coincideFecha;
  });

  renderizarCitas();
  renderizarCalendario();
}

function limpiarFiltrosCitas() {
  document.getElementById('filtroCitasTexto').value = '';
  document.getElementById('filtroCitasEstado').value = 'todas';
  document.getElementById('filtroCitasFecha').value = '';
  filtrarCitas();
}

function renderizarCitas() {
  const contenedor = document.getElementById('citasLista');

  if (!citasFiltradas || citasFiltradas.length === 0) {
    contenedor.innerHTML = '<p class="empty-state">No hay citas con los filtros actuales</p>';
    return;
  }

  contenedor.innerHTML = citasFiltradas.map(cita => {
    const estado = obtenerEstadoCita(cita);
    return `
      <article class="cita-item estado-${estado}">
        <div class="cita-main">
          <div class="cita-row">
            <strong>${cita.paciente_nombre || cita.paciente?.nombre || 'Paciente'}</strong>
            <span class="cita-status status-${estado}">${etiquetaEstado(estado)}</span>
          </div>
          <p>${formatearFecha(cita.fecha)} · ${formatearHora(cita.hora)}</p>
          <p>${cita.motivo || 'Sin motivo registrado'}</p>
        </div>
        <div class="cita-actions">
          <button onclick="editarCita(${cita.id})">Editar</button>
          <button onclick="eliminarCita(${cita.id})">Eliminar</button>
        </div>
      </article>
    `;
  }).join('');
}

function renderizarCalendario() {
  const calendarEl = document.getElementById('calendarioCitas');
  if (!calendarEl || typeof FullCalendar === 'undefined') return;

  if (calendario) {
    calendario.destroy();
  }

  const eventos = citasFiltradas.map(cita => {
    const estado = obtenerEstadoCita(cita);
    const color = estado === 'hoy' ? '#d97706' : estado === 'vencidas' ? '#dc2626' : '#0f9f8f';

    return {
      title: `${formatearHora(cita.hora)} - ${cita.paciente_nombre || 'Paciente'}`,
      start: `${normalizarFechaCita(cita.fecha)}T${cita.hora}`,
      backgroundColor: color,
      borderColor: color,
      extendedProps: { motivo: cita.motivo }
    };
  });

  calendario = new FullCalendar.Calendar(calendarEl, {
    initialView: window.innerWidth < 768 ? 'listWeek' : 'dayGridMonth',
    locale: 'es',
    height: window.innerWidth < 768 ? 440 : 620,
    nowIndicator: true,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,listWeek'
    },
    buttonText: {
      today: 'Hoy',
      month: 'Mes',
      week: 'Semana',
      list: 'Lista'
    },
    events: eventos,
    eventClick(info) {
      const motivo = info.event.extendedProps.motivo || 'Sin motivo registrado';
      alert(`${info.event.title}\n${motivo}`);
    }
  });

  calendario.render();
}

function cerrarModalCitas() {
  document.getElementById('modalCitas').style.display = 'none';
  limpiarFormularioCita();
}

function limpiarFormularioCita() {
  document.getElementById('citaPaciente').value = '';
  document.getElementById('citaFecha').value = '';
  document.getElementById('citaHora').value = '';
  document.getElementById('citaMotivo').value = '';
  document.getElementById('citaNota').value = '';
  document.getElementById('tituloModalCita').innerText = 'Nueva Cita Médica';
  delete document.getElementById('modalCitas').dataset.editandoId;
}

function hayChoqueHorario(fecha, hora, citaIdActual) {
  return citasLista.some(cita =>
    normalizarFechaCita(cita.fecha) === fecha &&
    formatearHora(cita.hora) === formatearHora(hora) &&
    String(cita.id) !== String(citaIdActual || '')
  );
}

async function guardarCita() {
  const paciente_id = document.getElementById('citaPaciente').value;
  const fecha = document.getElementById('citaFecha').value;
  const hora = document.getElementById('citaHora').value;
  const motivo = document.getElementById('citaMotivo').value.trim();
  const nota = document.getElementById('citaNota').value.trim();

  if (!paciente_id || !fecha || !hora || !motivo) {
    alert('Por favor completa paciente, fecha, hora y motivo');
    return;
  }

  const editandoId = document.getElementById('modalCitas').dataset.editandoId;
  const esEdicion = !!editandoId;

  if (hayChoqueHorario(fecha, hora, editandoId)) {
    alert('Ya existe una cita registrada para esa fecha y hora');
    return;
  }

  const url = esEdicion
    ? `http://localhost:3000/api/citas/${editandoId}`
    : 'http://localhost:3000/api/citas';
  const method = esEdicion ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + obtenerToken()
      },
      body: JSON.stringify({
        paciente_id: parseInt(paciente_id, 10),
        fecha,
        hora,
        motivo,
        nota
      })
    });

    if (!res.ok) throw new Error('Error al guardar cita');

    alert(esEdicion ? 'Cita actualizada correctamente' : 'Cita guardada correctamente');
    cerrarModalCitas();
    await cargarCitas();
  } catch (error) {
    console.error(error);
    alert('Error al guardar cita. Verifica que el servidor esté corriendo.');
  }
}

async function eliminarCita(citaId) {
  if (!confirm('¿Estás seguro de que deseas eliminar esta cita?')) return;

  try {
    const res = await fetch(`http://localhost:3000/api/citas/${citaId}`, {
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + obtenerToken() }
    });

    if (!res.ok) throw new Error('Error al eliminar cita');

    alert('Cita eliminada correctamente');
    await cargarCitas();
  } catch (error) {
    console.error(error);
    alert('Error al eliminar cita');
  }
}

async function editarCita(citaId) {
  const cita = citasLista.find(c => c.id === citaId);
  if (!cita) return;

  const modal = document.getElementById('modalCitas');
  modal.dataset.editandoId = citaId;
  await cargarPacientesEnSelect();

  document.getElementById('citaPaciente').value = cita.paciente_id;
  document.getElementById('citaFecha').value = normalizarFechaCita(cita.fecha);
  document.getElementById('citaHora').value = formatearHora(cita.hora);
  document.getElementById('citaMotivo').value = cita.motivo || '';
  document.getElementById('citaNota').value = cita.nota || '';
  abrirFormularioCita();
}
