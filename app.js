const express = require('express')
const Controller = require('./controllers/controller')
const StudentController = require('./controllers/student')
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

app.get("/", Controller.home)

app.get("/register", Controller.registerPage)

app.post("/register", Controller.register)

app.get("/login", Controller.loginPage)

app.post("/login", Controller.login)

// app.get("/select", isLogin, Controller.select)

app.get("/course", isLogin, StudentController.showCourse)

app.get("/course/add", isLogin, Controller.formAddCourse)

app.get("/logout", Controller.logout)

app.get("/course/:id/watch", isLogin, StudentController.watchCourse)

app.listen(port, () => {
  console.log("App running on port", port);
})