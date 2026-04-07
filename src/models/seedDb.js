const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const pool = require("../config/db");

dotenv.config();

async function seedDb() {
  const seedPath = path.join(__dirname, "..", "..", "sql", "seed.sql");

  try {
    const seedSql = fs.readFileSync(seedPath, "utf8");
    await pool.query(seedSql);
    console.log("Datos de ejemplo insertados/actualizados correctamente.");
  } catch (error) {
    console.error("Error al ejecutar seed de base de datos:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

seedDb();
