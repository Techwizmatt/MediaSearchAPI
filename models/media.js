module.exports = (sequelize, DataTypes) => {
  const media = sequelize.define('media', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.ENUM('series', 'movie')
    },
    mediaId: {
      type: DataTypes.INTEGER.UNSIGNED
    },
    serviceId: {
      type: DataTypes.INTEGER.UNSIGNED
    },
    title: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.STRING
    },
    poster: {
      type: DataTypes.STRING
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'media'
  })

  return media
}
