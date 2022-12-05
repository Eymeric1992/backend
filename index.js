require('dotenv').config()
const express = require("express")
const app = express()
const cors = require("cors")
const port = 3000
const bodyParser = require("body-parser")
const path = require('path')

// connection to database
require("./mongo")

// Controllers 
const {createUser, logUser} = require("./controllers/users")
const {sendClientResponse, getSauce, getSauces, createSauce, getSauceById, deleteSauce, modifySauce, likeSauce} = require("./controllers/sauces")

 
//Middleware
const{authUser} = require("../backend/middleware/auth")

app.use(cors());
app.use(express.json());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))


const multer = require ('multer')
const storage = multer.diskStorage({
    destination: "image",
    filename: function (req, file, cb) {
      cb(null, makeFileName(req, file))
    }
  }) 
  function makeFileName(req, file) {
    console.log("req, file:", file)
    const fileName = `${Date.now()}-${file.originalname}`.replace(/\s/g, "-")
    file.fileName = fileName
    return fileName
  }
  const upload = multer ({ storage: storage})


  // Routes 
app.post("/api/auth/signup", createUser)
app.post("/api/auth/login", logUser)


app.get("/api/sauces", authUser, getSauces)
app.post('/api/sauces', authUser, upload.single("image"), createSauce)
app.get("/api/sauces/:id", authUser, getSauceById)
app.delete("/api/sauces/:id", authUser, deleteSauce)
app.put('/api/sauces/:id', authUser,upload.single("image"), modifySauce)
app.post("/api/sauces/:id/like", authUser, likeSauce)





//Listen


app.use("/image", express.static(path.join(__dirname, "image")))
app.listen(port, () => console.log("listening on port" + port))
