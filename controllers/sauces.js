const mongoose = require("mongoose")
const fs = require("fs")

const productSchema = new mongoose.Schema({
    userId: String,
    name: String,
    manufacturer: String,
    description: String,
    mainPepper: String,
    imageUrl: String,
    heat: { type: Number, min: 1, max: 5 },
    likes: Number,
    dislikes: Number,
    usersLiked: [String],
    usersDisliked: [String]
})

const Product = mongoose.model("Product", productSchema)

function getSauces(req, res) {
    Product.find({})
        .then((products) => res.send(products))
        .catch((error) => res.status(500).send(error))
}

function getSauce(req, res) {
    const { id } = req.params
    return Product.findById(id)
}

function getSauceById(req, res) {
    getSauce(req, res)
        .then((product) => sendClientResponse(product, res))
        .catch((err) => res.status(500).send(err))
}

function deleteSauce(req, res) {
    const { id } = req.params
    Product.findByIdAndDelete(id)
        .then((product) => sendClientResponse(product, res))
        .then((item) => deleteImage(item))
      //  .then((res) => console.log("FILE DELETED", res))
        .catch(err => res.status(400).send({err}))
}

function modifySauce(req, res) {
    const {
        params: { id }
    } = req

    const hasNewImage = req.file != null
    const payload = makePayload(hasNewImage, req)

    const ObjUserId = payload.userId
    console.log("userId de l'objet:", ObjUserId)

    const bodyReq = JSON.parse(JSON.stringify(req.body))
    //console.log("VOICI le body de la requete:", JSON.parse(bodyReq.sauce))

    let userId = req.auth.userId     //JSON.parse(bodyReq.sauce).userId
    console.log("VOICI USERID de la requete:", userId)

    if (userId === ObjUserId) {
        Product.updateOne({ _id: req.params.id }, payload)
            .then((dbResponse) => sendClientResponse(dbResponse, res))
            .then((product) => deleteImage(product))
            .then((res) => console.log("FILE DELETED", res))
            .catch((err) => console.error("PROBLEM UPDATING", err))
    }

    //return res.status(403).send({ message: "TU N'IRAS PAS PLUS LOIN" })
    //req.findUpd
};

function deleteImage(product) {
    if (product == null) return
const imageUrl = product.imageUrl
   // console.log("IMAGE URL A SUPRIMER :", imageUrl)
   const imageToDelete = imageUrl.split('/').at(-1);
  fs.unlink(`image/${imageToDelete}`,()=>{})
}

function makePayload(hasNewImage, req) {
    console.log("hasNewImage:", hasNewImage)
    if (!hasNewImage) return req.body
    const payload = JSON.parse(req.body.sauce)
    payload.imageUrl = makeImageUrl(req, req.file.fileName)
    console.log("NOUVELLE IMAGE A GERER")
    console.log("voici le payload:", payload)
    return payload
}

function sendClientResponse(product, res) {
    if (product == null) {
        console.log("NOTHING TO UPDATE")
        return res.status(404).send({ message: "Object not found in database" })
    }
    console.log("ALL GOOD, UPDATING:", product)
    return Promise.resolve(res.status(200).send(product)).then(() => product)
}

function makeImageUrl(req, fileName) {
    
    return req.protocol + "://" + req.get("host") + "/image/" + fileName
}

function createSauce(req, res) {
    const { body, file } = req
    const { fileName } = file
    const sauce = JSON.parse(body.sauce)
    const { name, manufacturer, description, mainPepper, heat, userId } = sauce

    const product = new Product({
        userId: req.auth.userId,
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

function likeSauce(req, res) {
    const { like, userId } = req.body
    //La méthode includes() determine si un tableau contient une valeur et renvoie true si c'est le cas, false sinon.
    if (![1, -1, 0].includes(like)) return res.status(403).send({ message: "Invalid like value" })

    getSauce(req, res)
        .then((product) => updateVote(product, like, userId, res))
        .then((pr) => pr.save())
        .then((prod) => sendClientResponse(prod, res))
        .catch((err) => res.status(500).send(err))
}

function updateVote(product, like, userId, res) {
    if (like === 1 || like === -1) return incrementVote(product, userId, like)
    return resetVote(product, userId, res)
}

function resetVote(product, userId, res) {
    const { usersLiked, usersDisliked } = product

    //La méthode every() permet de tester si tous les éléments d'un tableau vérifient
    // une condition donnée par une fonction en argument.
    // Cette méthode renvoie un booléen pour le résultat du test.


    //La méthode Promise.reject(raison) renvoie un objet Promise qui est rejeté
    // (la promesse n'est pas tenue) à cause d'une raison donnée.

    if ([usersLiked, usersDisliked].every((arr) => arr.includes(userId)))
        return Promise.reject("User seems to have voted both ways")

    //La méthode some() teste si au moins un élément du tableau passe le test implémenté 
    //par la fonction fournie. Elle renvoie un booléen indiquant le résultat du test.

    if (![usersLiked, usersDisliked].some((arr) => arr.includes(userId)))
        return Promise.reject("User seems to not have voted")

    //La méthode filter() crée et retourne un nouveau tableau contenant tous
    // les éléments du tableau d'origine qui remplissent une condition déterminée par la fonction callback.

    if (usersLiked.includes(userId)) {
        --product.likes
        product.usersLiked = product.usersLiked.filter((id) => id !== userId)
    } else {
        --product.dislikes
        product.usersDisliked = product.usersDisliked.filter((id) => id !== userId)
    }
    return product
}

function incrementVote(product, userId, like) {
    const { usersLiked, usersDisliked } = product
    // est ce que like est égal a 1 ? si oui on push dans usersliked sinon dans userdisliked
    const votersArray = like === 1 ? usersLiked : usersDisliked
    if (votersArray.includes(userId)) return product

    //La méthode push() ajoute un ou plusieurs éléments à la fin d'un tableau 
    //et retourne la nouvelle taille du tableau
    votersArray.push(userId)

    like === 1 ? ++product.likes : ++product.dislikes
    return product
}
//Product.deleteMany({}).then(() => console.log("all removed"))

module.exports = { sendClientResponse, getSauce, getSauces, createSauce, getSauceById, deleteSauce, modifySauce, likeSauce }
