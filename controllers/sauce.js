const Sauce = require('../models/Sauce');
const fs = require('fs');



//Création d'un nouvel objet "sauce" avec les données fournies et sauvegarde de ce dernier dans la base de données
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      //Récupération du chemin d'accès à l'image fourni par le middleware Multer
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0
  });

  sauce.save()
  .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
};


//Récupére un objet "sauce" particulier dans la base de données grâce à son ID
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};


//Vérifie que l'utilisteur est propriétaire de l'objet qu'il souhaite modifier puis le cas échéant, sauvegarde les données mises à jour
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete sauceObject._userId;
  Sauce.findOne({_id: req.params.id})
      .then((sauce) => {
        //Utilisation du middleware "auth" pour vérifier la propriété de l'objet à modifier
          if (sauce.userId != req.auth.userId) {
              res.status(401).json({ message : 'Not authorized'});
          } else {
              Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Objet modifié!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};


//Vérifie que l'utilisteur est propriétaire de l'objet qu'il souhaite supprimer puis le cas échéant supprime l'objet dans la base de données
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
      .then(sauce => {
        //Utilisation du middleware "auth" pour vérifier la propriété de l'objet à supprimer
          if (sauce.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'});
          } else {
              const filename = sauce.imageUrl.split('/images/')[1];
              fs.unlink(`./images/${filename}`, () => {
                  Sauce.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};


/* 
Gère l'ajout/suppression d'un like/dislike sur un objet "sauce" et sauvegarde l'ID de l'utilisateur concerné
Vérifie le statut de la requête pour savoir si l'utilisateur like/dislike ou au contraire s'il retire son like/dislike
Si l'utilisateur ajoute un like/dislike, on incrémente le compteur de like/dislike présent sur l'objet et on ajoute l'utilisateur au tableau correspondant
Si l'utilisateur supprime son like/dislike, on décrémente le compteur de like/dislike présent sur l'objet et on supprime l'utilisateur du tableau correspondant 
*/
exports.likeSauce = (req, res, next) => {
    if (req.body.like === 1) {
        Sauce.updateOne({_id: req.params.id}, {
            $inc: {likes: 1},
            $push: {usersLiked: req.body.userId},
            _id: req.params.id
        })
        .then(() => { res.status(201).json({ message: 'Ton vote a bien été enregistré.' }); })
        .catch((error) => { res.status(400).json({ error: error }); });
    }
    if (req.body.like === -1) {
        Sauce.updateOne({_id: req.params.id}, {
            $inc: {dislikes: 1},
            $push: {usersDisliked: req.body.userId},
            _id: req.params.id
        })
        .then(() => { res.status(201).json({ message: 'Ton vote a bien été enregistré.' }); })
        .catch((error) => { res.status(400).json({ error: error }); });
    }
    if (req.body.like === 0) {
        Sauce.findOne({_id: req.params.id})
            .then((sauce) => {
                if (sauce.usersLiked.find(user => user === req.body.userId)) {
                    Sauce.updateOne({_id: req.params.id}, {
                        $inc: {likes: -1},
                        $pull: {usersLiked: req.body.userId},
                        _id: req.params.id
                    })
                    .then(() => { res.status(201).json({ message: 'Ton like a été supprimé avec succès.' }); })
                    .catch((error) => { res.status(400).json({ error: error }); });
                }
                if (sauce.usersDisliked.find(user => user === req.body.userId)) {
                    Sauce.updateOne({_id: req.params.id}, {
                        $inc: {dislikes: -1},
                        $pull: {usersDisliked: req.body.userId},
                        _id: req.params.id
                    })
                    .then(() => { res.status(201).json({ message: 'Ton dislike a été supprimé avec succès.' }); })
                    .catch((error) => { res.status(400).json({ error: error }); });
                }
            })

    }
    
        
};


//Récupére tous les objets "sauce" présents dans la base de données
exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

