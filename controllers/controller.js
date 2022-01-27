const { User } = require("../models")
const bcrypt = require("bcryptjs")
const session = require("express-session")

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
            res.redirect("/course/add")
          } else if (result.role === "student") {
            res.redirect("/course")
          }
          // res.redirect("/select")
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

  //Menampilkan tombol pilihan untuk teacher atau student
  // static select(req, res) {
  //   let { error } = req.query
  //   res.render("selectRole", { error })
  // }

  //Menampilkan list course
  static getCourse(req, res) {
    res.render("student")
  }

  static formAddCourse(req, res) {
    res.render("teacher")
  }

}

module.exports = Controller