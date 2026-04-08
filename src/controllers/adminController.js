const projectModel = require("../models/projectModel");
const postModel = require("../models/postModel");
const messageModel = require("../models/messageModel");

async function renderDashboard(req, res) {
  try {
    const [projects, posts, messages] = await Promise.all([
      projectModel.getAllProjects(),
      postModel.getAllPosts(),
      messageModel.getAllMessages()
    ]);

    res.render("admin/dashboard", {
      title: "Panel de administracion",
      totals: {
        projects: projects.length,
        posts: posts.length,
        messages: messages.length
      }
    });
  } catch (error) {
    console.error("Error en renderDashboard:", error);
    res.status(500).send("Error interno del servidor");
  }
}

async function renderAdminProjects(req, res) {
  try {
    const projects = await projectModel.getAllProjects();
    res.render("admin/projects", {
      title: "Admin - Proyectos",
      projects
    });
  } catch (error) {
    console.error("Error en renderAdminProjects:", error);
    res.status(500).send("Error interno del servidor");
  }
}

function getProjectPayloadFromRequest(body) {
  return {
    title: body.title,
    slug: body.slug,
    description: body.description,
    tech_stack: body.tech_stack,
    repo_url: body.repo_url,
    live_url: body.live_url,
    image_url: body.image_url,
    is_featured: body.is_featured === "on"
  };
}

function validateProjectPayload(payload) {
  return payload.title && payload.slug && payload.description;
}

function renderProjectForm(res, options) {
  return res.render("admin/project-form", options);
}

function renderNewProject(req, res) {
  return renderProjectForm(res, {
    title: "Admin - Nuevo proyecto",
    formTitle: "Nuevo proyecto",
    formAction: "/admin/projects",
    project: {
      title: "",
      slug: "",
      description: "",
      tech_stack: "",
      repo_url: "",
      live_url: "",
      image_url: "",
      is_featured: false
    },
    errorMessage: null
  });
}

async function createAdminProject(req, res) {
  const payload = getProjectPayloadFromRequest(req.body);

  try {
    if (!validateProjectPayload(payload)) {
      return renderProjectForm(res, {
        title: "Admin - Nuevo proyecto",
        formTitle: "Nuevo proyecto",
        formAction: "/admin/projects",
        project: payload,
        errorMessage: "Completa title, slug y description."
      });
    }

    await projectModel.createProject(payload);
    return res.redirect("/admin/projects");
  } catch (error) {
    console.error("Error en createAdminProject:", error);
    return res.status(500).send("Error interno del servidor");
  }
}

async function renderEditProject(req, res) {
  try {
    const project = await projectModel.getProjectById(req.params.id);

    if (!project) {
      return res.status(404).send("Proyecto no encontrado");
    }

    return renderProjectForm(res, {
      title: "Admin - Editar proyecto",
      formTitle: "Editar proyecto",
      formAction: `/admin/projects/${project.id}?_method=PUT`,
      project,
      errorMessage: null
    });
  } catch (error) {
    console.error("Error en renderEditProject:", error);
    return res.status(500).send("Error interno del servidor");
  }
}

async function updateAdminProject(req, res) {
  const projectId = req.params.id;
  const payload = getProjectPayloadFromRequest(req.body);

  try {
    if (!validateProjectPayload(payload)) {
      return renderProjectForm(res, {
        title: "Admin - Editar proyecto",
        formTitle: "Editar proyecto",
        formAction: `/admin/projects/${projectId}?_method=PUT`,
        project: { ...payload, id: projectId },
        errorMessage: "Completa title, slug y description."
      });
    }

    const updated = await projectModel.updateProject(projectId, payload);

    if (!updated) {
      return res.status(404).send("Proyecto no encontrado");
    }

    return res.redirect("/admin/projects");
  } catch (error) {
    console.error("Error en updateAdminProject:", error);
    return res.status(500).send("Error interno del servidor");
  }
}

async function saveAdminProject(req, res) {
  if ((req.query._method || "").toUpperCase() === "PUT") {
    return updateAdminProject(req, res);
  }
  return updateAdminProject(req, res);
}

async function deleteAdminProject(req, res) {
  try {
    const deleted = await projectModel.deleteProject(req.params.id);

    if (!deleted) {
      return res.status(404).send("Proyecto no encontrado");
    }

    return res.redirect("/admin/projects");
  } catch (error) {
    console.error("Error en deleteAdminProject:", error);
    return res.status(500).send("Error interno del servidor");
  }
}

