const res = require('express/lib/response')
const {User, UserDetail, Course, Category, Sequelize} = require('../models/index.js');
const session = require("express-session")

class Controller {
  static StudentData(req, res) {
    User.findAll({
      where: {
        role: 'student'
      }
    })
      .then( studentData => {
        res.render('studentProfile', {studentData});
      })
      .catch( err => {
        res.send(err);
      })
  }

  static showCourse(req, res) {
    Course.findAll()
      .then(coursesData => {
        res.render('student', {coursesData})
      })
  }

  static watchCourse(req, res) {
    let id = req.params.id
    let courseData
    let userId
    Course.findByPk(id, {
      include: {
        model: Category
      }
    })
      .then(result => {
        courseData = result;
        return Course.increment('views', {
          where: {id: result.id}
        })
      })
      .then(() => {
        userId = req.session.userId;
        return UserDetail.update({
          learningTime: Sequelize.literal(`"learningTime" + ${courseData.duration}`)
        }, {
          where: {UserId: userId}
        })
      })
      .then(() => {
        res.render('watchCourse')
      })
      .catch(err => {
        res.send(err)
      })
  }
}

module.exports = Controller