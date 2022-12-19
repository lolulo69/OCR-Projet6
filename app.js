const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');


//Importation de dotenv pour protéger les clés dans le .env
dotenv.config();

const app = express();


//Connexion à la base de données distante MongoDB
mongoose.connect('mongodb+srv://'+process.env.DATABASE_KEY+'@cluster0.xhh06do.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true, dbName: "OCR_Projet6"})
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
app.use(express.json());


//Première interception des requêtes pour autoriser les origines externes à effectuer des requêtes au serveur
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


//Déclaration de nos différentes routes 
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoutes);

app.use('/api/sauces', sauceRoutes);

module.exports = app;