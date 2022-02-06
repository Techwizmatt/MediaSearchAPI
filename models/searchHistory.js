module.exports = (sequelize, DataTypes) => {
  const searchHistory = sequelize.define('searchHistory', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED
    },
    query: {
      type: DataTypes.STRING
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'searchHistory'
  })

  searchHistory.associate = function (models) {
    searchHistory.hasOne(models.users, {
      foreignKey: 'id',
      targetKey: 'userId',
      as: 'user'
    })
  }

  return searchHistory
}
