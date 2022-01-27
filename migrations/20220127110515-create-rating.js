'use strict';
module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('Ratings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      one: {
        type: Sequelize.INTEGER
      },
      two: {
        type: Sequelize.INTEGER
      },
      three: {
        type: Sequelize.INTEGER
      },
      four: {
        type: Sequelize.INTEGER
      },
      five: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('Ratings');
  }
};