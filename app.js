const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const config = require('./api/config/database');

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




const appointmentRoute = require('./api/routes/users');
const articleRoute = require('./api/routes/article');
const complainRoute = require('./api/routes/complain');
const departmentRoute = require('./api/routes/department');
const employeeRoute = require('./api/routes/employee');
const hospitalRoute = require('./api/routes/hospital');
const roomRoute = require('./api/routes/room');
const roomTypeRoute = require('./api/routes/roomType');
const scheduleRoute = require('./api/routes/schedule');
const userRoute = require('./api/routes/users');
const userTypeRoute = require('./api/routes/userType');


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

app.get('/', (req, res)=>{
	console.log('mina')
	res.send('mina')
	
})

app.use('/user', userRoute);
app.use('/employee', employeeRoute);
app.use('/userType', userTypeRoute);
app.use('/article', articleRoute);
app.use('/appointment', appointmentRoute);
app.use('/complain', complainRoute);
app.use('/department', departmentRoute);
app.use('/hospital', hospitalRoute);
app.use('/room', roomRoute);
app.use('/roomType', roomTypeRoute);
app.use('/schedule', scheduleRoute);


module.exports = app;