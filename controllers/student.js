const res = require('express/lib/response')
const {User, UserDetail, Course, Category, Rating, Sequelize} = require('../models/index.js');
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
    Course.findAll({
      order: Sequelize.literal('"createdAt" DESC')
    })
      .then(coursesData => {
        coursesData.forEach(e => {
          console.log(e.videoUrl);
        });
        res.render('student', {coursesData})
      })
      .catch( err => {
        res.send(err);
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
          where: {id: id}
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
        res.render('watchCourse', {courseData})
      })
      .catch(err => {
        res.send(err)
      })
  }

  static addRating(req, res) {
    req.query()
    let column = {}
    Rating.update()
  }
}

module.exports = Controller