const { User, Category, Course, UserCourse, UserDetail } = require("../models")
const bcrypt = require("bcryptjs")
const session = require("express-session")

class Controller {
  //Menampilkan halaman home
  static home(req, res) {
    res.render("home")
  }

  //Menampilkan form register
  static registerPage(req, res) {
    res.render("register")
  }

  //Dari POST "/login"
  static register(req, res) {
    let { username, email, password, role } = req.body
    User.create({ username, email, password, role }).then(result => {
      res.redirect("/login")
    }).catch(err => {
      if (err.name === "SequelizeValidationError") {
        err = err.errors.map(el => {
          return el.message
        })
      }
      res.send(err)
    })
  }

  //Login page
  static loginPage(req, res) {
    let { error } = req.query
    res.render("login", { error })
  }

  //Mengecek login
  static login(req, res) {
    let { username, password } = req.body
    User.findOne({
      where: {
        username: username
      }
    }).then(result => {
      console.log(result);
      if (!result) {
        res.redirect("/login?error=Tidak ada user ditemukan")
      } else {

        //Kalau user ditemukan, compare password yang diinput dengan hash
        if (bcrypt.compareSync(password, result.password)) {
          // gunakan session untuk mengetahui yang login siapa
          req.session.role = result.role
          req.session.userId = result.id
          if (result.role === "teacher") {
            res.redirect("/course/list")
          } else if (result.role === "student") {
            res.redirect("/course")
          }
        } else {
          res.redirect("/login?error=password tidak cocok") //Kalau password salah
        }
      }
    })

  }

  static logout(req, res) {
    req.session.destroy(err => {
      if (err) {
        res.send(err)
      } else {
        res.redirect("/login")
      }
    })
  }

  //Menampilkan list course
  static getCourse(req, res) {
    res.render("student")
  }

  static courseListTeacher(req, res) {
    res.render("teacher")
  }

  static formAddCourse(req, res) {
    Category.findAll().then(data => {
      console.log(data);
      res.render("formAddCourse", { data })
    }).catch(err => {
      res.send(err)
    })
  }

}

module.exports = Controller