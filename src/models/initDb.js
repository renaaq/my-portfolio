const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const pool = require("../config/db");

dotenv.config();

async function initDb() {
  const schemaPath = path.join(__dirname, "..", "..", "sql", "schema.sql");

  try {
    const schemaSql = fs.readFileSync(schemaPath, "utf8");
    await pool.query(schemaSql);
    console.log("Base de datos inicializada correctamente.");
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

initDb();
