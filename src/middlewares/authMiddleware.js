function requireAdminAuth(req, res, next) {
  if (!req.session || !req.session.adminUser) {
    return res.redirect("/admin/login");
  }

  return next();
}

module.exports = {
  requireAdminAuth
};
