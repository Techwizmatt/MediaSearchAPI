module.exports = (sequelize, DataTypes) => {
  const usersPreferences = sequelize.define('usersPreferences', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED
    },
    preferences: {
      type: DataTypes.JSON
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'usersPreferences'
  })

  return usersPreferences
}
