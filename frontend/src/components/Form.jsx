import { useForm } from 'react-hook-form';
import { useState } from 'react';
import '../styles/form.css';
import HideIcon from '../assets/HideIcon.svg';
import ViewIcon from '../assets/ViewIcon.svg';

const Form = ({
  title,
  fields,
  buttonText,
  onSubmit,
  footerContent,
  backgroundColor,
  children
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ mode: 'onChange' }); //validar 

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleNewPasswordVisibility = () => setShowNewPassword(!showNewPassword);

  const onFormSubmit = (data) => onSubmit(data);

  return (
    <form
      className="form"
      style={{ backgroundColor }}
      onSubmit={handleSubmit(onFormSubmit)}
      autoComplete="off"
    >
      <h1>{title}</h1>
      {fields.map((field, index) => (
        <div className="container_inputs" key={index}>
          {field.label && <label htmlFor={field.name}>{field.label}</label>}

          {field.fieldType === 'input' && (
            <input
              {...register(field.name, {
                required: field.required ? 'Este campo es obligatorio' : false,
                minLength: field.minLength
                  ? {
                      value: field.minLength,
                      message: `Debe tener al menos ${field.minLength} caracteres`
                    }
                  : false,
                maxLength: field.maxLength
                  ? {
                      value: field.maxLength,
                      message: `Debe tener máximo ${field.maxLength} caracteres`
                    }
                  : false,
                pattern: field.pattern
                  ? {
                      value: field.pattern,
                      message: field.patternMessage || 'Formato no válido'
                    }
                  : false,
                validate: {
                  ...field.validate,
                  ...(field.customValidation && {
                    customValidation: (value) => {
                      const msg = field.customValidation(value);
                      return msg === null || msg === undefined || msg === true ? true : msg;
                    }
                  })
                }
              })}
              name={field.name}
              placeholder={field.placeholder}
              type={
                field.type === 'password' && field.name === 'password'
                  ? showPassword ? 'text' : 'password'
                  : field.type === 'password' && field.name === 'newPassword'
                  ? showNewPassword ? 'text' : 'password'
                  : field.type
              }
              defaultValue={field.defaultValue || ''}
              disabled={field.disabled}
              onBlur={field.onBlur}
            />
          )}

          {field.fieldType === 'textarea' && (
            <textarea
              {...register(field.name, {
                required: field.required ? 'Este campo es obligatorio' : false,
                minLength: field.minLength
                  ? {
                      value: field.minLength,
                      message: `Debe tener al menos ${field.minLength} caracteres`
                    }
                  : false,
                maxLength: field.maxLength
                  ? {
                      value: field.maxLength,
                      message: `Debe tener máximo ${field.maxLength} caracteres`
                    }
                  : false,
                pattern: field.pattern
                  ? {
                      value: field.pattern,
                      message: field.patternMessage || 'Formato no válido'
                    }
                  : false,
                validate: {
                  ...field.validate,
                  ...(field.customValidation && {
                    customValidation: (value) => {
                      const msg = field.customValidation(value);
                      return msg === null || msg === undefined || msg === true ? true : msg;
                    }
                  })
                }
              })}
              name={field.name}
              placeholder={field.placeholder}
              defaultValue={field.defaultValue || ''}
              disabled={field.disabled}
              onBlur={field.onBlur}
            />
          )}

          {field.fieldType === 'select' && (
            <select
              {...register(field.name, {
                required: field.required ? 'Este campo es obligatorio' : false,
                validate: {
                  ...field.validate,
                  ...(field.customValidation && {
                    customValidation: (value) => {
                      const msg = field.customValidation(value);
                      return msg === null || msg === undefined || msg === true ? true : msg;
                    }
                  })
                }
              })}
              name={field.name}
              defaultValue={field.defaultValue || ''}
              disabled={field.disabled}
              onBlur={field.onBlur}
            >
              <option value="">Seleccionar opción</option>
              {field.options?.map((option, optIndex) => (
                <option className="options-class" key={optIndex} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}

          {field.type === 'password' && field.name === 'password' && (
            <span className="toggle-password-icon" onClick={togglePasswordVisibility}>
              <img src={showPassword ? ViewIcon : HideIcon} alt="Ver contraseña" />
            </span>
          )}

          {field.type === 'password' && field.name === 'newPassword' && (
            <span className="toggle-password-icon" onClick={toggleNewPasswordVisibility}>
              <img src={showNewPassword ? ViewIcon : HideIcon} alt="Ver nueva contraseña" />
            </span>
          )}

          <div className={`error-message ${errors[field.name] ? 'visible' : ''}`}>
            {errors[field.name]?.message || ''}
          </div>
        </div>
      ))}

      {children}
      {buttonText && <button type="submit">{buttonText}</button>}
      {footerContent && <div className="footerContent">{footerContent}</div>}
    </form>
  );
};

export default Form;
