'use strict';

const Promise = require('bluebird');
const Game = require('../models/Game');

module.exports = function() {
  const create = function(gameData) {
    return new Promise((resolve, reject) => {
      const game = new Game(gameData);
      game.createdAt = Date.now();
      game.updatedAt = Date.now();
      game.save()
        .then((createdGame) => {
          Game.findById(createdGame.id)
            .select('-__v')
            .exec()
            .then((newGame) => {
              resolve(newGame);
            })
            .catch(reject);
        })
        .catch((err) => {
          console.log(err);
          reject();
        });
    });
  };

  return {
    create: create,
  };
};
