module.exports = (sequelize, DataTypes) => {
  const notificationTypes = sequelize.define('notificationTypes', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    preferenceId: {
      type: DataTypes.INTEGER.UNSIGNED
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'notificationTypes'
  })

  notificationTypes.associate = function (models) {
    notificationTypes.hasOne(models.preferences, {
      foreignKey: 'id',
      targetKey: 'preferenceId',
      as: 'preference'
    })
  }

  return notificationTypes
}
