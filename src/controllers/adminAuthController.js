const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");

function renderLogin(req, res) {
  if (req.session && req.session.adminUser) {
    return res.redirect("/admin");
  }

  return res.render("admin/login", {
    title: "Login admin",
    error: null
  });
}

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await userModel.getUserByEmail(email);

    if (!user) {
      return res.status(401).render("admin/login", {
        title: "Login admin",
        error: "Credenciales invalidas"
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).render("admin/login", {
        title: "Login admin",
        error: "Credenciales invalidas"
      });
    }

    req.session.adminUser = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    return res.redirect("/admin");
  } catch (error) {
    console.error("Error en login admin:", error);
    return res.status(500).send("Error interno del servidor");
  }
}

function logout(req, res) {
  if (!req.session) {
    return res.redirect("/admin/login");
  }

  req.session.destroy(() => {
    res.redirect("/admin/login");
  });
}

module.exports = {
  renderLogin,
  login,
  logout
};
