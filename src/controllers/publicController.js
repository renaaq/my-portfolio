const projectModel = require("../models/projectModel");
const postModel = require("../models/postModel");
const messageModel = require("../models/messageModel");

async function renderHome(req, res) {
  try {
    const projects = await projectModel.getFeaturedProjects();
    res.render("index", {
      title: "Portfolio",
      projects
    });
  } catch (error) {
    console.error("Error en renderHome:", error);
    res.status(500).send("Error interno del servidor");
  }
}

async function renderProjects(req, res) {
  try {
    const projects = await projectModel.getAllProjects();
    res.render("projects", {
      title: "Proyectos",
      projects
    });
  } catch (error) {
    console.error("Error en renderProjects:", error);
    res.status(500).send("Error interno del servidor");
  }
}

async function renderBlog(req, res) {
  try {
    const posts = await postModel.getAllPosts();
    res.render("blog", {
      title: "Blog",
      posts
    });
  } catch (error) {
    console.error("Error en renderBlog:", error);
    res.status(500).send("Error interno del servidor");
  }
}

function renderContact(req, res) {
  res.render("contact", {
    title: "Contacto",
    successMessage: null,
    errorMessage: null,
    formData: { name: "", email: "", subject: "", message: "" }
  });
}

async function handleContactPost(req, res) {
  const { name, email, subject, message } = req.body;

  try {
    if (!name || !email || !message) {
      return res.status(400).render("contact", {
        title: "Contacto",
        successMessage: null,
        errorMessage: "Completa nombre, email y mensaje.",
        formData: { name, email, subject, message }
      });
    }

    await messageModel.createMessage({ name, email, subject, message });

    return res.render("contact", {
      title: "Contacto",
      successMessage: "Mensaje enviado correctamente. Gracias por contactarte.",
      errorMessage: null,
      formData: { name: "", email: "", subject: "", message: "" }
    });
  } catch (error) {
    console.error("Error en handleContactPost:", error);
    return res.status(500).render("contact", {
      title: "Contacto",
      successMessage: null,
      errorMessage: "No se pudo enviar el mensaje. Intenta nuevamente.",
      formData: { name, email, subject, message }
    });
  }
}

module.exports = {
  renderHome,
  renderProjects,
  renderBlog,
  renderContact,
  handleContactPost
};
