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

const isUserId = function (req, res, next) {
  let { id } = req.params
  if (req.session.userId == id) {
    next()
  } else {
    res.redirect("/login?error=Anda tidak bisa mengedit user lain")
  }
}

const isTeacher = function (req, res, next) {
  if (req.session.role == 'teacher') {
    next()
  } else {
    res.redirect("/login?error=Fitur hanya untuk teacher")
  }
}

const isStudent = function (req, res, next) {
  if (req.session.role == 'student') {
    next()
  } else {
    res.redirect("/login?error=fitur hanya untuk student")
  }
}

app.get("/", Controller.home)

app.get("/register", Controller.registerPage)

app.post("/register", Controller.register)

app.get("/login", Controller.loginPage)

app.post("/login", Controller.login)

// app.get("/select", isLogin, Controller.select)

app.get("/user/:id", isLogin, isUserId, Controller.getUserDetail) //Menampilkan user detail

app.get("/user/:id/edit", isLogin, isUserId, Controller.editFormUser) // form emngedit user

app.post("/user/:id/edit", isLogin, isUserId, Controller.postEditUser) // mengedit user

app.get("/course", isLogin, isStudent, Controller.getCourse) // pergi ke halaman course untuk student, tampilan card

app.get("/course/list", isLogin, isTeacher, Controller.courseListTeacher) //pergi ke halaman course untuk teacher, tampilan tabel

app.get("/course/add", isLogin, isTeacher, Controller.formAddCourse) // menampilkan form untuk add course baru

app.post("/course/add", isLogin, isTeacher, Controller.postAdd)

app.get("/course/:courseId/edit", isLogin, isTeacher, Controller.editCourseForm) //menampilkan form untuk mengedit course

app.post("/course/:courseId/edit", isLogin, isTeacher, Controller.postEditCourse)

app.get("/course/:courseId/delete", isLogin, isTeacher, Controller.delete)

app.get("/logout", Controller.logout)

app.listen(port, () => {
  console.log("App running on port", port);
})