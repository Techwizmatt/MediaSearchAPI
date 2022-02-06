module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fullName: {
      type: DataTypes.VIRTUAL,
      get () {
        let fullName = this.getDataValue('phone')

        if (this.getDataValue('firstName') !== null && this.getDataValue('lastName') !== null) {
          fullName = `${this.getDataValue('firstName')} ${this.getDataValue('lastName')}`
        }

        return fullName
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    plexInviteToken: {
      type: DataTypes.STRING
    },
    isPlexAccepted: {
      type: DataTypes.BOOLEAN
    },
    tempCode: {
      type: DataTypes.STRING
    },
    firstLogin: {
      type: DataTypes.BOOLEAN
    },
    forceLogout: {
      type: DataTypes.BOOLEAN
    },
    isActive: {
      type: DataTypes.BOOLEAN
    },
    isAdmin: {
      type: DataTypes.BOOLEAN
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'users'
  })

  users.associate = function (models) {
    users.hasOne(models.usersPreferences, {
      foreignKey: 'id',
      targetKey: 'userId',
      as: 'preferences'
    })
  }

  return users
}
