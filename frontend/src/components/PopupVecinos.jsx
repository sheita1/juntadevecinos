import Form from './Form';
import '@styles/popup.css';
import CloseIcon from '@assets/XIcon.svg';

export default function PopupVecinos({ show, setShow, data, action }) {
    const vecinoData = data && data.length > 0 ? data[0] : {};

    const handleSubmit = (formData) => {
        action(formData);
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
                        title="Editar vecino"
                        fields={[
                            {
                                label: "Nombre completo",
                                name: "nombre",
                                defaultValue: vecinoData.nombre || "",
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
                                defaultValue: vecinoData.correo || "",
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
                                defaultValue: vecinoData.rut || "",
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
                                defaultValue: vecinoData.telefono || "",
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
                        buttonText="Editar vecino"
                        backgroundColor={'#fff'}
                    />
                </div>
            </div>
            )}
        </div>
    );
}
