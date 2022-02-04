'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require('bcryptjs')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.UserDetail, { foreignKey: "UserId" })
      User.belongsToMany(models.Course, { through: models.UserCourse })
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Username must be inputted"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Email must be inputted"
        }, isEmail: {
          msg: "Invalid email type"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Password must be inputted"
        },
        len: {
          args: [8],
          msg: 'password minimum 8 character'
        }
      }
    },
    role: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: {
          msg: "Role must be Chosen"
        }
      }
    }
  }, {
    hooks: {
      beforeCreate: (instance, option) => {
        let salt = bcrypt.genSaltSync(9);
        let hash = bcrypt.hashSync(instance.password, salt);
        instance.password = hash
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};