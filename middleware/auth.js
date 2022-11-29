const jwt = require("jsonwebtoken")

function authUser(req, res, next) {
    console.log('authuser')
    const header = req.header("Authorization")
    if (header == null) return res.status(403).send({ message: "Invalide" })

    const token = header.split(" ")[1]
    if (token == null) return res.status(403).send({ message: "Token ne peut pas etre null" })

    jwt.verify(token, process.env.JWT_PASSWORD, (err, decoded) => {
        if (err) return res.status(403).send({ message: "Token invalide" + err })
console.log("le token est vraiment bien valide")
        next()

    })
}

module.exports = {authUser}