import Table from '@components/Table';
import useVecinos from '@hooks/vecinos/useGetVecinos.jsx';
import Search from '../components/Search';
import Popup from '../components/PopupVecinos';
import FormRegistroVecino from '../components/FormRegistroVecino';  // ✅ Nuevo formulario de registro
import DeleteIcon from '../assets/deleteIcon.svg';
import UpdateIcon from '../assets/updateIcon.svg';
import UpdateIconDisable from '../assets/updateIconDisabled.svg';
import DeleteIconDisable from '../assets/deleteIconDisabled.svg';
import { useCallback, useState } from 'react';
import '@styles/vecinos.css';
import useEditVecino from '@hooks/vecinos/useEditVecino';
import useDeleteVecino from '@hooks/vecinos/useDeleteVecino';

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
    { title: "Creado", field: "createdAt", width: 200, responsive: 2 }
  ];

  return (
    <div className='main-container'>
      <div className='table-container'>
        <div className='top-table'>
          <h1 className='title-table'>Vecinos</h1>
          <div className='filter-actions'>
            <Search value={filterRut} onChange={handleRutFilterChange} placeholder={'Filtrar por rut'} />
            <button onClick={handleClickUpdate} disabled={dataVecino.length === 0}>
              {dataVecino.length === 0 ? (
                <img src={UpdateIconDisable} alt="edit-disabled" />
              ) : (
                <img src={UpdateIcon} alt="edit" />
              )}
            </button>
            <button className='delete-vecino-button' disabled={dataVecino.length === 0} onClick={() => handleDelete(dataVecino)}>
              {dataVecino.length === 0 ? (
                <img src={DeleteIconDisable} alt="delete-disabled" />
              ) : (
                <img src={DeleteIcon} alt="delete" />
              )}
            </button>
            <button className='add-vecino-button' onClick={() => setShowForm(true)}>Registrar Vecino</button>  {}
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
      <Popup show={isPopupOpen} setShow={setIsPopupOpen} data={dataVecino} action={handleUpdate} />
      <FormRegistroVecino show={showForm} setShow={setShowForm} setVecinos={setVecinos} />  {/* ✅ Formulario de registro */}
    </div>
  );
};

export default Vecinos;
