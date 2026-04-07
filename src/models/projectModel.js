const pool = require("../config/db");

async function getAllProjects() {
  const { rows } = await pool.query(
    "SELECT * FROM projects ORDER BY created_at DESC"
  );
  return rows;
}

async function getFeaturedProjects() {
  const { rows } = await pool.query(
    "SELECT * FROM projects WHERE is_featured = TRUE ORDER BY created_at DESC"
  );
  return rows;
}

async function getProjectBySlug(slug) {
  const { rows } = await pool.query(
    "SELECT * FROM projects WHERE slug = $1 LIMIT 1",
    [slug]
  );
  return rows[0] || null;
}

async function getProjectById(id) {
  const { rows } = await pool.query(
    "SELECT * FROM projects WHERE id = $1 LIMIT 1",
    [id]
  );
  return rows[0] || null;
}

async function createProject(projectData) {
  const {
    title,
    slug,
    description,
    tech_stack,
    repo_url,
    live_url,
    image_url,
    is_featured
  } = projectData;

  const { rows } = await pool.query(
    `
      INSERT INTO projects (
        title, slug, description, tech_stack, repo_url, live_url, image_url, is_featured
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `,
    [
      title,
      slug,
      description,
      tech_stack || null,
      repo_url || null,
      live_url || null,
      image_url || null,
      !!is_featured
    ]
  );

  return rows[0] || null;
}

async function updateProject(id, projectData) {
  const {
    title,
    slug,
    description,
    tech_stack,
    repo_url,
    live_url,
    image_url,
    is_featured
  } = projectData;

  const { rows } = await pool.query(
    `
      UPDATE projects
      SET
        title = $1,
        slug = $2,
        description = $3,
        tech_stack = $4,
        repo_url = $5,
        live_url = $6,
        image_url = $7,
        is_featured = $8,
        updated_at = NOW()
      WHERE id = $9
      RETURNING *
    `,
    [
      title,
      slug,
      description,
      tech_stack || null,
      repo_url || null,
      live_url || null,
      image_url || null,
      !!is_featured,
      id
    ]
  );

  return rows[0] || null;
}

async function deleteProject(id) {
  const { rows } = await pool.query(
    "DELETE FROM projects WHERE id = $1 RETURNING id",
    [id]
  );
  return rows[0] || null;
}

module.exports = {
  getAllProjects,
  getFeaturedProjects,
  getProjectBySlug,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};
