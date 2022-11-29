const mongoose = require("mongoose")


const productSchema = new mongoose.Schema({
    userId: String,
    name: String,
    manufacturer: String,
    description: String,
    mainPepper: String,
    imageUrl: String,
    heat: Number,
    likes: Number,
    dislikes: Number,
    usersLiked: [String],
    usersDisliked: ["String <userId>"],
})
const Product = new mongoose.model("Product", productSchema)



function getSauces(req, res) {
    //authUser(req, res)

    console.log("on est dans getsauces")
    Product.find({}).then(products => res.send(products))
    // res.send({ message: [{ sauce: "sauce1" }, { sauce: "sauce2" }] })

}
/*
function creatSauces(req, res) {
    console.log(__dirname)
    const sauce = JSON.parse(req.body.sauce)
    const { name, manufacturer, description, mainPepper, heat, userId } = sauce
    console.log({ body: req.body.sauce })
    console.log({ file: req.file })
const imageUrl = /*req.file.destination + */ /*req.file.filename

function makeImageUrl(req, imageUrl) {
    return req.protocol + "://" + req.get("host") + "/image/" + imageUrl
}
    const product = new Product({
        userId,
        name,
        manufacturer,
        description,
        mainPepper,
        imageUrl: makeImageUrl(req, imageUrl),
        heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
    })
    product.save().then((res) => console.log("produit enregistré", res)).catch(console.error) 

}*/

function makeImageUrl(req, fileName) {
    return req.protocol + "://" + req.get("host") + "/image/" + fileName
}
function creatSauces(req, res) {
    const { body, file } = req
    const { fileName } = file
    const sauce = JSON.parse(body.sauce)
    const { name, manufacturer, description, mainPepper, heat, userId } = sauce

    const product = new Product({
        userId: userId,
        name: name,
        manufacturer: manufacturer,
        description: description,
        mainPepper: mainPepper,
        imageUrl: makeImageUrl(req, fileName),
        heat: heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    })
    product
        .save()
        .then((message) => res.status(201).send({ message }))
        .catch((err) => res.status(500).send(err))
}
//Product.deleteMany({}).then(() => console.log("all removed"))
module.exports = { getSauces, creatSauces }