async function renderAdminPosts(req, res) {
  try {
    const posts = await postModel.getAllPostsAdmin();
    res.render("admin/posts", {
      title: "Admin - Posts",
      posts
    });
  } catch (error) {
    console.error("Error en renderAdminPosts:", error);
    res.status(500).send("Error interno del servidor");
  }
}

function getPostPayloadFromRequest(body) {
  return {
    title: body.title,
    slug: body.slug,
    excerpt: body.excerpt,
    content: body.content,
    tags: body.tags,
    status: body.status
  };
}

function validatePostPayload(payload) {
  return payload.title && payload.slug && payload.content;
}

function renderPostForm(res, options) {
  return res.render("admin/post-form", options);
}

function renderNewPost(req, res) {
  return renderPostForm(res, {
    title: "Admin - Nuevo post",
    formTitle: "Nuevo post",
    formAction: "/admin/posts",
    post: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      tags: "",
      status: "draft"
    },
    errorMessage: null
  });
}

async function createAdminPost(req, res) {
  const payload = getPostPayloadFromRequest(req.body);

  try {
    if (!validatePostPayload(payload)) {
      return renderPostForm(res, {
        title: "Admin - Nuevo post",
        formTitle: "Nuevo post",
        formAction: "/admin/posts",
        post: payload,
        errorMessage: "Completa title, slug y content."
      });
    }

    await postModel.createPost(payload);
    return res.redirect("/admin/posts");
  } catch (error) {
    console.error("Error en createAdminPost:", error);
    return res.status(500).send("Error interno del servidor");
  }
}

async function renderEditPost(req, res) {
  try {
    const post = await postModel.getPostById(req.params.id);

    if (!post) {
      return res.status(404).send("Post no encontrado");
    }

    return renderPostForm(res, {
      title: "Admin - Editar post",
      formTitle: "Editar post",
      formAction: `/admin/posts/${post.id}?_method=PUT`,
      post,
      errorMessage: null
    });
  } catch (error) {
    console.error("Error en renderEditPost:", error);
    return res.status(500).send("Error interno del servidor");
  }
}

async function updateAdminPost(req, res) {
  const postId = req.params.id;
  const payload = getPostPayloadFromRequest(req.body);

  console.log("=== updateAdminPost ===");
  console.log("postId:", postId);
  console.log("payload:", payload);

  try {
    if (!validatePostPayload(payload)) {
      return renderPostForm(res, {
        title: "Admin - Editar post",
        formTitle: "Editar post",
        formAction: `/admin/posts/${postId}?_method=PUT`,
        post: { ...payload, id: postId },
        errorMessage: "Completa title, slug y content."
      });
    }

    const updated = await postModel.updatePost(postId, payload);

    if (!updated) {
      return res.status(404).send("Post no encontrado");
    }

    return res.redirect("/admin/posts");
  } catch (error) {
    console.error("Error en updateAdminPost:", error);
    return res.status(500).send("Error interno del servidor");
  }
}

async function saveAdminPost(req, res) {
  if ((req.query._method || "").toUpperCase() === "PUT") {
    return updateAdminPost(req, res);
  }
  return updateAdminPost(req, res);
}

async function deleteAdminPost(req, res) {
  try {
    const deleted = await postModel.deletePost(req.params.id);

    if (!deleted) {
      return res.status(404).send("Post no encontrado");
    }

    return res.redirect("/admin/posts");
  } catch (error) {
    console.error("Error en deleteAdminPost:", error);
    return res.status(500).send("Error interno del servidor");
  }
}

async function renderAdminMessages(req, res) {
  try {
    const messages = await messageModel.getAllMessages();
    res.render("admin/messages", {
      title: "Admin - Mensajes",
      messages
    });
  } catch (error) {
    console.error("Error en renderAdminMessages:", error);
    res.status(500).send("Error interno del servidor");
  }
}

async function deleteAdminMessage(req, res) {
  try {
    await messageModel.deleteMessage(req.params.id);
    return res.redirect("/admin/messages");
  } catch (error) {
    console.error("Error en deleteAdminMessage:", error);
    return res.status(500).send("Error interno del servidor");
  }
}

module.exports = {
  renderDashboard,
  renderAdminProjects,
  renderNewProject,
  createAdminProject,
  renderEditProject,
  saveAdminProject,
  deleteAdminProject,
  renderAdminPosts,
  renderNewPost,
  createAdminPost,
  renderEditPost,
  saveAdminPost,
  deleteAdminPost,
  renderAdminMessages,
  deleteAdminMessage
};
