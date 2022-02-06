module.exports = (sequelize, DataTypes) => {
  const preferences = sequelize.define('preferences', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    preferenceGroup: {
      type: DataTypes.STRING
    },
    preference: {
      type: DataTypes.STRING
    },
    defaultPreferenceValue: {
      type: DataTypes.BOOLEAN
    },
    title: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.STRING
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'preferences'
  })

  return preferences
}
