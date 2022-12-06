const User = require("../mongo").User
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

async function createUser(req, res) {
  const { email, password } = req.body

  const hashedPassword = await hashPassword(password)

  const user = new User({ email, password: hashedPassword })

  user
    .save()
    .then(() => res.status(201).send({ message: "utilisateur enregistré !" }))
    .catch(err => res.status(409).send({ message: "Utilisateur n'est pas enregistré" + err }))
}

function hashPassword(password) {
  const saltRounds = 10
  return bcrypt.hash(password, saltRounds)
}

async function logUser(req, res) {
  try {

    const email = req.body.email
    const password = req.body.password
    const user = await User.findOne({ email: email })

    const isPassWordOk = await bcrypt.compare(password, user.password)
    if (!isPassWordOk) {
      res.status(403).send({ message: "Mot de passe incorrect" })
    }
    if (isPassWordOk) {
      const token = createToken(user._id)
      res.status(200).send({ token: token, userId: user._id })
    }
  } catch (err) {
    console.error(err)
    res.status(500).send({ message: "erreur interne" })
  }

}

function createToken(userId) {
  const jwtPassword = process.env.JWT_PASSWORD
  const token = jwt.sign({ userId: userId }, jwtPassword, { expiresIn: "24h" })
  return token
}

//User.deleteMany({}).then(() => console.log("all removed")) supprime les users de la database
module.exports = { createUser, logUser }