"use strict";
import bcrypt from "bcryptjs";

/**
 * Encripta una contraseña con limpieza previa.
 * @param {string} password - Contraseña en texto plano
 * @returns {Promise<string>} 
 */
export async function encryptPassword(password) {
  const passwordLimpio = password.trim().normalize();
  console.log("🔐 [encryptPassword] input limpio:", `"${passwordLimpio}"`);
  return await bcrypt.hash(passwordLimpio, 10);
}

/**
 * Compara una contraseña con su hash.
 * @param {string} password 
 * @param {string} hashedPassword 
 * @returns {Promise<boolean>} 
 */
export async function comparePassword(password, hashedPassword) {
  const passwordLimpio = password.trim().normalize();
  console.log("🔍 [comparePassword] comparando:", `"${passwordLimpio}" ↔ ${hashedPassword}`);
  return await bcrypt.compare(passwordLimpio, hashedPassword);
}
