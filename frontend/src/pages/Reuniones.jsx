import Table from "@components/Table";
import useReuniones from "@hooks/reuniones/useGetReuniones.jsx";
import Search from "../components/Search";
import PopupReuniones from "../components/PopupReuniones";
import DeleteIcon from "../assets/deleteIcon.svg";
import UpdateIcon from "../assets/updateIcon.svg";
import UpdateIconDisable from "../assets/updateIconDisabled.svg";
import DeleteIconDisable from "../assets/deleteIconDisabled.svg";
import { useCallback, useState } from "react";
import "@styles/reuniones.css";
import useEditReunion from "@hooks/reuniones/useEditReunion";
import useDeleteReunion from "@hooks/reuniones/useDeleteReunion";
import { createReunion } from "@services/reuniones.service.js";

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
        console.log("🔍 Reunión seleccionada:", selectedReuniones);
        setSelectedReunion(selectedReuniones.length > 0 ? selectedReuniones[0] : null);
    }, []);

    const handleEliminarReunion = () => {
        if (!selectedReunion) return;
        console.log(`🗑️ Eliminando reunión con ID: ${selectedReunion.id}`);
        handleDelete(selectedReunion.id);
    };

    const handleOpenPopup = (editing) => {
        setIsEditing(editing);
        setShowPopup(true);
        console.log(`🖊️ Abriendo popup para ${editing ? "editar" : "registrar"} reunión`);
    };

    const handleSubmit = async (formData) => {
        if (isEditing) {
            console.log(`📤 Enviando actualización para reunión con ID: ${selectedReunion.id}`, formData);
            handleUpdate(selectedReunion.id, formData);
        } else {
            console.log("📤 Creando nueva reunión:", formData);
            const newReunion = await createReunion(formData);
            if (newReunion) {
                setReuniones([...reuniones, newReunion]);

                // ✅ Subir acta solo después de que la reunión tenga un ID
                if (formData.acta) {
                    const fileFormData = new FormData();
                    fileFormData.append("acta", formData.acta);
                    
                    fetch(`/api/reuniones/${newReunion.id}/acta`, {
                        method: "POST",
                        body: fileFormData,
                    })
                    .then(response => response.json())
                    .then(data => console.log("📂 Acta subida correctamente:", data))
                    .catch(error => console.error("❌ Error al subir acta:", error));
                }
            }
        }
        setShowPopup(false);
    };

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
                    ? `<a href="/${actaUrl}" target="_blank">Ver Acta</a>`  // ✅ Enlace al PDF
                    : "No disponible";
            }
        }
    ];

    return (
        <div className="main-container">
            <div className="table-container">
                <div className="top-table">
                    <h1 className="title-table">Reuniones</h1>
                    <div className="filter-actions">
                        <Search value={filterNombre} onChange={handleNombreFilterChange} placeholder={"Filtrar por nombre"} />
                        <button onClick={() => handleOpenPopup(true)} disabled={!selectedReunion}>
                            {!selectedReunion ? <img src={UpdateIconDisable} alt="edit-disabled" /> : <img src={UpdateIcon} alt="edit" />}
                        </button>
                        <button className="delete-reunion-button" disabled={!selectedReunion} onClick={handleEliminarReunion}>
                            {!selectedReunion ? <img src={DeleteIconDisable} alt="delete-disabled" /> : <img src={DeleteIcon} alt="delete" />}
                        </button>
                        <button className="add-reunion-button" onClick={() => handleOpenPopup(false)}>Registrar Reunión</button>
                    </div>
                </div>
                <Table data={reuniones} columns={columns} onSelectionChange={handleSelectionChange} />
            </div>
            <PopupReuniones show={showPopup} setShow={setShowPopup} data={isEditing ? [selectedReunion] : []} action={handleSubmit} isEditing={isEditing} />
        </div>
    );
};

export default Reuniones;
