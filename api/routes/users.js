const express = require('express');
const role = require('../middleware/authorize');
const jwt = require('jsonwebtoken');

const router = express.Router();

const User = require('../models/user');

router.post('/signup', (req, res,) => {
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
					userType: '5c5830f11d09ac00175a6b45',
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
					const token = jwt.sign({ data: user }, process.env.SECRET, {
						expiresIn: 604800
					}); 
					res.status(200).json({
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

router.get('/profile', role(['user']), async (req, res) => {
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
		let user = await User.find().exec();
		if (user) {
			return res.status(200).json({ result: user })
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
		let user = await User.findById(req.params.id).exec();
		if (user) {
			return res.status(200).json({ result: user })
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
		let user = await User.find({$or: [{fristName: query}, {email: query}, {lastName: query}]}).exec();
		if (user) {
			return res.status(200).json({ result: user })
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

router.patch('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updateOps = {};
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }
    let user = await User.update({ _id: id }, { $set: updateOps }).exec();
    res.status(200).json({
      message: "user updated",
      request: {
        result: user
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

module.exports = router;