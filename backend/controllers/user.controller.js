const { JWT_SECRET } = require("../config/config");
const { Account } = require("../models/account.model");
const { User } = require("../models/user.model");
const { signupBody, signInBody, updateUserInfoBody } = require("../validators/user.validator");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
	try {
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

		// create account for the user and give random balance between 0 and 1000
		const account = await Account.create({
			userId: userId,
			balance: Math.floor(Math.random() * 10000),
			accountNumber: Math.floor(Date.now() / 1000) // Math.floor(Math.random() * 1000000000),
		});

		const token = jwt.sign({
			userId
		}, JWT_SECRET);

		return res.status(201).json({
			message: "User created successfully",
			token: token,
			account
		})
	} catch (error) {
		console.log(error)
		return res.status(500).json({
			message: "Internal server error"
		})
	}
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

// update userInformation except email/username
const updateUserInfo = async (req, res) => {
	try {
		const { success, data } = updateUserInfoBody.safeParse(req.body);
		if (!success) {
			return res.status(411).json({
				message: "Incorrect inputs"
			})
		}
		// find the user by id
		const user = await User.findById(req.userId);
		const userId = req.userId;
		const _hashedPassword = await user.createHash(data.password);

		await User.updateOne({
			_id: userId
		}, {
			firstName: data.firstName,
			lastName: data.lastName,
			password: _hashedPassword
		});
		return res.status(200).json({
			message: "User updated successfully",
		})
	} catch (error) {
		console.log(error)
		return res.status(500).json({
			message: "Internal server error"
		})

	}
}

const getUserInfo = async (req, res) => {
	try {
		const user = await User.findById(req.userId);
		return res.status(200).json({
			user
		})
	} catch (error) {
		console.log(error)
		return res.status(500).json({
			message: "Internal server error"
		})
	}
}

// filter user by id, firstName, lastName
// const filterUser = async (req, res) => {
// 	try {
// 		const user = await User.find(
// 			{
// 				$or:
// 					[
// 						{ 'id': req.userId },
// 						{ 'firstName': req.param }, { 'lastName': req.param }]
// 			},
// 			{ 'username': 1, 'firstName': 1, 'lastName': 1 },
// 			(err, docs) => {
// 				if (!err) {
// 					return res.status(200).json({
// 						docs
// 					})

// 				}
// 			});
// 	} catch (error) {
// 		console.log(error)
// 		return res.status(500).json({
// 			message: "Internal server error"
// 		})
// 	}
// }

const filterUser = async (req, res) => {
	try {
		const filter = req.query.filter || "";
		const users = await User.find({
			$or: [

				{
					firstName: {
						$regex: filter,
						$options: "i"
					}
				},
				{
					lastName: {
						$regex: filter,
						$options: "i"
					}
				},
				{
					username: {
						$regex: filter,
						$options: "i"
					}
				}
			]
		});
		return res.status(200).json({
			user: users.map(user => ({
				username: user.username,
				firstName: user.firstName,
				lastName: user.lastName,
				_id: user._id
			}))
		});
	} catch (error) {
		console.log(error)
		return res.status(500).json({
			message: "Internal server error"
		})
	}
}

module.exports = {
	signup,
	signIn,
	updateUserInfo,
	getUserInfo,
	filterUser,
}