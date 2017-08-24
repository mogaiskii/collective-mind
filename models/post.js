'use strict'
module.exports = function(sequelize, DataTypes) {
  var post = sequelize.define('post', {
    id: { type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true, unique:true, allowNull:false },
    title: { type:DataTypes.STRING, allowNull:false },
    preview: { type:DataTypes.STRING, allowNull:false },
    text: { type:DataTypes.STRING, allowNull:false },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        post.belongsTo(models.user, {
          foreignKey: { allowNull:false }
        })
      }
    }
  })
  return post
}
