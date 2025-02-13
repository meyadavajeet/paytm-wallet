const { default: mongoose } = require("mongoose");
const { Account } = require("../models/account.model");

const getAccountBalance = async (req, res) => {
  try {
    const _accountDetails = await Account.findOne({ userId: req.userId });
    return res.status(200).json({
      balance: _accountDetails.balance
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Internal server error"
    })
  }
}

// bad solution because it is not atomic
// const transferMoney = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const { to, amount } = req.body;

//     const _from = await Account.findOne({ userId: req.userId }).session(session);
//     const _to = await Account.findOne({ userId: to }).session(session);

//     if (!_from || !_to) {
//       await session.abortTransaction();
//       return res.status(404).json({
//         message: "Account not found"
//       })
//     }

//     if (_from.balance < amount) {
//       await session.abortTransaction();
//       return res.status(400).json({
//         message: "Insufficient balance"
//       })
//     }

//     // perform the transfer
//     await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
//     await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

//     await session.commitTransaction();
//     session.endSession();
//     return res.status(200).json({
//       message: "Transfer successful"
//     })

//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     console.log(error)
//     return res.status(500).json({
//       message: "Internal server error"
//     })
//   }
// }

const transferMoney = async (req, res) => {

  try {
    const { to, amount } = req.body;

    const _from = await Account.findOne({ userId: req.userId })
    const _to = await Account.findOne({ userId: to })

    if (!_from || !_to) {
      return res.status(404).json({
        message: "Account not found"
      })
    }

    if (_from.balance < amount) {
      return res.status(400).json({
        message: "Insufficient balance"
      })
    }

    // perform the transfer
    await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } })
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } })


    return res.status(200).json({
      message: "Transfer successful"
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Internal server error"
    })
  }
}


module.exports = {
  getAccountBalance,
  transferMoney,
}