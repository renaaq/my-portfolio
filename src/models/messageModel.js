const pool = require("../config/db");

async function createMessage({ name, email, subject, message }) {
  const { rows } = await pool.query(
    `
      INSERT INTO messages (name, email, subject, message)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
    [name, email, subject || null, message]
  );

  return rows;
}

async function getAllMessages() {
  const { rows } = await pool.query(
    "SELECT * FROM messages ORDER BY created_at DESC"
  );
  return rows;
}

async function deleteMessage(id) {
  const { rows } = await pool.query(
    "DELETE FROM messages WHERE id = $1 RETURNING id",
    [id]
  );
  return rows[0] || null;
}

module.exports = {
  createMessage,
  getAllMessages,
  deleteMessage


};
