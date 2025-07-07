import Table from "@components/Table";
import useReuniones from "@hooks/reuniones/useGetReuniones.jsx";
import Search from "../components/Search";
import PopupReuniones from "../components/PopupReuniones";
import { useCallback, useState } from "react";
import "../styles/reuniones.css";
import useEditReunion from "@hooks/reuniones/useEditReunion";
import useDeleteReunion from "@hooks/reuniones/useDeleteReunion";
import { createReunion } from "@services/reuniones.service.js";
import { showErrorAlert, showSuccessAlert } from "@helpers/sweetAlert.js";
import Swal from "sweetalert2";
import { buildApiEndpoint, buildFileUrl } from "@helpers/urlHelper";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const Reuniones = () => {
  const { reuniones, cargarReuniones, setReuniones } = useReuniones();
  const [filterNombre, setFilterNombre] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedReunion, setSelectedReunion] = useState(null);

  const { handleUpdate } = useEditReunion(setReuniones);
  const { handleDelete } = useDeleteReunion(cargarReuniones, setSelectedReunion);

  const handleNombreFilterChange = (e) => {
    setFilterNombre(e.target.value);
  };

  const handleSelectionChange = useCallback((selectedReuniones) => {
    setSelectedReunion(selectedReuniones.length > 0 ? selectedReuniones[0] : null);
  }, []);

  const handleEliminarReunion = () => {
    if (!selectedReunion) return;
    handleDelete(selectedReunion.id);
  };

  const handleOpenPopup = (editing) => {
    setIsEditing(editing);
    setShowPopup(true);
  };

  const handleSubmit = async (formData) => {
    const hoy = new Date();
    const fechaIngresada = new Date(formData.fecha);

    if (fechaIngresada < hoy.setHours(0, 0, 0, 0)) {
      showErrorAlert("Fecha inválida", "No se puede agendar una reunión en una fecha anterior a hoy.");
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

    const fileFormData = new FormData();
    fileFormData.append("acta", file);

    const token = document.cookie.split("; ").find(row => row.startsWith("jwt="))?.split("=")[1];

    try {
      const response = await fetch(buildApiEndpoint(`/reuniones/${reunionId}/acta`), {
        method: "POST",
        body: fileFormData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("❌ Error al subir acta");

      cargarReuniones();
    } catch (error) {
      console.error("❌ Error al subir acta:", error);
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

    const token = document.cookie.split("; ").find(row => row.startsWith("jwt="))?.split("=")[1];

    try {
      const response = await fetch(buildApiEndpoint(`/reuniones/${reunionId}/acta`), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("❌ Error al eliminar acta");

      cargarReuniones();
    } catch (error) {
      console.error("❌ Error al eliminar acta:", error);
      showErrorAlert("Error", "No se pudo eliminar el acta");
    }
  };

  window.handleFileChange = handleFileChange;
  window.handleEliminarActa = handleEliminarActa;

  const columns = [
    { title: "Nombre", field: "nombre", width: 350, responsive: 0 },
    { title: "Fecha", field: "fecha", width: 200, responsive: 2 },
    {
      title: "Acta",
      field: "acta",
      width: 200,
      responsive: 2,
      formatter: (cell) => {
        const actaUrl = cell.getValue();
        return actaUrl
          ? `<a href="${buildFileUrl(actaUrl)}" target="_blank">Ver Acta</a>`
          : "No disponible";
      },
    },
    {
      title: "Adjuntar Acta",
      field: "accionActa",
      width: 240,
      responsive: 2,
      sorter: false,
      formatter: (cell) => {
        const data = cell.getRow().getData();
        const reunionId = data.id;
        const tieneActa = Boolean(data.acta && data.acta.trim() !== "");

        if (!tieneActa) {
          return `
            <div class="acta-card acta-flex">
              <input type="file" id="upload-${reunionId}" style="display:none" accept=".pdf"
                onchange="window.handleFileChange(event, '${reunionId}')" />
              <button class="acta-btn" onclick="document.getElementById('upload-${reunionId}').click()">📎 Adjuntar Acta</button>
            </div>
          `;
        } else {
          return `
            <div class="acta-card acta-flex">
              <span class="acta-badge">✔ Acta adjuntada</span>
              <button class="acta-btn eliminar" onclick="window.handleEliminarActa('${reunionId}')">🗑 Eliminar Acta</button>
            </div>
          `;
        }
      },
    },
  ];

  return (
    <div className="main-container">
      <div className="table-container">
        <div className="top-table">
          <h1 className="title-table">Reuniones</h1>
          <div className="filter-actions">
            <Search
              value={filterNombre}
              onChange={handleNombreFilterChange}
              placeholder="Filtrar por nombre"
            />
            <button
              className="edit-reunion-button"
              onClick={() => handleOpenPopup(true)}
              disabled={!selectedReunion}
            >
              Editar
            </button>
            <button
              className="delete-reunion-button"
              disabled={!selectedReunion}
              onClick={handleEliminarReunion}
            >
              Eliminar
            </button>
            <button
              className="add-reunion-button"
              onClick={() => handleOpenPopup(false)}
            >
              Registrar Reunión
            </button>
          </div>
        </div>
        <Table
          data={reuniones}
          columns={columns}
          onSelectionChange={handleSelectionChange}
        />
      </div>
      <PopupReuniones
        show={showPopup}
        setShow={setShowPopup}
        data={isEditing ? [selectedReunion] : []}
        action={handleSubmit}
        isEditing={isEditing}
      />
    </div>
  );
};

export default Reuniones;
