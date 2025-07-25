import { useNavigate } from "react-router-dom";
import Table from "@components/Table";
import useReuniones from "@hooks/reuniones/useGetReuniones.jsx";
import Search from "../components/Search";
import PopupReuniones from "../components/PopupReuniones";
import { useCallback, useState } from "react";
import { useEffect } from "react";
import "../styles/reuniones.css";
import useEditReunion from "@hooks/reuniones/useEditReunion";
import useDeleteReunion from "@hooks/reuniones/useDeleteReunion";
import { createReunion } from "@services/reuniones.service.js";
import { showErrorAlert, showSuccessAlert } from "@helpers/sweetAlert.js";
import Swal from "sweetalert2";
import { buildApiEndpoint, buildFileUrl } from "@helpers/urlHelper";
import { useAuth } from "@context/AuthContext";
import cookies from "js-cookie";

const Reuniones = () => {
  const { user } = useAuth();
  const { reuniones, cargarReuniones, setReuniones } = useReuniones();
    useEffect(() => {
  if (user.rol?.toLowerCase() === "administrador") {
    cargarReuniones();
  }
}, []);
  const [filterNombre, setFilterNombre] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedReunion, setSelectedReunion] = useState(null);
  const [descripcionSeleccionada, setDescripcionSeleccionada] = useState("");
  const [mostrarDescripcion, setMostrarDescripcion] = useState(false);

  const { handleUpdate } = useEditReunion(setReuniones);
  const { handleDelete } = useDeleteReunion(cargarReuniones, setSelectedReunion);

  const handleNombreFilterChange = (e) => setFilterNombre(e.target.value);
  const handleSelectionChange = useCallback((sel) => setSelectedReunion(sel[0] || null), []);
  const handleEliminarReunion = async () => {
  if (!selectedReunion) return;

  const resultado = await Swal.fire({
    title: "¿Eliminar reunión?",
    text: "Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#d33",
    cancelButtonColor: "#2376ec",
  });

  if (!resultado.isConfirmed) return;

  handleDelete(selectedReunion.id);
};

  const handleOpenPopup = (editing) => { setIsEditing(editing); setShowPopup(true); };

