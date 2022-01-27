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
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Name must be inputted"
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: {
          msg: "Description must be inputted"
        }
      }
    },
    duration: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "Duration must be inputted"
        }
      }
    },
    videoUrl: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "URL must be inputted"
        }
      }
    },
    rating: DataTypes.INTEGER,
    CategoryId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      validate: {
        notNull: {
          msg: "Category must be choosed"
        }
      }
    },
    views: DataTypes.INTEGER
  }, {
    hooks: {
      beforeCreate: (instance, option) => {
        instance.rating = 0
        instance.views = 0
      }
    },
    sequelize,
    modelName: 'Course',
  });
  return Course;
};