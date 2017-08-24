'use strict'
module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    id: { type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true, unique:true, allowNull:false },
    name: { type:DataTypes.STRING, allowNull:false },
    email: { type:DataTypes.STRING, allowNull:false, unique:true },
    encryptedPassword: { type:DataTypes.STRING, allowNull:false },
    isAdmin: { type:DataTypes.BOOLEAN }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        user.hasMany(models.post)
      }
    }
  })
  return user
}
