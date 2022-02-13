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
  downloads: sequelize.import(path.join(process.cwd(), '/models/downloads')),
  notifications: sequelize.import(path.join(process.cwd(), '/models/notifications')),
  notificationTypes: sequelize.import(path.join(process.cwd(), '/models/notificationTypes')),
  preferences: sequelize.import(path.join(process.cwd(), '/models/preferences')),
  searchHistory: sequelize.import(path.join(process.cwd(), '/models/searchHistory')),
  users: sequelize.import(path.join(process.cwd(), '/models/users')),
  media: sequelize.import(path.join(process.cwd(), '/models/media')),
  queue: sequelize.import(path.join(process.cwd(), '/models/queue')),
  queueStatuses: sequelize.import(path.join(process.cwd(), '/models/queueStatuses')),
  usersPreferences: sequelize.import(path.join(process.cwd(), '/models/usersPreferences'))
}

Object.keys(models).forEach(model => {
  if ('associate' in models[model]) {
    models[model].associate(models)
  }
})

module.exports = { sequelize, Sequelize, models }
