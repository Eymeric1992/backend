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

function creatSauces(req, res) {
    const product = new Product({
        userId: "String",
        name: "String",
        manufacturer: "String",
        description: "String",
        mainPepper: "String",
        imageUrl: "String",
        heat: 3,
        likes: 3,
        dislikes: 3,
        usersLiked: ["String"],
        usersDisliked: ["String <userId>"],
    })
    product.save().then((res) => console.log("produit enregistré", res)).catch(console.error)


}
module.exports = { getSauces, creatSauces}