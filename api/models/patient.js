const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const PatientSchema = mongoose.Schema({
	nationalID: {
    type: String,
		required: true,
		unique: true
  },
	gender: {
		type: String,
		required: true,
		enum: ['male', 'female']
	},
	fristName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true,
	},
	address: {
		street: String,
		city: String,
		state: String
	},
	dateOfBirth: {
		type: Date,
		required: true
	},
	phoneNumber: {
		type: String,
		required: true
	},
	bloodTybe:{
    type:String
  }
},{ _id : false });


module.exports = mongoose.model('Patient', PatientSchema);