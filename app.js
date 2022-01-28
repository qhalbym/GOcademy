const express = require('express')
const Controller = require('./controllers/controller')
const app = express()
const session = require("express-session")
const port = 3000

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(session({
  secret: 'rahasia',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    sameSite: true
  }
}))

//Fungsi middleware untuk mengecek siapa yang login

const isLogin = function (req, res, next) {
  if (req.session.userId) {
    next()
  } else {
    res.redirect("/login?error=Harap login terlebih dahulu")
  }
}

const isStudent = function (req, res, next) {
  // console.log(req.session);
  if (req.session == 'student') {
    next()
  } else {
    res.redirect("/login?error=akses khusus student")
  }
}

const isTeacher = function (req, res, next) {
  if (req.session == 'teacher') {
    next()
  } else {
    res.redirect("/login?error=Akses tidak diijinkan, khusus teacher")
  }
}

app.get("/", Controller.home)

app.get("/register", Controller.registerPage)

app.post("/register", Controller.register)

app.get("/login", Controller.loginPage)

app.post("/login", Controller.login)

app.get("/course", isLogin, isStudent, Controller.getCourse)

app.get("/course/add", isLogin, isTeacher, Controller.formAddCourse)

app.listen(port, () => {
  console.log("App running on port", port);
})