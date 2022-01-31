module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: DataTypes.STRING
    },
    lastName: {
      type: DataTypes.STRING
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
      type: DataTypes.STRING
    },
    tempCode: {
      type: DataTypes.STRING
    },
    isActive: {
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

  return users
}
