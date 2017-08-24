'use strict'
module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define('Post', {
    id: { type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true, unique:true, allowNull:false },
    title: { type:DataTypes.STRING, allowNull:false },
    preview: { type:DataTypes.STRING, allowNull:false },
    text: { type:DataTypes.STRING, allowNull:false },
    date: { type:DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull:false },
    author: {
      type: DataTypes.INTEGER,
      references:{
        model: User,
        key: 'id',
        deferrable: DataTypes.Deferrable.INITIALLY_IMMEDIATE
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  })
  return Post
}
