const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
	email: {
		type: String, required: true, unique: true,
		match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
	},
	password: {
		type: String,
		required: true,
	}
});


userSchema.pre('save', function(next) {
	var user = this;

	// only hash the password if it has been modified (or is new)
	if (!user.isModified('password')) return next();

	// generate a salt
	bcrypt.genSalt(10, function(err, salt) {
			if (err) return next(err);

			// hash the password along with our new salt
			bcrypt.hash(user.password, salt, function(err, hash) {
					if (err) return next(err);

					// override the cleartext password with the hashed one
					user.password = hash;
					next();
			});
	});
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
			if (err) return cb(err);
			cb(null, isMatch);
	});
};


module.exports = mongoose.model('User', userSchema);