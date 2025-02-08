const { JWT_SECRET } = require("../config/config");
const { User } = require("../models/user.model");
const { signupBody, signInBody } = require("../validators/user.validator");
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

	const _user = new User();

	const hashedPassword = await _user.createHash(req.body.password);

	const user = await User.create({
		username: req.body.username,
		password: hashedPassword,
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


const signIn = async (req, res) => {
	try {
		const { success, data } = signInBody.safeParse(req.body);
		if (!success) {
			return res.status(401).json({
				message: "Incorrect inputs"
			})
		}

		const user = await User.findOne({
			username: data.username,
		});
		if (!user) {
			return res.status(401).json({
				message: "Invalid credentials"
			})
		}

		const isPasswordValid = await user.validatePassword(data.password);
		if (!isPasswordValid) {
			return res.status(401).json({
				message: "Invalid credentials"
			})
		}
		const userId = user._id;
		const token = jwt.sign({
			userId
		}, JWT_SECRET);
		return res.status(200).json({
			message: "User logged in successfully",
			token: token
		})


	} catch (error) {
		console.log(error)
		return res.status(500).json({
			message: "Internal server error"
		})

	}
}

module.exports = {
	signup,
	signIn
}