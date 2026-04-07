const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const session = require("express-session");
const publicRouter = require("./routes/public");
const adminRouter = require("./routes/admin");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax"
    }
  })
);

// Después de app.use(session(...));
app.use((req, res, next) => {

  res.locals.currentUser = req.session && req.session.adminUser ? req.session.adminUser : null;
  next();
});

app.use("/", publicRouter);
app.use("/admin", (req, res, next) => {


  next();
});


app.use("/admin", adminRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
