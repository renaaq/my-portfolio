const router = require("express").Router();
const publicController = require("../controllers/publicController");

router.get("/", publicController.renderHome);

router.get("/projects", publicController.renderProjects);

router.get("/blog", publicController.renderBlog);

router.get("/contact", publicController.renderContact);
router.post("/contact", publicController.handleContactPost);

module.exports = router;
