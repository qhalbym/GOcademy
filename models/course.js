'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Course.belongsTo(models.Category, { foreignKey: 'CategoryId' })
      Course.belongsToMany(models.User, { through: models.UserCourse })
    }
  }
  Course.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    duration: DataTypes.INTEGER,
    videoUrl: DataTypes.STRING,
    rating: DataTypes.INTEGER,
    CategoryId: DataTypes.INTEGER,
    views: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};