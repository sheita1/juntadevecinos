"use strict";
import Joi from "joi";

export const vecinoQueryValidation = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .messages({
      "number.base": "El id debe ser un número.",
      "number.integer": "El id debe ser un número entero.",
      "number.positive": "El id debe ser un número positivo.",
    }),
  correo: Joi.string()
    .email()
    .messages({
      "string.empty": "El correo no puede estar vacío.",
      "string.base": "El correo debe ser de tipo string.",
      "string.email": "El correo debe tener un formato válido.",
    }),
  rut: Joi.string()
    .min(9)
    .max(12)
    .pattern(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/)
    .messages({
      "string.empty": "El rut no puede estar vacío.",
      "string.base": "El rut debe ser de tipo string.",
      "string.min": "El rut debe tener como mínimo 9 caracteres.",
      "string.max": "El rut debe tener como máximo 12 caracteres.",
      "string.pattern.base": "Formato rut inválido, debe ser xx.xxx.xxx-x o xxxxxxxx-x.",
    }),
})
  .or("id", "correo", "rut")
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
    "object.missing": "Debes proporcionar al menos un parámetro: id, correo o rut.",
  });

export const vecinoBodyValidation = Joi.object({
  nombre: Joi.string()
    .min(3)
    .max(255)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .messages({
      "string.empty": "El nombre no puede estar vacío.",
      "string.base": "El nombre debe ser de tipo string.",
      "string.min": "El nombre debe tener como mínimo 3 caracteres.",
      "string.max": "El nombre debe tener como máximo 255 caracteres.",
      "string.pattern.base": "El nombre solo puede contener letras y espacios.",
    }),
  correo: Joi.string()
    .email()
    .messages({
      "string.empty": "El correo no puede estar vacío.",
      "string.base": "El correo debe ser de tipo string.",
      "string.email": "El correo debe tener un formato válido.",
    }),
  rut: Joi.string()
    .min(9)
    .max(12)
    .pattern(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/)
    .messages({
      "string.empty": "El rut no puede estar vacío.",
      "string.base": "El rut debe ser de tipo string.",
      "string.min": "El rut debe tener como mínimo 9 caracteres.",
      "string.max": "El rut debe tener como máximo 12 caracteres.",
      "string.pattern.base": "Formato rut inválido, debe ser xx.xxx.xxx-x o xxxxxxxx-x.",
    }),
  telefono: Joi.string()
    .min(9)
    .max(20)
    .pattern(/^\+?[0-9]+$/)
    .messages({
      "string.empty": "El teléfono no puede estar vacío.",
      "string.base": "El teléfono debe ser de tipo string.",
      "string.min": "El teléfono debe tener como mínimo 9 caracteres.",
      "string.max": "El teléfono debe tener como máximo 20 caracteres.",
      "string.pattern.base": "El teléfono solo puede contener números y opcionalmente el prefijo '+'.",
    }),
  comprobanteDomicilio: Joi.string()
    .optional()
    .messages({
      "string.base": "El comprobante de domicilio debe ser de tipo string.",
    }),
})
  .or("nombre", "correo", "rut", "telefono", "comprobanteDomicilio")
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
    "object.missing": "Debes proporcionar al menos un campo: nombre, correo, rut, teléfono o comprobante de domicilio.",
  });
