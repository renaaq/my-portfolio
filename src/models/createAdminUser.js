const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const pool = require("../config/db");
const userModel = require("./userModel");

dotenv.config();

async function createAdminUser() {
  const name = process.env.ADMIN_NAME || "Renato";
  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const saltRounds = 10;

  try {
    const existingUser = await userModel.getUserByEmail(email);

    if (existingUser) {
      console.log("El admin ya existe, no se realizaron cambios");
      return;
    }

    const passwordHash = await bcrypt.hash(password, saltRounds);

    await pool.query(
      `
        INSERT INTO users (name, email, password_hash, role)
        VALUES ($1, $2, $3, 'admin')
      `,
      [name, email, passwordHash]
    );

    console.log("Admin creado correctamente");
  } catch (error) {
    console.error("Error al crear admin:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

createAdminUser();
