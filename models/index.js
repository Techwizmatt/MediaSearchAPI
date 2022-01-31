const path = require('path')
const Sequelize = require('sequelize')
const sequelize = new Sequelize(
  {
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOSTNAME,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    define: {
      timestamps: false
    },
    logging: console.log
  }
)

const models = {
  users: sequelize.import(path.join(process.cwd(), '/models/users'))
}

Object.keys(models).forEach(model => {
  if ('associate' in models[model]) {
    models[model].associate(models)
  }
})

module.exports = { sequelize, Sequelize, models }
