const express = require('express');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/checkAuthUser');

const router = express.Router();

const config = require('../config/database');
const Employee = require('../models/employee');

router.post('/signup', async (req, res) => {
	Employee.find({ email: req.body.email }).exec()
		.then(employee => {
			if (employee.length >= 1) {
				return res.status(409).json({
					message: 'Mail exists'
				});
			} else {
				const employee = new Employee({
					email: req.body.email,
					password: req.body.password,
					gender: req.body.gender,
					fristName: req.body.fristName,
					lastName: req.body.lastName,
					dateOfBirth: req.body.dateOfBirth,
					phoneNumber: req.body.phoneNumber,
					nationalID: req.body.nationalID,
					userType: req.body.userType,
					address: {
						street: req.body.street,
						city: req.body.city,
						state: req.body.state
					}
				});

				employee.save()
					.then(result => {
						console.log(result);
						res.status(201).json({
							message: 'Handling POST requests to /employees',
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

router.post('/login', async (req, res) => {
	Employee.findOne({ email: req.body.email }).exec()
		.then(employee => {
			if (employee.length > 1) {
				res.status(401).json({
					message: 'Auth Failed'
				});
			}
			employee.comparePassword(req.body.password, (err, isMatch) => {
				if (err) {
					res.status(401).json({
						message: 'Auth Failed'
					});
				}
				if (isMatch) {
					const token = jwt.sign({ data: employee }, config.secret, {
						expiresIn: 604800
					});
					res.json({
						success: true,
						token: token,
						employee: {
							id: employee._id,
							name: employee.name,
							username: employee.username,
							email: employee.email
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


router.get('/profile', checkAuth, async (req, res) => {
	try {
		return res.status(200).json({ result: req.userData })
	} catch (err) {
		console.log(err);
		res.status(500).json({
			error: err
		});
	}
});

router.get('/', async (req, res) => {
	try {
		let employee = await Employee.find().exec();
		if (employee) {
			return res.status(200).json({ result: employee })
		} else {
			res.status(404).json({ message: "No valid entry found for provided ID" });
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({
			error: err
		});
	}
})

router.get('/profile/:id', async (req, res) => {
	try {
		let employee = await Employee.findById(req.params.id).exec();
		if (employee) {
			return res.status(200).json({ result: employee })
		} else {
			res.status(404).json({ message: "No valid entry found for provided ID" });
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({
			error: err
		});
	}
})

router.get('/:query', async (req, res) => {
	try {
		const query = req.params.query;
		let employee = await Employee.find({$or: [{fristName: query}, {email: query}, {lastName: query}]}).exec();
		if (employee) {
			return res.status(200).json({ result: employee })
		} else {
			res.status(404).json({ message: "No valid entry found for provided query" });
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({
			error: err
		});
	}
})

router.delete('/:id', async (req, res) => {
	Employee.remove({ _id: req.params.id })
		.exec()
		.then(result => {
			res.status(200).json({
				message: 'employee deleted',
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