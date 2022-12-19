const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


//Création d'un Schema pour les objets "user" avec l'intégration de "mongoose-unique-validator" qui vérifie que l'email est unique
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);