module.exports = (sequelize, DataTypes) => {
  const queue = sequelize.define('queue', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.ENUM('series', 'movie')
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED
    },
    queueStatusId: {
      type: DataTypes.INTEGER.UNSIGNED
    },
    parentMediaId: {
      type: DataTypes.INTEGER.UNSIGNED
    },
    mediaId: {
      type: DataTypes.INTEGER.UNSIGNED
    },
    nzbgetId: {
      type: DataTypes.INTEGER.UNSIGNED
    },
    fileId: {
      type: DataTypes.INTEGER.UNSIGNED
    },
    filename: {
      type: DataTypes.STRING
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'queue'
  })

  queue.associate = function (models) {
    queue.hasOne(models.users, {
      foreignKey: 'id',
      targetKey: 'userId',
      as: 'user'
    })
  }

  return queue
}
