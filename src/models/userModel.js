const pool = require("../config/db");

async function getUserByEmail(email) {
  const { rows } = await pool.query(
    "SELECT * FROM users WHERE email = $1 LIMIT 1",
    [email]
  );
  return rows[0] || null;
}

module.exports = {
  getUserByEmail
};
