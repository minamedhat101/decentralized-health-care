const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = mongoose.Schema({
	email: {
		type: String, required: true, unique: true,
		match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
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
	joinedOn: {
		type: Date,
		default: Date.now
	},
	userType: { type: mongoose.Schema.Types.ObjectId, ref: 'UserType' },
});


UserSchema.pre('save', function (next) {
	let user = this;

	// only hash the password if it has been modified (or is new)
	if (!user.isModified('password')) return next();

	// generate a salt
	bcrypt.genSalt(10, function (err, salt) {
		if (err) return next(err);

		// hash the password along with our new salt
		bcrypt.hash(user.password, salt, function (err, hash) {
			if (err) return next(err);

			// override the cleartext password with the hashed one
			user.password = hash;
			next();
		});
	});
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
		if (err) return cb(err);
		cb(null, isMatch);
	});
};


module.exports = mongoose.model('User', UserSchema);