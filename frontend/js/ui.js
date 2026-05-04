function abrirFormulario() {
  pacienteEditando = null; // modo crear

  document.getElementById("modalPaciente").style.display = "block";

  document.getElementById("tituloModal").innerText = "Nuevo Paciente";
  document.getElementById("btnGuardar").innerText = "Guardar";

  limpiarFormulario();
}
function limpiarFormulario() {
  document.getElementById("nombre").value = "";
  document.getElementById("documento").value = "";
  document.getElementById("edad").value = "";
  document.getElementById("sexo").value = "";
  document.getElementById("diagnostico").value = "";
}

// Función para toggle del menú móvil
function toggleMenu() {
  const sidebar = document.querySelector('.sidebar');
  sidebar.classList.toggle('menu-open');
}

// Cerrar menú al hacer click fuera
document.addEventListener('click', function(event) {
  const sidebar = document.querySelector('.sidebar');
  const menuToggle = document.querySelector('.menu-toggle');

  if (!sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
    sidebar.classList.remove('menu-open');
  }
});