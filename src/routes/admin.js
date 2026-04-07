const router = require("express").Router();
const adminController = require("../controllers/adminController");
const adminAuthController = require("../controllers/adminAuthController");
const authMiddleware = require("../middlewares/authMiddleware");

// Rutas públicas (sin auth)
router.get("/login", adminAuthController.renderLogin);
router.post("/login", adminAuthController.login);
router.post("/logout", adminAuthController.logout);

// Todo lo que sigue requiere estar logueado
router.use(authMiddleware.requireAdminAuth);

// Dashboard
router.get("/", adminController.renderDashboard);

// Proyectos
router.get("/projects", adminController.renderAdminProjects);
router.get("/projects/new", adminController.renderNewProject);
router.post("/projects", adminController.createAdminProject);
router.get("/projects/:id/edit", adminController.renderEditProject);
router.post("/projects/:id", adminController.saveAdminProject);       // ← corregido
router.post("/projects/:id/delete", adminController.deleteAdminProject);

// Posts
router.get("/posts", adminController.renderAdminPosts);
router.get("/posts/new", adminController.renderNewPost);
router.post("/posts", adminController.createAdminPost);
router.get("/posts/:id/edit", adminController.renderEditPost);
router.post("/posts/:id", adminController.saveAdminPost);
router.post("/posts/:id/delete", adminController.deleteAdminPost);

// Mensajes
router.get("/messages", adminController.renderAdminMessages);
router.post("/messages/:id/delete", adminController.deleteAdminMessage);

module.exports = router;