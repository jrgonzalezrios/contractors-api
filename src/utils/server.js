const express = require('express')


function startServer() {
    const app = express()
    const bodyParser = require('body-parser')
    app.use(bodyParser.json());

    require('../routes/index')(app)
    const {sequelize, Job} = require('../model')
    app.set('sequelize', sequelize)
    app.set('models', sequelize.models)
    return app
}

module.exports = {
    startServer
} 