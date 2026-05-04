// ESTADÍSTICAS DEL SISTEMA

async function cargarEstadisticas() {
  try {
    // Calcular estadísticas
    const total = listaPacientes.length;
    const hombres = listaPacientes.filter(p => p.sexo === 'Masculino').length;
    const mujeres = listaPacientes.filter(p => p.sexo === 'Femenino').length;
    
    // Edad promedio
    const edadPromedio = total > 0 
      ? Math.round(listaPacientes.reduce((sum, p) => sum + p.edad, 0) / total)
      : 0;

    // Actualizar cards
    document.getElementById('totalPacientes').innerText = total;
    document.getElementById('totalHombres').innerText = hombres;
    document.getElementById('totalMujeres').innerText = mujeres;
    document.getElementById('edadPromedio').innerText = edadPromedio;

    // Generar gráficos
    generarGraficoSexo();
    generarGraficoEdad();
    generarGraficoDiagnostico();

  } catch (error) {
    console.error('Error cargando estadísticas:', error);
  }
}

// GRÁFICO DE SEXO
function generarGraficoSexo() {
  const hombres = listaPacientes.filter(p => p.sexo === 'Masculino').length;
  const mujeres = listaPacientes.filter(p => p.sexo === 'Femenino').length;
  const otros = listaPacientes.filter(p => p.sexo !== 'Masculino' && p.sexo !== 'Femenino').length;

  const total = hombres + mujeres + otros || 1;
  const pctHombres = Math.round((hombres / total) * 100);
  const pctMujeres = Math.round((mujeres / total) * 100);
  const pctOtros = Math.round((otros / total) * 100);

  let html = `
    <div class="chart-bars">
      <div class="bar-item">
        <div class="bar-label">Masculino</div>
        <div class="bar-container">
          <div class="bar-fill" style="width: ${pctHombres}%; background: #3b82f6;"></div>
        </div>
        <div class="bar-value">${hombres} (${pctHombres}%)</div>
      </div>
      <div class="bar-item">
        <div class="bar-label">Femenino</div>
        <div class="bar-container">
          <div class="bar-fill" style="width: ${pctMujeres}%; background: #ec4899;"></div>
        </div>
        <div class="bar-value">${mujeres} (${pctMujeres}%)</div>
      </div>
      ${otros > 0 ? `
      <div class="bar-item">
        <div class="bar-label">Otros</div>
        <div class="bar-container">
          <div class="bar-fill" style="width: ${pctOtros}%; background: #f59e0b;"></div>
        </div>
        <div class="bar-value">${otros} (${pctOtros}%)</div>
      </div>
      ` : ''}
    </div>
  `;

  document.getElementById('chartSexo').innerHTML = html;
}

// GRÁFICO DE EDAD
function generarGraficoEdad() {
  // Agrupar por rangos de edad
  const rangos = {
    '0-18': 0,
    '19-30': 0,
    '31-45': 0,
    '46-60': 0,
    '60+': 0
  };

  listaPacientes.forEach(p => {
    if (p.edad < 19) rangos['0-18']++;
    else if (p.edad < 31) rangos['19-30']++;
    else if (p.edad < 46) rangos['31-45']++;
    else if (p.edad < 61) rangos['46-60']++;
    else rangos['60+']++;
  });

  const maxRango = Math.max(...Object.values(rangos)) || 1;
  const total = listaPacientes.length || 1;

  let html = '<div class="chart-bars">';
  Object.entries(rangos).forEach(([rango, cantidad]) => {
    const porcentaje = Math.round((cantidad / total) * 100);
    const width = (cantidad / maxRango) * 100;
    html += `
      <div class="bar-item">
        <div class="bar-label">${rango} años</div>
        <div class="bar-container">
          <div class="bar-fill" style="width: ${width}%; background: #10b981;"></div>
        </div>
        <div class="bar-value">${cantidad} (${porcentaje}%)</div>
      </div>
    `;
  });
  html += '</div>';

  document.getElementById('chartEdad').innerHTML = html;
}

// GRÁFICO DE DIAGNÓSTICOS
function generarGraficoDiagnostico() {
  // Contar diagnósticos
  const diagnosticos = {};
  listaPacientes.forEach(p => {
    if (p.diagnostico) {
      diagnosticos[p.diagnostico] = (diagnosticos[p.diagnostico] || 0) + 1;
    }
  });

  // Ordenar y tomar top 5
  const sorted = Object.entries(diagnosticos)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (sorted.length === 0) {
    document.getElementById('chartDiagnostico').innerHTML = '<p style="text-align: center; color: #10b981;">Sin datos disponibles</p>';
    return;
  }

  const maxDiag = Math.max(...sorted.map(d => d[1])) || 1;
  const total = listaPacientes.length || 1;

  let html = '<div class="chart-bars">';
  sorted.forEach(([diag, cantidad]) => {
    const porcentaje = Math.round((cantidad / total) * 100);
    const width = (cantidad / maxDiag) * 100;
    const etiqueta = diag.length > 20 ? diag.substring(0, 20) + '...' : diag;
    html += `
      <div class="bar-item">
        <div class="bar-label" title="${diag}">${etiqueta}</div>
        <div class="bar-container">
          <div class="bar-fill" style="width: ${width}%; background: #f59e0b;"></div>
        </div>
        <div class="bar-value">${cantidad} (${porcentaje}%)</div>
      </div>
    `;
  });
  html += '</div>';

  document.getElementById('chartDiagnostico').innerHTML = html;
}
