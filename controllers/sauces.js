const mongoose = require("mongoose")
const { unlink } = require("fs")


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
    Product.find().then(products => res.status(200).send(products)).catch(error => res.status(500).send(error))
    // res.send({ message: [{ sauce: "sauce1" }, { sauce: "sauce2" }] })

}

async function getSaucesById(req, res) {
    try {
        const { id } = req.params
        const product = await Product.findById(id)
        res.send(product)
    }
    catch (error) {
        res.status(500).send(error)
    }
}

function DeleteSaucesById(req, res) {
    const { id } = req.params

    Product.findByIdAndDelete(id)
        .then(deleteImage)
        .then(product => res.send({ message: product }))
        .catch(err => res.status(500).send({ message: err }))
}

function deleteImage(product) {
    const imageUrl = product.imageUrl
    const fileToDelete = imageUrl.split("/").at(-1)
    unlink(`image/${fileToDelete}`, (err) => {
        console.error("Probleme a la suppression de l'image", err)
    })
    return product
}


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
module.exports = { getSauces, creatSauces, getSaucesById, DeleteSaucesById }