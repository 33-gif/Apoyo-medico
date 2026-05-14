// Verificar autenticación y permisos
window.addEventListener("DOMContentLoaded", () => {
  checkAdminAuth();
  cargarUsuarios();
});

let usuarioEnEdicion = null;
let usuariosLista = [];

async function cargarUsuarios() {
  try {
    const usuarios = await usuariosService.obtenerUsuarios();
    usuariosLista = Array.isArray(usuarios) ? usuarios : [];
    actualizarResumenRoles();
    renderizarTablaUsuarios(usuariosLista);
  } catch (error) {
    console.error("Error cargando usuarios:", error);
    showAlert("Error al cargar usuarios", "error");
  }
}

function renderizarTablaUsuarios(usuarios) {
  const tbody = document.getElementById("tablaUsuarios");
  tbody.innerHTML = "";

  if (!usuarios.length) {
    tbody.innerHTML = '<tr><td colspan="5" class="table-empty">No hay usuarios para mostrar</td></tr>';
    return;
  }

  usuarios.forEach((usuario) => {
    const tr = document.createElement("tr");
    const usuarioData = encodeURIComponent(JSON.stringify(usuario));
    tr.innerHTML = `
      <td>${usuario.id}</td>
      <td>${usuario.nombre}</td>
      <td>${usuario.email}</td>
      <td><span class="badge badge-${usuario.rol}">${usuario.rol}</span></td>
      <td>
        <button class="btn-small" data-user="${usuarioData}" onclick="editarUsuarioDesdeBoton(this)">Editar</button>
        <button class="btn-small btn-danger" onclick="confirmarEliminar(${usuario.id})">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function editarUsuarioDesdeBoton(boton) {
  const usuario = JSON.parse(decodeURIComponent(boton.dataset.user));
  editarUsuario(usuario.id, usuario.nombre, usuario.email, usuario.rol);
}

function actualizarResumenRoles() {
  const conteo = usuariosLista.reduce((acc, usuario) => {
    acc[usuario.rol] = (acc[usuario.rol] || 0) + 1;
    return acc;
  }, {});

  actualizarTextoAdmin("totalUsuarios", usuariosLista.length);
  actualizarTextoAdmin("totalAdmins", conteo.admin || 0);
  actualizarTextoAdmin("totalDoctores", conteo.doctor || 0);
  actualizarTextoAdmin("totalRecepcionistas", conteo.recepcionista || 0);
}

function actualizarTextoAdmin(id, valor) {
  const elemento = document.getElementById(id);
  if (elemento) elemento.textContent = valor;
}

function filtrarUsuarios() {
  const texto = String(document.getElementById("buscarUsuario")?.value || "").toLowerCase();
  const rol = document.getElementById("filtroRolUsuario")?.value || "";

  const filtrados = usuariosLista.filter(usuario => {
    const coincideTexto = !texto ||
      String(usuario.nombre || "").toLowerCase().includes(texto) ||
      String(usuario.email || "").toLowerCase().includes(texto);
    const coincideRol = !rol || usuario.rol === rol;
    return coincideTexto && coincideRol;
  });

  renderizarTablaUsuarios(filtrados);
}

function abrirFormularioUsuario() {
  usuarioEnEdicion = null;
  document.getElementById("tituloModalUsuario").textContent = "Nuevo Usuario";
  document.getElementById("usuarioNombre").value = "";
  document.getElementById("usuarioEmail").value = "";
  document.getElementById("usuarioPassword").value = "";
  document.getElementById("usuarioPassword").style.display = "block";
  document.getElementById("usuarioRol").value = "recepcionista";
  document.getElementById("modalUsuario").style.display = "flex";
}

function editarUsuario(id, nombre, email, rol) {
  usuarioEnEdicion = id;
  document.getElementById("tituloModalUsuario").textContent = "Editar Usuario";
  document.getElementById("usuarioNombre").value = nombre;
  document.getElementById("usuarioEmail").value = email;
  document.getElementById("usuarioPassword").value = "";
  document.getElementById("usuarioPassword").style.display = "none";
  document.getElementById("usuarioRol").value = rol;
  document.getElementById("modalUsuario").style.display = "flex";
}

async function guardarUsuario() {
  const nombre = document.getElementById("usuarioNombre").value;
  const email = document.getElementById("usuarioEmail").value;
  const password = document.getElementById("usuarioPassword").value;
  const rol = document.getElementById("usuarioRol").value;

  if (!nombre || !email || !rol) {
    showAlert("Complete todos los campos requeridos", "error");
    return;
  }

  if (!usuarioEnEdicion && !password) {
    showAlert("La contraseña es requerida para nuevos usuarios", "error");
    return;
  }

  try {
    let resultado;
    if (usuarioEnEdicion) {
      resultado = await usuariosService.actualizarUsuario(usuarioEnEdicion, {
        nombre,
        email,
        rol,
      });
    } else {
      resultado = await usuariosService.crearUsuario(nombre, email, password, rol);
    }

    if (resultado.error) {
      showAlert(resultado.error, "error");
    } else {
      showAlert(
        usuarioEnEdicion ? "Usuario actualizado" : "Usuario creado",
        "success"
      );
      cerrarModalUsuario();
      cargarUsuarios();
    }
  } catch (error) {
    console.error("Error guardando usuario:", error);
    showAlert("Error al guardar usuario", "error");
  }
}

function cerrarModalUsuario() {
  document.getElementById("modalUsuario").style.display = "none";
  usuarioEnEdicion = null;
}

async function confirmarEliminar(id) {
  if (
    confirm(
      "¿Está seguro que desea eliminar este usuario? Esta acción no se puede deshacer."
    )
  ) {
    try {
      const resultado = await usuariosService.eliminarUsuario(id);
      if (resultado.error) {
        showAlert(resultado.error, "error");
      } else {
        showAlert("Usuario eliminado", "success");
        cargarUsuarios();
      }
    } catch (error) {
      console.error("Error eliminando usuario:", error);
      showAlert("Error al eliminar usuario", "error");
    }
  }
}

function switchAdminTab(tabName, evt) {
  const tabs = document.querySelectorAll(".tab-content");
  const btns = document.querySelectorAll(".tab-btn");

  tabs.forEach((tab) => tab.classList.remove("active"));
  btns.forEach((btn) => btn.classList.remove("active"));

  document.getElementById(`tab-${tabName}`).classList.add("active");
  if (evt?.currentTarget) evt.currentTarget.classList.add("active");
}
