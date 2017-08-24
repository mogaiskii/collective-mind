'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        allowNull:false,
        type: Sequelize.STRING
      },
      preview: {
        allowNull: false,
        type: Sequelize.STRING
      },
      text: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      userid:{
        allowNull:false,
        type: Sequelize.INTEGER,
        references:{
          model:'User',
          key:'id'
        }
      }
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Posts');
  }
};
