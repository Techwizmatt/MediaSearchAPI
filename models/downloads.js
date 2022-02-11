module.exports = (sequelize, DataTypes) => {
  const downloads = sequelize.define('downloads', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    mediaId: {
      type: DataTypes.INTEGER.UNSIGNED
    },
    downloadId: {
      type: DataTypes.INTEGER.UNSIGNED
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED
    },
    type: {
      type: DataTypes.ENUM('episode', 'movie')
    },
    title: {
      type: DataTypes.STRING
    },
    failedAt: {
      type: DataTypes.DATE
    },
    completedAt: {
      type: DataTypes.DATE
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'downloads'
  })

  downloads.associate = function (models) {
    downloads.hasOne(models.users, {
      foreignKey: 'id',
      targetKey: 'userId',
      as: 'user'
    })
  }

  return downloads
}
