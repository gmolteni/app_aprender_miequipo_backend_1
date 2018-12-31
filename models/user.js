module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    nick: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: 'nick',
		},
		email: { 
			type: DataTypes.STRING,
			unique: 'email',
			validate: {
				isEmail: true,
			}
		},
  });

  User.associate = function(models) {
    models.User.hasMany(models.Task);
  };

  return User;
};
