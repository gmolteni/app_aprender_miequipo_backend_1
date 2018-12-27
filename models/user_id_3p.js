module.exports = function(sequelize, DataTypes) {
  var me= sequelize.define('UserId3p', {
    provider: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: "XPROV"
		},
		nick: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: "XPROV",
		},
		id3p: {
			type: DataTypes.STRING,
		}
  });

  me.associate = function(models) {
    me.belongsTo(models.User);
  };

  return me;
};
