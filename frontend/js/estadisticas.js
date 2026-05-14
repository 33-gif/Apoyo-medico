// ESTADÍSTICAS DEL SISTEMA

function normalizarSexo(sexo) {
  const valor = String(sexo || '').trim().toLowerCase();
  if (['m', 'masculino', 'hombre'].includes(valor)) return 'Masculino';
  if (['f', 'femenino', 'mujer'].includes(valor)) return 'Femenino';
  return 'Otro';
}

function edadNumero(paciente) {
  const edad = Number(paciente.edad);
  return Number.isFinite(edad) && edad >= 0 ? edad : null;
}

function diagnosticoNormalizado(diagnostico) {
  return String(diagnostico || '').trim() || 'Sin diagnóstico';
}

function contarPor(lista, selector) {
  return lista.reduce((acc, item) => {
    const key = selector(item);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function porcentaje(cantidad, total) {
  return total > 0 ? Math.round((cantidad / total) * 100) : 0;
}

async function cargarEstadisticas() {
  try {
    const pacientes = Array.isArray(listaPacientes) ? listaPacientes : [];
    const edades = pacientes.map(edadNumero).filter(edad => edad !== null);
    const total = pacientes.length;
    const conteoSexo = contarPor(pacientes, paciente => normalizarSexo(paciente.sexo));
    const conteoDiagnostico = contarPor(pacientes, paciente => diagnosticoNormalizado(paciente.diagnostico));
    const diagnosticosValidos = Object.entries(conteoDiagnostico)
      .filter(([diagnostico]) => diagnostico !== 'Sin diagnóstico')
      .sort((a, b) => b[1] - a[1]);

    const edadPromedio = edades.length > 0
      ? Math.round(edades.reduce((sum, edad) => sum + edad, 0) / edades.length)
      : 0;

    actualizarTexto('totalPacientes', total);
    actualizarTexto('totalHombres', conteoSexo.Masculino || 0);
    actualizarTexto('totalMujeres', conteoSexo.Femenino || 0);
    actualizarTexto('edadPromedio', edadPromedio);
    actualizarTexto('pacientesMayores', edades.filter(edad => edad >= 60).length);
    actualizarTexto('diagnosticosUnicos', diagnosticosValidos.length);
    actualizarTexto('edadMinima', edades.length ? Math.min(...edades) : 0);
    actualizarTexto('edadMaxima', edades.length ? Math.max(...edades) : 0);
    actualizarTexto('diagnosticoFrecuente', diagnosticosValidos[0]?.[0] || 'Sin datos');

    generarGraficoSexo(conteoSexo, total);
    generarGraficoEdad(edades);
    generarGraficoDiagnostico(diagnosticosValidos, total);
  } catch (error) {
    console.error('Error cargando estadísticas:', error);
  }
}

function actualizarTexto(id, valor) {
  const elemento = document.getElementById(id);
  if (elemento) elemento.innerText = valor;
}

function renderBarChart(containerId, items, emptyMessage = 'Sin datos disponibles') {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!items.length) {
    container.innerHTML = `<p class="empty-state">${emptyMessage}</p>`;
    return;
  }

  const max = Math.max(...items.map(item => item.value), 1);
  container.innerHTML = `
    <div class="chart-bars">
      ${items.map(item => {
        const width = Math.max(4, Math.round((item.value / max) * 100));
        return `
          <div class="bar-item">
            <div class="bar-label" title="${item.label}">${item.label}</div>
            <div class="bar-container">
              <div class="bar-fill" style="width: ${width}%; background: ${item.color};"></div>
            </div>
            <div class="bar-value">${item.value} (${item.percent}%)</div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function generarGraficoSexo(conteoSexo, total) {
  const items = [
    { label: 'Masculino', value: conteoSexo.Masculino || 0, color: '#2563eb' },
    { label: 'Femenino', value: conteoSexo.Femenino || 0, color: '#db2777' },
    { label: 'Otro / sin dato', value: conteoSexo.Otro || 0, color: '#d97706' }
  ]
    .filter(item => item.value > 0)
    .map(item => ({ ...item, percent: porcentaje(item.value, total) }));

  renderBarChart('chartSexo', items);
}

function generarGraficoEdad(edades) {
  const rangos = [
    { label: '0-18 años', min: 0, max: 18, color: '#38bdf8' },
    { label: '19-30 años', min: 19, max: 30, color: '#0f9f8f' },
    { label: '31-45 años', min: 31, max: 45, color: '#2563eb' },
    { label: '46-60 años', min: 46, max: 60, color: '#7c3aed' },
    { label: '61+ años', min: 61, max: Infinity, color: '#d97706' }
  ];

  const items = rangos.map(rango => {
    const value = edades.filter(edad => edad >= rango.min && edad <= rango.max).length;
    return {
      label: rango.label,
      value,
      percent: porcentaje(value, edades.length),
      color: rango.color
    };
  });

  renderBarChart('chartEdad', items, 'No hay edades registradas');
}

function generarGraficoDiagnostico(diagnosticosOrdenados, total) {
  const colores = ['#0f9f8f', '#2563eb', '#7c3aed', '#d97706', '#dc2626'];
  const items = diagnosticosOrdenados.slice(0, 5).map(([diagnostico, cantidad], index) => ({
    label: diagnostico.length > 28 ? `${diagnostico.slice(0, 28)}...` : diagnostico,
    value: cantidad,
    percent: porcentaje(cantidad, total),
    color: colores[index] || '#64748b'
  }));

  renderBarChart('chartDiagnostico', items);
}
