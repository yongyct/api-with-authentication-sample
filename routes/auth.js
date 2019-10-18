const util = require('util');
const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const { registerValidation, loginValidation } = require('../utils/validation');

const env = process.env;

// Registration
router.post('/register', async (req, res) => {

	// Data Validation before Ops
	// Data format
	const { error: validationError } = registerValidation(req.body);
	if (validationError) {
		return res.status(400).send(validationError.details[0].message);
	}
	// Duplicate email
	const sameEmailUser = await User.findOne({ email: req.body.email });
	if (sameEmailUser) {
		return res.status(400).send('Email already registered.');
	}

	// Hash password
	const salt = await bcrypt.genSalt(env.N_SALT_ROUNDS);
	const hashedPassword = await bcrypt.hash(req.body.password, salt);

	const user = new User({
		name: req.body.name,
		email: req.body.email,
		password: hashedPassword
	});
	try {
		const savedUser = await user.save();
		res.send({ user: savedUser.__id });
	} catch (err) {
		console.log(util.format('Error saving model: %s', err));
		res.status(400).send(err);
	}
});

// Login
router.post('/login', async (req, res) => {
	// Data Validation before Ops
	// Data format
	const { error: validationError } = loginValidation(req.body);
	if (validationError) {
		return res.status(400).send(validationError.details[0].message);
	}
	// Check if email exists
	const sameEmailUser = await User.findOne({ email: req.body.email });
	if (!sameEmailUser) {
		return res.status(400).send('Wrong email or password.');
	}
	// Check password
	const validPass = await bcrypt.compare(req.body.password, sameEmailUser.password);
	if (!validPass) {
		return res.status(400).send('Wrong email or password.');
	}

	// Create and assign token
	// Token can also be generated and saved in cache layer e.g. Redis
	const token = jwt.sign({ _id: sameEmailUser._id }, env.TOKEN_SECRET);
	res.header('auth-token', token).send('Logged in.');

});


module.exports = router;
