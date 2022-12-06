const jwt = require("jsonwebtoken")


function authUser(req, res, next) {
    console.log('authuser')
    const header = req.header("Authorization")
    if (header == null) return res.status(403).send({ message: "Invalide" })

    const token = header.split(" ")[1]
    if (token == null) return res.status(403).send({ message: "Token ne peut pas etre null" })

const decodedToken =  jwt.verify(token, process.env.JWT_PASSWORD)
    req.auth = {
        userId: decodedToken.userId
    }
    next()
}

module.exports = { authUser }