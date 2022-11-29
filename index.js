require('dotenv').config()
const express = require("express")
const app = express()
const cors = require("cors")
const port = 3000

//console.log("variable d'environnement:", process.env.MOTDEPASSE)

// connection to database
require("./mongo")

// Controllers 
const {createUser, logUser} = require("./controllers/users")
const {getSauces, creatSauces} = require("./controllers/sauces")
//const {} = require("./controllers/sauces")
 
//Middleware
app.use(cors());
app.use(express.json());
const{authUser} = require("../backend/middleware/auth")

// Routes 
app.post("/api/auth/signup", createUser)
app.post("/api/auth/login", logUser)
app.get("/api/sauces", authUser, getSauces)
app.post('/api/sauces', authUser, creatSauces)
app.get("/", (req, res) => res.send("Hello World"))

//Listen
app.listen(port, () => console.log("listening on port" + port))

