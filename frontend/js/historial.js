// HISTORIAL MÉDICO 
async function guardarHistorial() {
  try {
    const fecha = document.getElementById("fecha").value;
    const sintomas = document.getElementById("sintomas").value;
    const diagnostico = document.getElementById("diagnosticoHist").value;
    const tratamiento = document.getElementById("tratamiento").value;
    console.log(req.body);
   

    if (!fecha) errores.push("La fecha es obligatoria");
    if (!sintomas) errores.push("Los síntomas son obligatorios");
    if (!diagnostico) errores.push("El diagnóstico es obligatorio");
    if (!tratamiento) errores.push("El tratamiento es obligatorio");

    if (errores.length > 0) {
      alert("Por favor, completa todos los campos requeridos:\n" + errores.join("\n"));
      return;
    }

    // ⚠️ IMPORTANTE: debes tener este ID guardado
    if (!window.pacienteActualId) {
      alert("No hay paciente seleccionado");
      return;
    }

    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3000/api/historial", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({
        paciente_id: window.pacienteActualId,
        fecha,
        sintomas,
        diagnostico,
        tratamiento,
        paciente_nombre: paciente
      })
    });

    if (!res.ok) {
      throw new Error("Error al guardar historial");
    }

    alert("Historial guardado correctamente");

    cargarHistorial(window.pacienteActualId); // recarga lista
    limpiarHistorial();
  } catch (error) {
    console.error(error);
    alert("Error al guardar historial");
  }
}
// LIMPIAR FORMULARIO DE HISTORIAL
function limpiarHistorial() {
  document.getElementById("fecha").value = "";
  document.getElementById("sintomas").value = "";
  document.getElementById("diagnosticoHist").value = "";
  document.getElementById("tratamiento").value = "";
  document.getElementById("paciente").value = ""; 
}
// CARGAR HISTORIAL DE UN PACIENTE
async function cargarHistorial(pacienteId) {
  const contenedor = document.getElementById("listaHistorial");
  contenedor.innerHTML = "Cargando...";

  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:3000/api/historial/${pacienteId}`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    const data = await res.json();

    contenedor.innerHTML = "";

    data.forEach(h => {
      contenedor.innerHTML += `
        <div class="card-historial">
          <strong>${h.fecha}</strong><br>
          Síntomas: ${h.sintomas}<br>
          Diagnóstico: ${h.diagnostico}<br>
          Tratamiento: ${h.tratamiento}
          Paciente: ${h.paciente_nombre}
        </div>
      `;
    }); 

  } catch (error) {
    contenedor.innerHTML = "Error al cargar historial";
  }
}
// ABRIR MODAL DE HISTORIAL
function abrirHistorial(pacienteId) {
  window.pacienteActualId = pacienteId; // 👈 GUARDAMOS EL ID

  // Obtener el paciente para mostrar su nombre
  const paciente = listaPacientes.find(p => p.id === pacienteId);
  if (paciente) {
    document.getElementById("paciente").value = paciente.nombre;
  }

  document.getElementById("modalHistorial").style.display = "block";
  cargarHistorial(pacienteId);
}

// CERRAR MODAL DE HISTORIAL
function cerrarHistorial() {
  document.getElementById("modalHistorial").style.display = "none";
  limpiarHistorial();
  window.pacienteActualId = null;
}