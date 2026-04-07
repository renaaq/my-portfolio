const pool = require("../config/db");

async function getAllPosts() {
  const { rows } = await pool.query(
    "SELECT * FROM posts WHERE status = 'published' ORDER BY published_at DESC"
  );
  return rows;
}

async function getAllPostsAdmin() {
  const { rows } = await pool.query(
    "SELECT * FROM posts ORDER BY published_at DESC, id DESC"
  );
  return rows;
}

async function getPostBySlug(slug) {
  const { rows } = await pool.query(
    "SELECT * FROM posts WHERE slug = $1 LIMIT 1",
    [slug]
  );
  return rows[0] || null;
}

async function getPostById(id) {
  const { rows } = await pool.query(
    "SELECT * FROM posts WHERE id = $1 LIMIT 1",
    [id]
  );
  return rows[0] || null;
}

async function createPost(postData) {
  const { title, slug, excerpt, content, tags, status } = postData;
  const normalizedStatus = status === "draft" ? "draft" : "published";
  const publishedAt = normalizedStatus === "published" ? new Date() : null;

  const { rows } = await pool.query(
    `
      INSERT INTO posts (title, slug, excerpt, content, tags, status, published_at)
      VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, NOW()))
      RETURNING *
    `,
    [title, slug, excerpt || null, content, tags || null, normalizedStatus, publishedAt]
  );

  return rows[0] || null;
}

async function updatePost(id, postData) {
  const { title, slug, excerpt, content, tags, status } = postData;
  const normalizedStatus = status === "draft" ? "draft" : "published";

  const { rows } = await pool.query(
    `
      UPDATE posts
      SET
        title = $1,
        slug = $2,
        excerpt = $3,
        content = $4,
        tags = $5,
        status = $6::varchar,
        published_at = CASE
          WHEN $6::varchar = 'published' THEN COALESCE(published_at, NOW())
          ELSE published_at
        END,
        updated_at = NOW()
      WHERE id = $7
      RETURNING *
    `,
    [title, slug, excerpt || null, content, tags || null, normalizedStatus, id]
  );

  return rows[0] || null;
}

async function deletePost(id) {
  const { rows } = await pool.query(
    "DELETE FROM posts WHERE id = $1 RETURNING id",
    [id]
  );
  return rows[0] || null;
}

module.exports = {
  getAllPosts,
  getAllPostsAdmin,
  getPostBySlug,
  getPostById,
  createPost,
  updatePost,
  deletePost
};
