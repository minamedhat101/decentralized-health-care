const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const config = require('./config/database');

//mongoose.connect('mongodb://localhost:27017/healthCare');

mongoose.connect(config.database,
	{
		useCreateIndex: true,
		useNewUrlParser: true 
	}, err => {
	if (err) return console.log(err);
	console.log('Connected to DB');
});

app.use(cors());
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const usersRoute = require('./api/routes/users');

app.get('/', (req, res)=>{
	console.log('mina')
	res.send('mina')
	
})

app.use('/users', usersRoute);


app.use((req, res, next) => {
	const error = Error('Not found!');
	error.status = 404;
	next(error);
});

app.use((error, req, res) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message,
			status: error.status
		}
	});
});

module.exports = app;