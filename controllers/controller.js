const { User, Category, Course, Rating, UserCourse, UserDetail } = require("../models")
const bcrypt = require("bcryptjs")
const session = require("express-session")
const formatDate = require("../helpers/formatDate")

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
    let userData
    User.create({ username, email, password, role }).then(result => {
      // console.log(result);
      userData = result
      return UserDetail.create({ UserId: result.id, learningTime: 0, dateOfBirth: new Date("01-01-2000") }) //Membuat default userdetail
    }).then(data => {
      res.redirect("/login")
    })
      .catch(err => {
        let errors = []
        if (err.name === "SequelizeValidationError") {
          err.errors.forEach(el => {
            errors.push(el.message)
          })
        }
        if (err.name === "SequelizeUniqueConstraintError") {
          err.errors.forEach(el => {
            errors.push(el.message)
          })
        }
        if (errors.length) {
          res.send(errors)
        } else {
          res.send(err)
        }
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
      if (!result) {
        res.redirect("/login?error=Tidak ada user ditemukan")
      } else {

        //Kalau user ditemukan, compare password yang diinput dengan hash
        if (bcrypt.compareSync(password, result.password)) {
          // gunakan session untuk mengetahui yang login siapa
          req.session.role = result.role
          req.session.userId = result.id
          if (result.role === "teacher") {
            res.redirect(`/course/list?id=${result.id}`)
          } else if (result.role === "student") {
            res.redirect(`/course?id=${result.id}`)
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

  //Menampilkan userdetail
  static getUserDetail(req, res) {
    let { id } = req.params
    UserDetail.findOne({
      where: {
        UserId: id
      }
    })
      .then(result => {
        res.render("userDetail", { result, formatDate })
      }).catch(err => {
        console.log(err);
        res.send(err)
      })
  }

  //Menampilkan form edit user
  static editFormUser(req, res) {
    let UserId = req.params.id
    UserDetail.findOne({
      where: {
        UserId: UserId
      }
    }).then(data => {
      // console.log(data);
      res.render("formEditUser", { data })
    }).catch(err => {
      console.log(err);
      res.send(err)
    })
  }

  // Mengedit user detail
  static postEditUser(req, res) {
    let { id } = req.params
    // console.log(req.body);
    let { firstName, lastName, dateOfBirth } = req.body
    UserDetail.update({ firstName, lastName, dateOfBirth }, {
      where: {
        UserId: id
      }
    }).then(result => {
      // console.log(result);
      res.redirect(`/user/${id}`)
    }).catch(err => {
      console.log(err);
      res.send(err)
    })
  }

  //Menampilkan list course card
  static getCourse(req, res) {
    res.render("student")
  }


  //Menampilkan tabel list course untuk teacher
  static courseListTeacher(req, res) {
    let { id } = req.query
    // console.log(id);

    let courseData
    Course.findAll({
      include: {
        model: Category
      }
    }).then(result => {
      courseData = result
      return User.findByPk(id)
    }).then(data => {
      // console.log(data);
      res.render("teacher", { courseData, userData: data })
    })
      .catch(err => {
        res.send(err)
      })
  }

  // Menampilkan form untuk menambah course
  static formAddCourse(req, res) {
    Category.findAll().then(data => {
      res.render("formAddCourse", { data })
    }).catch(err => {
      res.send(err)
    })
  }

  //menambah course
  static postAdd(req, res) {
    let { userId } = req.session
    let { name, description, duration, videoUrl, CategoryId } = req.body
    Rating.create({one: 0, two: 0, three: 0, four: 0, five: 0})
      .then(result => {
        return Course.create({ name, description, duration, rating: result.id, videoUrl, CategoryId })
      }).then(result => {
        // console.log(result);
        return UserCourse.create({ UserId: userId, CourseId: result.id }) // Menambah ke tabel UserCourses
      }).then(result => {
        Rating.create({one: 0, two: 0, three: 0, four: 0, five: 0})
        res.redirect(`/course/list?id=${userId}`)
      }).catch(err => {
        if (err.name === "SequelizeValidationError") {
          err = err.errors.map(el => {
            return el.message
          })
        }
        console.log(err);
        res.send(err)
      })
  }

  //menampilkan form untuk mengedit course
  static editCourseForm(req, res) {
    let id = req.params.courseId
    // console.log(req.params);

    let courseData
    Course.findOne({
      where: {
        id: id
      },
      include: {
        model: Category
      }
    }).then(data => {
      courseData = data
      return Category.findAll()
    }).then(result => {
      // console.log(courseData.Category, result);
      res.render("formEditCourse", { courseData, result })
    })
      .catch(err => {
        if (err.name === "SequelizeValidationError") {
          err = err.errors.map(el => {
            return el.message
          })
        }
        console.log(err);
        res.send(err)
      })
  }

  //mengedit course
  static postEditCourse(req, res) {
    let { userId } = req.session
    let { courseId } = req.params
    let { name, description, duration, videoUrl, CategoryId } = req.body
    Course.update({ name, description, duration, videoUrl, CategoryId }, {
      where: {
        id: courseId
      }
    }).then(result => {
      // console.log(result);
      res.redirect(`/course/list?id=${userId}`)
    }).catch(err => {
      if (err.name === "SequelizeValidationError") {
        err = err.errors.map(el => {
          return el.message
        })
      }
      console.log(err);
      res.send(err)
    })
  }

  //Menghapus course
  static delete(req, res) {
    let { courseId } = req.params
    let { userId } = req.session
    Course.destroy({
      where: {
        id: courseId
      }
    }).then(result => {
      res.redirect(`/course/list?id=${userId}`)
    }).catch(err => {
      console.log(err);
      res.send(err)
    })
  }

}

module.exports = Controller