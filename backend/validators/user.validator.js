// validation using zod
const zod = require('zod');

const signupBody = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string().min(2)
});

const signInBody = zod.object({
    username: zod.string().email(),
    password: zod.string()
});

const updateUserInfoBody = zod.object({
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string().min(6)
})


module.exports = {
    signupBody,
    signInBody,
    updateUserInfoBody,
}