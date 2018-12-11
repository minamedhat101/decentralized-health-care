const express = require('express');
const checkAuth = require('../middleware/check-auth');
const jwt = require('jsonwebtoken');

const router = express.Router();

const config = require('../config/database');
const User = require('../models/user');

router.post('/signup', (req, res) => {
	User.find({ email: req.body.email }).exec()
		.then(user => {
			if (user.length >= 1) {
				return res.status(409).json({
					message: 'Mail exists'
				});
			} else {
				const user = new User({
					email: req.body.email,
					password: req.body.password,
					gender: req.body.gender,
					fristName: req.body.fristName,
					lastName: req.body.lastName,
					dateOfBirth: req.body.dateOfBirth,
					phoneNumber: req.body.phoneNumber,
					address: {
						street: req.body.street,
						city: req.body.city,
						state: req.body.state
					}
				});

				user.save()
					.then(result => {
						console.log(result);
						res.status(201).json({
							message: 'Handling POST requests to /users',
							createdProduct: result
						});
					})
					.catch(err => {
						console.log(err);
						res.status(500).json({ error: err });
					});
			}
		});
});

router.post('/login', (req, res) => {
	User.findOne({ email: req.body.email }).exec()
		.then(user => {
			if (user.length > 1) {
				res.status(401).json({
					message: 'Auth Failed'
				});
			}
			user.comparePassword(req.body.password, (err, isMatch) => {
				if (err) {
					res.status(401).json({
						message: 'Auth Failed'
					});
				}
				if (isMatch) {
					const token = jwt.sign({ data: user }, config.secret, {
						expiresIn: 604800
					});
					res.json({
						success: true,
						token: token,
						user: {
							id: user._id,
							name: user.name,
							username: user.username,
							email: user.email
						}
					});
				} else {
					return res.json({ success: false, msg: err });
				}
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ error: err });
		});
});

router.get('/profile', checkAuth, (req, res) => {
	res.status(200).json({ name: 'MINA' })
})

router.delete('/:id', (req, res) => {
	User.remove({ _id: req.params.id })
		.exec()
		.then(result => {
			res.status(200).json({
				message: 'User deleted',
				result: result
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
});

module.exports = router;