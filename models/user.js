'use strict'
var bcrypt = require('bcrypt')
module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    id: { type:DataTypes.INTEGER, primaryKey:true, autoIncrement:true, unique:true, allowNull:false },
    name: { type:DataTypes.STRING, allowNull:false },
    email: { type:DataTypes.STRING, allowNull:false, unique:true },
    encryptedPassword: { type:DataTypes.STRING, allowNull:false },
    isAdmin: { type:DataTypes.BOOLEAN }
  }, {
    setterMethods:{
      password: function(val){
        var salt = bcrypt.genSaltSync(10)
        var hash = bcrypt.hashSync(val, salt)
        this.setDataValue('encryptedPassword', hash)
      }
    },
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        user.hasMany(models.post)
      }
    }
  })
  user.prototype.comparePassword = function (password) {
    var result = bcrypt.compareSync(password, this.encryptedPassword)
    return result
  }
  return user
}
