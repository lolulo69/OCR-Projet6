const mongoose = require('mongoose');


//Création d'un Schema pour les objets "sauce"
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: false },
  heat: { type: Number, required: true },
  likes: { type: Number, required: false },
  dislikes: { type: Number, required: false },
  usersLiked: {type: ["String <userId>"], required: false},
  usersDisliked: {type: ["String <userId>"], required: false}
});


module.exports = mongoose.model('Sauce', sauceSchema);