import bcrypt from "bcryptjs";

const plainPassword = "qwerty123";
const storedHash = "$2a$10$AYO56QvHDV2eL6pucmTLmOE3vuPcVXh8mliAjTphWmKzgj4CqZTkW";

(async () => {
  const result = await bcrypt.compare(plainPassword, storedHash);
  console.log("🔍 ¿bcryptjs reconoce el hash?:", result ? "✅ Sí" : "❌ No");

  const hashFromInput = await bcrypt.hash(plainPassword, 10);
  console.log("🧪 Nuevo hash desde input:", hashFromInput);
})();
