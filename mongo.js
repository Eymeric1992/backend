const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")

const password = process.env.DB_PASSWORD
const username = process.env.DB_USER
 const uri =
  `mongodb+srv://${username}:${password}@cluster0.cbpim0t.mongodb.net/?retryWrites=true&w=majority`

  
mongoose
  .connect(uri)
  .then(() => console.log("connected to mongo"))
  .catch((err) => console.error("error conecting to mongo :", err))

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
})
userSchema.plugin(uniqueValidator)

const User = mongoose.model("User", userSchema)

module.exports = { mongoose, User }