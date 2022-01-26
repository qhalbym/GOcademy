const { User } = require("../models")
const bcrypt = require("bcryptjs")

class Controller {
  //Menampilkan halaman home
  static home(req, res) {
    res.render("home")
  }

  //Menampilkan form login
  static registerPage(req, res) {
    res.render("register")
  }

  //Dari POST "/login"
  static register(req, res) {
    let { username, email, password, role } = req.body
    User.create({ username, email, password, role }).then(result => {
      res.redirect("/login")
    }).catch(err => {
      console.log(err);
      res.send(err)
    })
  }

  //Login page
  static loginPage(req, res) {
    res.render("login")
  }

  //Mengecek login
  static login(req, res) {
    let { username, password } = req.body
    User.findOne({
      where: {
        username: username
      }
    }).then(result => {
      if (!result) {
        res.redirect("/login")
      } else {
        if (bcrypt.compareSync(password, result.password)) {
          res.redirect("/course")
        } else {
          res.redirect("/login")
        }
      }
    })

  }

  //Menampilkan list course
  static getCourse(req, res) {
    res.send("<h1>Ini list course</h1>")
  }
}

module.exports = Controller