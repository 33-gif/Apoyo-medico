
document.addEventListener("DOMContentLoaded", () => {
  checkAuth(); // Verificar que esté autenticado
  renderizarNavegacion(); // Renderizar menú según rol
  cargarPacientes(); // Cargar pacientes al abrir la página
  
  document.getElementById("buscador").addEventListener("input", filtrarPacientes);
});

function renderizarNavegacion() {
  const nav = document.getElementById('sidebarNav');
  const usuario = authService.getUser();
  if (!nav) return;
  
  let html = '';
  
  if (usuario && usuario.rol === 'admin') {
    html += `<a href="admin.html" class="menu-item">Administración</a>`;
  }
  
  nav.innerHTML = html;
}

// GESTIÓN DE TABS
async function switchTab(tabName, evt) {
  // Ocultar todos los tabs
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });

  // Sincronizar pestañas y navegación lateral
  document.querySelectorAll('.tab-btn, .sidebar-nav .menu-item').forEach(item => {
    item.classList.toggle('active', item.dataset.tab === tabName);
  });

  // Mostrar tab seleccionado
  document.getElementById(`tab-${tabName}`).classList.add('active');

  if (evt && evt.currentTarget && evt.currentTarget.dataset.tab) {
    evt.currentTarget.classList.add('active');
  }

  const sidebar = document.querySelector('.sidebar');
  if (sidebar) sidebar.classList.remove('menu-open');

  // Cargar datos específicos del tab
  if (tabName === 'estadisticas') {
    if (!Array.isArray(listaPacientes) || listaPacientes.length === 0) {
      await cargarPacientes();
    }
    cargarEstadisticas();
  } else if (tabName === 'citas') {
    await cargarCitas();
  }
}

// BÚSQUEDA AVANZADA
function aplicarFiltros() {
  const nombre = document.getElementById('filtroNombre').value.toLowerCase();
  const sexo = document.getElementById('filtroSexo').value;
  const edadMin = parseInt(document.getElementById('filtroEdadMin').value) || 0;
  const edadMax = parseInt(document.getElementById('filtroEdadMax').value) || 150;
  const diagnostico = document.getElementById('filtroDiagnostico').value.toLowerCase();

  const filtrados = listaPacientes.filter(p => {
    const cumpleNombre = p.nombre.toLowerCase().includes(nombre);
    const cumpleSexo = !sexo || p.sexo === sexo;
    const cumpleEdad = p.edad >= edadMin && p.edad <= edadMax;
    const cumpleDiag = diagnostico === '' || (p.diagnostico && p.diagnostico.toLowerCase().includes(diagnostico));

    return cumpleNombre && cumpleSexo && cumpleEdad && cumpleDiag;
  });

  mostrarResultadosFiltros(filtrados);
}

function mostrarResultadosFiltros(pacientes) {
  let tabla = document.getElementById('tablaResultados');
  tabla.innerHTML = '';

  if (pacientes.length === 0) {
    tabla.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem; color: #10b981;">No se encontraron pacientes con esos criterios</td></tr>';
    return;
  }

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

function limpiarFiltros() {
  document.getElementById('filtroNombre').value = '';
  document.getElementById('filtroSexo').value = '';
  document.getElementById('filtroEdadMin').value = '';
  document.getElementById('filtroEdadMax').value = '';
  document.getElementById('filtroDiagnostico').value = '';
  document.getElementById('tablaResultados').innerHTML = '';
}

// EXPORTAR A EXCEL
function exportarPacientes() {
  if (listaPacientes.length === 0) {
    alert('No hay pacientes para exportar');
    return;
  }

  // Crear CSV
  let csv = 'ID,Nombre,Documento,Edad,Sexo,Diagnóstico,Fecha Creación\n';

  listaPacientes.forEach(p => {
    csv += `${p.id},"${p.nombre}","${p.documento}",${p.edad},"${p.sexo}","${p.diagnostico || 'N/A'}","${p.created_at || 'N/A'}"\n`;
  });

  // Descargar archivo
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `pacientes_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  alert('Pacientes exportados a Excel correctamente');
}

// EXPORTAR A PDF
function exportarPDF() {
  if (listaPacientes.length === 0) {
    alert('No hay pacientes para exportar');
    return;
  }

  // Crear tabla HTML para PDF
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Reporte de Pacientes</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #10b981; text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        th { background: #10b981; color: white; }
        tr:nth-child(even) { background: #f9f9f9; }
        .fecha { text-align: right; font-size: 12px; color: #666; margin-top: 20px; }
      </style>
    </head>
    <body>
      <h1>📋 Reporte de Pacientes - Sistema Clínico</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Documento</th>
            <th>Edad</th>
            <th>Sexo</th>
            <th>Diagnóstico</th>
          </tr>
        </thead>
        <tbody>
  `;

  listaPacientes.forEach(p => {
    html += `
      <tr>
        <td>${p.id}</td>
        <td>${p.nombre}</td>
        <td>${p.documento}</td>
        <td>${p.edad}</td>
        <td>${p.sexo}</td>
        <td>${p.diagnostico || 'N/A'}</td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
      <div class="fecha">Generado el ${new Date().toLocaleString()}</div>
    </body>
    </html>
  `;

  // Abrir en nueva ventana e imprimir
  const ventana = window.open('', '', 'width=900,height=600');
  ventana.document.write(html);
  ventana.document.close();
  ventana.print();

  alert('PDF generado. Usa el diálogo de impresión para guardar como PDF');
}
