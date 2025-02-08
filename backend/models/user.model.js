
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Create a Schema for Users
const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		lowercase: true,
		minLength: 3,
		maxLength: 30
	},
	password: {
		type: String,
		required: true,
		minLength: 6
	},
	firstName: {
		type: String,
		required: true,
		trim: true,
		maxLength: 50
	},
	lastName: {
		type: String,
		required: true,
		trim: true,
		maxLength: 50
	}
});

// Create a model from the schema

// Hashing the password before saving the user
userSchema.methods.createHash = async function (password) {
	const saltRounds = 10;
	const salt = await bcrypt.genSalt(saltRounds);
	return await bcrypt.hash(password, salt);
};

// Validating the candidate password with stored hash and hash function
userSchema.methods.validatePassword = async function (candidatePassword) {
	return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = {
	User
};