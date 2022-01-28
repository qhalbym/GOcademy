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

app.get("/course", isLogin, isStudent, StudentController.showCourse)

app.get("/course/list", isLogin, isTeacher, Controller.courseListTeacher) //pergi ke halaman course untuk teacher, tampilan tabel

app.get("/course/add", isLogin, isTeacher, Controller.formAddCourse) // menampilkan form untuk add course baru

app.get("/user/:id", isLogin, isUserId, Controller.getUserDetail) //Menampilkan user detail

app.post("/course/add", isLogin, isTeacher, Controller.postAdd)

app.get("/user/:id/edit", isLogin, isUserId, Controller.editFormUser) // form emngedit user

app.post("/user/:id/edit", isLogin, isUserId, Controller.postEditUser) // mengedit user

app.get("/course/:courseId/edit", isLogin, isTeacher, Controller.editCourseForm) //menampilkan form untuk mengedit course

app.post("/course/:courseId/edit", isLogin, isTeacher, Controller.postEditCourse)

app.get("/course/:courseId/delete", isLogin, isTeacher, Controller.delete)

app.get("/logout", Controller.logout)

app.get("/course/:id/watch", isLogin, StudentController.watchCourse)

app.get("/course/add", isLogin, isTeacher, Controller.formAddCourse)

app.listen(port, () => {
  console.log("App running on port", port);
})