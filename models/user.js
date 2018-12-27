module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    nick: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: { 
			type: DataTypes.STRING,
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
