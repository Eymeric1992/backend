const express = require('express');
const mongoose = require('mongoose');

const app = express();
mongoose.connect('mongodb+srv://newuser1:W84pwWsX55u0d9up@cluster0.cbpim0t.mongodb.net/?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));
app.use(express.json()); // intercepte requetes content type json et met a disposition ce contenu (corps) de la requete sur l'objet requete dans req.body

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Requete au body -->

app.post('/api/sauces', (req, res, next) => {
    console.log(req.body);
    res.status(201).json({
        message: 'objet créé'
    })
})

app.post('/api/auth/login', (req, res, next) => {
    const stuff = [
        {
            email: "",
        },
        {
            password: "",
        },
    ];
    res.status(200).json(stuff);
});

app.post('/api/sauces', (req, res, next) => {
    const saucesContent = [
        {
            sauces: "",
        },

    ];
    res.status(200).json(saucesContent);
});

module.exports = app;



// W84pwWsX55u0d9up mdp
// mongodb+srv://newuser1:<password>@cluster0.cbpim0t.mongodb.net/?retryWrites=true&w=majority