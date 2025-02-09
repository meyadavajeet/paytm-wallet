const { default: mongoose, Schema } = require("mongoose");


const accountSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  balance: {
    type: Number,
    required: true
  },
  accountNumber: {
    type: String,
  },
});

const Account = mongoose.model("Account", accountSchema);

module.exports = {
  Account
};