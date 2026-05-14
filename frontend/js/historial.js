// HISTORIAL MÉDICO
document.addEventListener('DOMContentLoaded', () => {
  const modalHistorial = document.getElementById('modalHistorial');
  if (modalHistorial) {
    modalHistorial.style.display = 'none';
  }
});

function historialValor(id) {
  return String(document.getElementById(id)?.value || '').trim();
}

function formatearFechaHistorial(fecha) {
  if (!fecha) return 'Sin fecha';
  const fechaISO = String(fecha).slice(0, 10);
  const date = new Date(`${fechaISO}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? fechaISO
    : date.toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' });
}

function pacienteActual() {
  return listaPacientes.find(p => p.id === window.pacienteActualId);
}

async function guardarHistorial() {
  const errores = [];
  const fecha = historialValor('fecha');
  const sintomas = historialValor('sintomas');
  const diagnostico = historialValor('diagnosticoHist');
  const tratamiento = historialValor('tratamiento');

  if (!fecha) errores.push('La fecha es obligatoria');
  if (!sintomas) errores.push('Los síntomas son obligatorios');
  if (!diagnostico) errores.push('El diagnóstico es obligatorio');
  if (!tratamiento) errores.push('El tratamiento es obligatorio');

  if (errores.length > 0) {
    alert('Por favor, completa todos los campos requeridos:\n' + errores.join('\n'));
    return;
  }

  if (!window.pacienteActualId) {
    alert('No hay paciente seleccionado');
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const paciente = pacienteActual();

    const res = await fetch('http://localhost:3000/api/historial', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify({
        paciente_id: window.pacienteActualId,
        fecha,
        sintomas,
        diagnostico,
        tratamiento,
        paciente_nombre: paciente?.nombre || 'Desconocido'
      })
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Error al guardar historial');
    }

    alert('Historial guardado correctamente');
    await cargarHistorial(window.pacienteActualId);
    limpiarHistorial(false);
  } catch (error) {
    console.error(error);
    alert('Error al guardar historial: ' + error.message);
  }
}

function limpiarHistorial(limpiarPaciente = true) {
  document.getElementById('fecha').value = '';
  document.getElementById('sintomas').value = '';
  document.getElementById('diagnosticoHist').value = '';
  document.getElementById('tratamiento').value = '';
  if (limpiarPaciente) document.getElementById('paciente').value = '';
}

async function cargarHistorial(pacienteId) {
  const contenedor = document.getElementById('listaHistorial');
  const resumen = document.getElementById('historialResumen');
  contenedor.innerHTML = '<p class="empty-state">Cargando historial...</p>';

  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:3000/api/historial/${pacienteId}`, {
      headers: { Authorization: 'Bearer ' + token }
    });

    if (!res.ok) throw new Error('Error al cargar historial');

    const data = await res.json();
    const historial = Array.isArray(data)
      ? data.sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)))
      : [];

    renderizarResumenHistorial(historial, resumen);
    renderizarHistorial(historial, contenedor);
  } catch (error) {
    console.error(error);
    contenedor.innerHTML = '<p class="empty-state error">Error al cargar historial</p>';
  }
}

function renderizarResumenHistorial(historial, resumen) {
  if (!resumen) return;

  const ultima = historial[0];
  resumen.innerHTML = `
    <article>
      <span>Registros</span>
      <strong>${historial.length}</strong>
    </article>
    <article>
      <span>Última atención</span>
      <strong>${ultima ? formatearFechaHistorial(ultima.fecha) : 'Sin datos'}</strong>
    </article>
    <article>
      <span>Último diagnóstico</span>
      <strong>${ultima?.diagnostico || 'Sin datos'}</strong>
    </article>
  `;
}

function renderizarHistorial(historial, contenedor) {
  if (!historial.length) {
    contenedor.innerHTML = '<p class="empty-state">Este paciente todavía no tiene historial clínico</p>';
    return;
  }

  contenedor.innerHTML = historial.map(item => `
    <article class="card-historial">
      <div class="historial-date">${formatearFechaHistorial(item.fecha)}</div>
      <div class="historial-body">
        <strong>${item.diagnostico || 'Diagnóstico sin registrar'}</strong>
        <p><span>Síntomas:</span> ${item.sintomas || 'Sin datos'}</p>
        <p><span>Tratamiento:</span> ${item.tratamiento || 'Sin datos'}</p>
        <p><span>Paciente:</span> ${item.paciente_nombre || document.getElementById('paciente').value}</p>
      </div>
    </article>
  `).join('');
}

function abrirHistorial(pacienteId) {
  window.pacienteActualId = pacienteId;

  const paciente = listaPacientes.find(p => p.id === pacienteId);
  if (paciente) {
    document.getElementById('paciente').value = paciente.nombre;
  }

  document.getElementById('modalHistorial').style.display = 'block';
  cargarHistorial(pacienteId);
}

function cerrarHistorial() {
  document.getElementById('modalHistorial').style.display = 'none';
  limpiarHistorial();
  document.getElementById('historialResumen').innerHTML = '';
  document.getElementById('listaHistorial').innerHTML = '';
  window.pacienteActualId = null;
}
