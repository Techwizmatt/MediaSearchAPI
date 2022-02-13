module.exports = (sequelize, DataTypes) => {
  const queueStatuses = sequelize.define('queueStatuses', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    key: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'queueStatuses'
  })

  queueStatuses.associate = function (models) {
    queueStatuses.belongsTo(models.queue, {
      foreignKey: 'id',
      targetKey: 'queueStatusId',
      as: 'status'
    })
  }

  return queueStatuses
}
