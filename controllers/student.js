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
        return Rating.findByPk(courseData.rating)
      })
      .then(ratingData => {
        let totalRating = (ratingData.five * 5) + (ratingData.four * 4) + (ratingData.three * 3) + (ratingData.two * 2) + (ratingData.one * 1)
        let totalVote = ratingData.one + ratingData.two + ratingData.three + ratingData.four + ratingData.five;
        let avgRating = totalRating / totalVote;
        courseData.starRating = avgRating
        res.render('watchCourse', {courseData})
      })
      .catch(err => {
        res.send(err)
      })
  }

  static addRating(req, res) {
    let rating = req.query.rating
    Course.findByPk(req.params.id)
      .then(courseData => {
        console.log(courseData.rating);
        let voteColumn = rating == 1 ? 'one' : rating == 2 ? 'two' : rating == 3 ? 'three' : rating == 4 ? 'four' : 'five';
        return Rating.increment(voteColumn, {
          where: {id: courseData.rating}
        })
      })
      .then(()=> {
        res.redirect(`/course/${req.params.id}/watch`)
      })
      .catch(err => {
        res.send(err)
      })
  }
}

module.exports = Controller