const handleSubmit = async (formData) => {
  const hoy = new Date();
  const fechaIngresada = new Date(formData.fecha);

  if (fechaIngresada < hoy.setHours(0, 0, 0, 0)) {
    showErrorAlert("Fecha inválida", "No se puede agendar una reunión anterior a hoy.");
    return;
  }

  const fechaIngresadaISO = fechaIngresada.toISOString();

  
  const yaExisteReunion = reuniones.some((r) => {
    return new Date(r.fecha).toISOString() === fechaIngresadaISO;
  });

  if (yaExisteReunion) {
    showErrorAlert("Fecha duplicada", "Ya existe una reunión registrada en esa misma fecha y hora.");
    return;
  }

  if (isEditing) {
    handleUpdate(selectedReunion.id, formData);
    setShowPopup(false);
  } else {
    const [newReunion, error] = await createReunion(formData);

    if (error) {
      showErrorAlert("Error", error);
      return;
    }

    setReuniones([...reuniones, newReunion]);

    const token = document.cookie.split("; ").find(row => row.startsWith("jwt="))?.split("=")[1];

    if (formData.acta && token) {
      const fileFormData = new FormData();
      fileFormData.append("acta", formData.acta);

      fetch(buildApiEndpoint(`/reuniones/${newReunion.id}/acta`), {
        method: "POST",
        body: fileFormData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then(() => cargarReuniones())
        .catch((error) => console.error("❌ Error al subir acta:", error));
    }

    showSuccessAlert("¡Guardado!", "Reunión creada exitosamente");
    setShowPopup(false);
  }
};

      const handleFileChange = async (event, reunionId) => {
    const file = event.target.files[0];
    if (!file) return;

    const token = cookies.get("jwt-auth");
    if (!token) {
      
      return showErrorAlert("Acceso denegado", "Tu sesión ha expirado. Inicia sesión nuevamente.");
    }

    const fileFormData = new FormData();
    fileFormData.append("acta", file);

    try {
      const response = await fetch(buildApiEndpoint(`/reuniones/${reunionId}/acta`), {
        method: "POST",
        body: fileFormData,
        headers: {
          Authorization: `Bearer ${token}`
        },
        credentials: "include"
      });

      if (!response.ok) {
        
        throw new Error("Error al subir acta");
      }

      cargarReuniones();
      showSuccessAlert("Acta subida", "El archivo fue adjuntado correctamente.");
    } catch (error) {
      showErrorAlert("Error", "No se pudo subir el acta.");
    }
  };

  const handleEliminarActa = async (reunionId) => {
    const resultado = await Swal.fire({
      title: "¿Eliminar acta?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#2376ec",
    });

    if (!resultado.isConfirmed) return;

    try {
      const response = await fetch(buildApiEndpoint(`/reuniones/${reunionId}/acta`), {
        method: "DELETE",
        credentials: "include"
      });

      if (!response.ok) throw new Error("Error al eliminar acta");

      cargarReuniones();
      showSuccessAlert("¡Acta eliminada!", "Se eliminó correctamente.");
    } catch (error) {
      
      showErrorAlert("Error", "No se pudo eliminar el acta");
    }
  };

  window.handleFileChange = handleFileChange;
  window.handleEliminarActa = handleEliminarActa;
  window.verDescripcionCompleta = (texto) => {
    setDescripcionSeleccionada(texto);
    setMostrarDescripcion(true);
  };


  if (user.rol?.toLowerCase() === "usuario") {
  const columnsUsuario = [
    { title: "Nombre", field: "nombre", headerSort: true },

    {
      title: "Fecha",
      field: "fecha",
      formatter: (cell) => {
        const raw = cell.getValue();
        const fecha = new Date(raw);
        return fecha.toLocaleString("es-CL", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      },
      headerSort: true,
    },

    {
      title: "Lugar",
      field: "lugar",
      formatter: (cell) => cell.getValue() || "—",
      headerSort: true,
    },

    {
      title: "Descripción",
      field: "descripcion",
      formatter: (cell) => {
        const texto = cell.getValue();
        return texto?.length > 40
          ? `<button onclick="verDescripcionCompleta('${texto.replace(/'/g, "\\'")}')" style="color:#2376ec;">Ver más</button>`
          : texto || "—";
      },
      headerSort: false,
    },

    {
      title: "Acta",
      field: "acta",
      width: 250,
      responsive: 2,
      sorter: false,
      formatter: (cell) => {
        const actaUrl = cell.getValue();
        if (!actaUrl) return "Sin acta";

        const link = buildFileUrl(actaUrl);
        return `<a href="${link}" target="_blank" rel="noopener noreferrer" class="descargar-acta">📄 Descargar Acta</a>`;
      },
    },



    ];

    return (
  <div className="main-container">
    <div className="table-container">
      <div className="top-table">
        <h2 className="title-table">Mis reuniones</h2>
      </div>

      <Table
        data={reuniones}
        columns={columnsUsuario}
        filter={filterNombre}
        dataToFilter={"nombre"}
        initialSortName={"fecha"}
      />
    </div>
        {mostrarDescripcion && (
          <div className="descripcion-modal">
            <div className="descripcion-contenido">
              <h3>Descripción completa</h3>
              <p>{descripcionSeleccionada}</p>
              <button className="acta-btn" onClick={() => setMostrarDescripcion(false)}>Cerrar</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  const columns = [
    { title: "Nombre", field: "nombre", headerSort: true },
    {
      title: "Fecha",
      field: "fecha",
      formatter: (cell) => {
        const raw = cell.getValue();
        const fecha = new Date(raw);
        return fecha.toLocaleString("es-CL", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      },
      headerSort: true,
    },
    { title: "Lugar", field: "lugar", formatter: (cell) => cell.getValue() || "—", headerSort: true },
    {
      title: "Descripción",
      field: "descripcion",
      formatter: (cell) => {
        const texto = cell.getValue();
        return texto?.length > 40
          ? `<button onclick="verDescripcionCompleta('${texto.replace(/'/g, "\\'")}')" style="color:#2376ec;">Ver más</button>`
          : texto || "—";
      },
      headerSort: false,
    },
        {
        title: "Acta",
        field: "acta",
        formatter: (cell) => {
          const reunion = cell.getData();
          const url = reunion.acta;
          const id = reunion.id;

          if (url) {
            return `
              <a href="${buildFileUrl(url)}" target="_blank" style="color:#2376ec;">📄 Ver PDF</a>
              <button onclick="handleEliminarActa('${id}')" style="margin-left:6px;color:#d33;">🗑 Eliminar</button>
            `;
          }

          return `
            <div class="acta-card acta-flex">
              <input type="file" id="upload-${id}" style="display:none" accept=".pdf"
                onchange="handleFileChange(event, '${id}')" />
              <button class="acta-btn" onclick="document.getElementById('upload-${id}').click()">📎 Adjuntar Acta</button>
            </div>
          `;
        },
        headerSort: false,
        hozAlign: "center",
      }


  ];

  return (
  <div className="main-container">
    <div className="table-container">
      <div className="top-table">
        <h1 className="title-table">Reuniones</h1>
        {user.rol === "administrador" && (
          <div className="filter-actions">
  <Search
    value={filterNombre}
    onChange={handleNombreFilterChange}
    placeholder="Filtrar por nombre"
  />

            <button
              className="add-reunion-button"
              onClick={() => handleOpenPopup(false)}
            >
              Registrar reunión
            </button>

            <button
              className="edit-reunion-button"
              onClick={() => handleOpenPopup(true)}
              disabled={!selectedReunion}
            >
              Editar reunión
            </button>

            <button
              className="delete-reunion-button"
              onClick={handleEliminarReunion}
              disabled={!selectedReunion}
            >
              Eliminar reunión
            </button>
          </div>

        )}
      </div>

      <Table
        data={reuniones}
        columns={columns}
        filter={filterNombre}
        dataToFilter={"nombre"}
        initialSortName={"fecha"}
        onSelectionChange={handleSelectionChange}
      />
    </div>
      <PopupReuniones
      show={showPopup}
      setShow={setShowPopup}
      data={isEditing ? [selectedReunion] : []}
      action={handleSubmit}
      isEditing={isEditing}
      reuniones={reuniones}
    />


    {mostrarDescripcion && (
      <div className="descripcion-modal">
        <div className="descripcion-contenido">
          <h3>Descripción completa</h3>
          <p>{descripcionSeleccionada}</p>
          <button className="acta-btn" onClick={() => setMostrarDescripcion(false)}>Cerrar</button>
        </div>
      </div>
    )}
  </div>
);

};

export default Reuniones;
