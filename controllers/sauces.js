const mongoose = require("mongoose")
const { unlink } = require("fs/promises")


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
        .then(product => sendClientResponse(product, res))
        .then((item) => deleteImage(item))
        .then((res) => console.log('file deleted', res))
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
/*
function modifySauce(req, res) {
    const { body, file } = req
    const sauce = JSON.parse(body.sauce)
    const { name, manufacturer, description, mainPepper, heat, userId } = sauce
    const id = req.params.id
    console.log({ body, file })
    Product.findByIdAndUpdate(id, {name, manufacturer, description, mainPepper, heat, userId })  
}
*/

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

function modifySauce(req, res) {
    const {
        params: { id }
    } = req

    console.log("req.file", req.file)
    const hasNewImage = req.file != null

    const payload = makePayLoad(hasNewImage, req)

    Product.findByIdAndUpdate(id, payload)
        .then((dbResponse) => sendClientResponse(dbResponse, res))
        .then((product) => deleteImage(product))
        .then((res) => console.log('file deleted', res))

        .catch((err) => console.error("probleme update", err))
}

function deleteImage(product){
    if (product == null) return
    const imageToDelete = product.imageUrl.split("/").at(-1)
    return unlink(`image/${imageToDelete}`)
}

function makePayLoad(hasNewImage, req) {
    console.log("hasnewimage", hasNewImage)
    if (!hasNewImage) return req.body
    const payload = JSON.parse(req.body.sauce)
    payload.imageUrl = makeImageUrl(req, req.file.fileName)
    return payload
}

function sendClientResponse(product, res) {
    if (product == null) {
        console.log("nothing to update")
        return res.status(404).send({ message: "objet non trouvé dans la base de données" })
    }
    console.log("all good, update", product)
    return Promise.resolve(res.status(200).send({ message: "successfull update" }))
        .then(() => product)
}

/*
const hasNewImage = req.file != null
const payLoad = makePayLoad(hasNewImage, req)
Product.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id }, payLoad)
    .then(() => res.status(200).json({ message: 'Objet modifié !' }))
    .catch(error => res.status(400).json({ error }));*/


/*
function makePayLoad(hasNewImage, req) {
    if (!hasNewImage) return req.body
    const payLoad = JSON.parse(req.body.sauce)
    payLoad.imageUrl = makeImageUrl(req, req.file.fileName)
    return payLoad
}
*/
//Product.deleteMany({}).then(() => console.log("all removed"))
module.exports = { getSauces, creatSauces, getSaucesById, DeleteSaucesById, modifySauce }

