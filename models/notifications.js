module.exports = (sequelize, DataTypes) => {
  const notifications = sequelize.define('notifications', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    typeId: {
      type: DataTypes.INTEGER.UNSIGNED
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED
    },
    notifiedAt: {
      type: DataTypes.DATE
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'notifications'
  })

  notifications.associate = function (models) {
    notifications.hasOne(models.notificationTypes, {
      foreignKey: 'id',
      targetKey: 'typeId',
      as: 'type'
    })

    notifications.hasOne(models.users, {
      foreignKey: 'id',
      targetKey: 'userId',
      as: 'user'
    })
  }

  return notifications
}
