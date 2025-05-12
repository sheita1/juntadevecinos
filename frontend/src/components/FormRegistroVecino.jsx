import Form from '@components/Form';
import '@styles/popup.css';
import CloseIcon from '@assets/XIcon.svg';
import { useState } from 'react';
import { createVecino } from '@services/vecinos.service.js';
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert.js';

export default function FormRegistroVecino({ show, setShow, setVecinos }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [file, setFile] = useState(null);  

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);  
        console.log("📂 Archivo seleccionado:", event.target.files[0]);  
    };

    const handleSubmit = async (formData) => {
        setIsSubmitting(true);

        try {
            console.log("🚀 Enviando datos...");
            console.log("📝 Datos del formulario antes de FormData:", formData);

            const formDataToSend = new FormData();

            
            for (const key in formData) {
                if (key !== "comprobanteDomicilio") {  
                    formDataToSend.append(key, formData[key]);
                    console.log(`✅ Campo agregado: ${key} -> ${formData[key]}`);
                }
            }

            
            if (file) {
                formDataToSend.append("comprobanteDomicilio", file);
                console.log("✅ Archivo agregado a FormData:", file.name);
            } else {
                console.error("❌ No se adjuntó ningún archivo.");
            }

            
            console.log("🔍 Datos enviados al backend:");
            for (let pair of formDataToSend.entries()) {
                console.log(`📝 ${pair[0]}:`, pair[1]);
            }

            const newVecino = await createVecino(formDataToSend);

            if (newVecino) {
                showSuccessAlert('¡Registro exitoso!', 'El vecino ha sido agregado correctamente.');
                setVecinos(prevVecinos => [...prevVecinos, newVecino]);  
                setShow(false);  
            } else {
                showErrorAlert('Error', 'No se pudo registrar el vecino.');
            }
        } catch (error) {
            console.error('❌ Error al registrar vecino:', error);
            showErrorAlert('Error', 'No se pudo registrar el vecino.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const patternRut = new RegExp(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/);

    return (
        <div>
            { show && (
            <div className="bg">
                <div className="popup">
                    <button className='close' onClick={() => setShow(false)}>
                        <img src={CloseIcon} />
                    </button>
                    <Form
                        title="Registrar Vecino"
                        fields={[
                            {
                                label: "Nombre completo",
                                name: "nombre",
                                placeholder: 'Diego Alexis Salazar Jara',
                                fieldType: 'input',
                                type: "text",
                                required: true,
                                minLength: 15,
                                maxLength: 50,
                                pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                                patternMessage: "Debe contener solo letras y espacios",
                            },
                            {
                                label: "Correo electrónico",
                                name: "correo",
                                placeholder: 'example@gmail.cl',
                                fieldType: 'input',
                                type: "email",
                                required: true,
                                minLength: 15,
                                maxLength: 30,
                            },
                            {
                                label: "Rut",
                                name: "rut",
                                placeholder: '21.308.770-3',
                                fieldType: 'input',
                                type: "text",
                                minLength: 9,
                                maxLength: 12,
                                pattern: patternRut,
                                patternMessage: "Debe ser xx.xxx.xxx-x o xxxxxxxx-x",
                                required: true,
                            },
                            {
                                label: "Teléfono",
                                name: "telefono",
                                placeholder: '+56912345678',
                                fieldType: 'input',
                                type: "text",
                                required: true,
                                minLength: 9,
                                maxLength: 12,
                                pattern: /^[0-9]+$/,
                                patternMessage: "Debe contener solo números",
                            }
                        ]}
                        onSubmit={handleSubmit}
                        buttonText={isSubmitting ? "Registrando..." : "Registrar Vecino"}
                        backgroundColor={'#fff'}
                    />

                    {}
                    <div className="file-upload">
                        <label htmlFor="comprobanteDomicilio">Comprobante de domicilio (PNG)</label>
                        <input 
                            type="file" 
                            id="comprobanteDomicilio" 
                            name="comprobanteDomicilio" 
                            accept=".png" 
                            onChange={handleFileChange} 
                            required 
                        />
                    </div>
                </div>
            </div>
            )}
        </div>
    );
}
