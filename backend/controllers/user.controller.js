const { JWT_SECRET } = require("../config/config");
const { User } = require("../models/user.model");
const { signupBody } = require("../validators/user.validator");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
	// console.log("signup callback")
	// console.log(req.body);
	const { success } = signupBody.safeParse(req.body);
	if (!success) {
		return res.status(401).json({
			message: "Email is already taken /Incorrect inputs"
		})
	}
	const existingUser = await User.findOne({ username: req.body.username })
	if (existingUser) {
		return res.status(411).json({
			message: "Email Already exist"
		})
	}
	const user = await User.create({
		username: req.body.username,
		password: req.body.password,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
	});

	const userId = user._id;

	const token = jwt.sign({
		userId
	}, JWT_SECRET);

	return res.status(201).json({
		message: "User created successfully",
		token: token
	})

}

module.exports = {
	signup
}