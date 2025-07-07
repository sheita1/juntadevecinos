import Table from '@components/Table';
import useVecinos from '@hooks/vecinos/useGetVecinos.jsx';
import Search from '../components/Search';
import Popup from '../components/PopupVecinos';
import FormRegistroVecino from '../components/FormRegistroVecino';
import { useCallback, useState } from 'react';
import "../styles/vecinos.css";
import useEditVecino from '@hooks/vecinos/useEditVecino';
import useDeleteVecino from '@hooks/vecinos/useDeleteVecino';
import { buildFileUrl } from '@helpers/urlHelper';

const Vecinos = () => {
  const { vecinos, fetchVecinos, setVecinos } = useVecinos();
  const [filterRut, setFilterRut] = useState('');
  const [showForm, setShowForm] = useState(false);  

  const {
    handleClickUpdate,
    handleUpdate,
    isPopupOpen,
    setIsPopupOpen,
    dataVecino,
    setDataVecino
  } = useEditVecino(setVecinos);

  const { handleDelete } = useDeleteVecino(fetchVecinos, setDataVecino);

  const handleRutFilterChange = (e) => {
    setFilterRut(e.target.value);
  };

  const handleSelectionChange = useCallback((selectedVecinos) => {
    setDataVecino(selectedVecinos);
  }, [setDataVecino]);

  const columns = [
    { title: "Nombre", field: "nombre", width: 350, responsive: 0 },
    { title: "Correo electrónico", field: "correo", width: 300, responsive: 3 },
    { title: "Rut", field: "rut", width: 150, responsive: 2 },
    { title: "Teléfono", field: "telefono", width: 200, responsive: 2 },
    {
      title: "Comprobante",
      field: "comprobanteDomicilio",
      width: 220,
      responsive: 2,
      formatter: (cell) => {
        const url = cell.getValue();

        if (!url) return "No disponible";

        if (url.startsWith("http") || url.startsWith("https")) {
          return `<a href="${url}" target="_blank" rel="noopener noreferrer">📄 Ver Comprobante</a>`;
        }

        const link = buildFileUrl(url);
        return `<a href="${link}" target="_blank" rel="noopener noreferrer">📄 Ver Comprobante</a>`;
      }
    }
  ];

  return (
    <div className='main-container'>
      <div className='table-container'>
        <div className='top-table'>
          <h1 className='title-table'>Vecinos</h1>
          <div className='filter-actions'>
            <Search
              value={filterRut}
              onChange={handleRutFilterChange}
              placeholder={'Filtrar por rut'}
            />

            <button
              className='edit-vecino-button vecino-button'
              onClick={handleClickUpdate}
              disabled={dataVecino.length === 0}
            >
              Editar
            </button>

            <button
              className='delete-vecino-button vecino-button'
              onClick={() => handleDelete(dataVecino)}
              disabled={dataVecino.length === 0}
            >
              Eliminar
            </button>

            <button
              className='add-vecino-button vecino-button'
              onClick={() => setShowForm(true)}
            >
              Registrar Vecino
            </button>
          </div>
        </div>
        <Table
          data={vecinos}
          columns={columns}
          filter={filterRut}
          dataToFilter={'rut'}
          initialSortName={'nombre'}
          onSelectionChange={handleSelectionChange}
        />
      </div>
      <Popup
        show={isPopupOpen}
        setShow={setIsPopupOpen}
        data={dataVecino}
        action={handleUpdate}
      />
      <FormRegistroVecino
        show={showForm}
        setShow={setShowForm}
        setVecinos={setVecinos}
      />
    </div>
  );
};

export default Vecinos;
