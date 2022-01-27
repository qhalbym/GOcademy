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
    // if(req.session.role === "student"){
    //   res.redirect("/course")
    // } else if (req.session.role == 'teacher') {
    //   res.redirect("/course/add")
    // }
    next()
  } else {
    res.redirect("/login?error=Harap login terlebih dahulu")
  }
}

// const isStudent = function (req, res, next) {
//   // console.log(req.session);
//   if (req.session.role == 'student') {
//     next()
//   } else {
//     res.redirect("/select?error=akses khusus student")
//   }
// }

// const isTeacher = function (req, res, next) {
//   if (req.session.role == 'teacher') {
//     next()
//   } else {
//     res.redirect("/select?error=Akses tidak diijinkan, khusus teacher")
//   }
// }

app.get("/", Controller.home)

app.get("/register", Controller.registerPage)

app.post("/register", Controller.register)

app.get("/login", Controller.loginPage)

app.post("/login", Controller.login)

// app.get("/select", isLogin, Controller.select)

app.get("/course", isLogin, Controller.getCourse)

app.get("/course/add", isLogin, Controller.formAddCourse)

app.get("/logout", Controller.logout)

app.listen(port, () => {
  console.log("App running on port", port);
})