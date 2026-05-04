// GESTIÓN DE CITAS

let citasLista = [];

// CARGAR CITAS
async function cargarCitas() {
  const contenedor = document.getElementById('citasLista');
  contenedor.innerHTML = 'Cargando citas...';

  try {
    const token = localStorage.getItem('token');
    
    const res = await fetch('http://localhost:3000/api/citas', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    if (!res.ok) {
      throw new Error('Error al cargar citas');
    }

    citasLista = await res.json();
    mostrarCitas();

  } catch (error) {
    console.error(error);
    contenedor.innerHTML = '<p style="color: #ef4444; text-align: center;">Error al cargar citas</p>';
  }
}

// MOSTRAR CITAS
function mostrarCitas() {
  const contenedor = document.getElementById('citasLista');
  
  if (citasLista.length === 0) {
    contenedor.innerHTML = '<p style="text-align: center; color: #10b981; padding: 2rem;">No hay citas programadas</p>';
    return;
  }

  // Ordenar por fecha
  const citasOrdenadas = [...citasLista].sort((a, b) => 
    new Date(a.fecha + ' ' + a.hora) - new Date(b.fecha + ' ' + b.hora)
  );

  contenedor.innerHTML = '';

  citasOrdenadas.forEach(cita => {
    const fecha = new Date(cita.fecha);
    const fechaFormato = fecha.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const estaProxima = new Date(cita.fecha + ' ' + cita.hora) > new Date();
    const estado = estaProxima ? 'Próxima' : 'Completada';
    const colorEstado = estaProxima ? '#10b981' : '#6b7280';

    contenedor.innerHTML += `
      <div class="cita-card" style="border-left-color: ${colorEstado};">
        <div class="cita-header">
          <h3>${cita.paciente_nombre || 'Paciente #' + cita.paciente_id}</h3>
          <span class="cita-estado" style="background: ${colorEstado};">${estado}</span>
        </div>
        <div class="cita-details">
          <p><strong>📅 Fecha:</strong> ${fechaFormato}</p>
          <p><strong>⏰ Hora:</strong> ${cita.hora}</p>
          <p><strong>🏥 Motivo:</strong> ${cita.motivo}</p>
          ${cita.nota ? `<p><strong>📝 Nota:</strong> ${cita.nota}</p>` : ''}
        </div>
        <div class="cita-acciones">
          <button onclick="editarCita(${cita.id})" class="btn-small">✏️ Editar</button>
          <button onclick="eliminarCita(${cita.id})" class="btn-small" style="background: #ef4444;">🗑️ Eliminar</button>
        </div>
      </div>
    `;
  });
}

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

// CERRAR MODAL CITAS
function cerrarModalCitas() {
  document.getElementById('modalCitas').style.display = 'none';
}

// GUARDAR CITA
async function guardarCita() {
  const paciente_id = document.getElementById('citaPaciente').value;
  const fecha = document.getElementById('citaFecha').value;
  const hora = document.getElementById('citaHora').value;
  const motivo = document.getElementById('citaMotivo').value;
  const nota = document.getElementById('citaNota').value;

  // Validaciones
  if (!paciente_id || !fecha || !hora || !motivo) {
    alert('Por favor completa todos los campos requeridos');
    return;
  }

  try {
    const token = localStorage.getItem('token');

    const res = await fetch('http://localhost:3000/api/citas', {
      method: 'POST',
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

    if (!res.ok) {
      throw new Error('Error al guardar cita');
    }

    alert('Cita guardada correctamente');
    cerrarModalCitas();
    cargarCitas();

  } catch (error) {
    console.error(error);
    alert('Error al guardar cita');
  }
}

// ELIMINAR CITA
async function eliminarCita(citaId) {
  if (!confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
    return;
  }

  try {
    const token = localStorage.getItem('token');

    const res = await fetch(`http://localhost:3000/api/citas/${citaId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    if (!res.ok) {
      throw new Error('Error al eliminar cita');
    }

    alert('Cita eliminada correctamente');
    cargarCitas();

  } catch (error) {
    console.error(error);
    alert('Error al eliminar cita');
  }
}

// EDITAR CITA
async function editarCita(citaId) {
  const cita = citasLista.find(c => c.id === citaId);
  if (!cita) return;

  // Llenar formulario
  document.getElementById('citaPaciente').value = cita.paciente_id;
  document.getElementById('citaFecha').value = cita.fecha;
  document.getElementById('citaHora').value = cita.hora;
  document.getElementById('citaMotivo').value = cita.motivo;
  document.getElementById('citaNota').value = cita.nota || '';

  document.getElementById('modalCitas').style.display = 'flex';
}
