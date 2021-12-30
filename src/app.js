const express = require('express');
const bodyParser = require('body-parser');
const {sequelize, Job} = require('./model')
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

require('./routes/index')(app)

app.get('/', (req, res) => {
	res.send(`
		<h2>DEEL BACKEND TASK</h2>`);
});

module.exports = app;
