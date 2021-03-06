'use strict';

const Promise = require('bluebird');
const mongoose = require('mongoose');

module.exports = function(gameResultDao) {
  const _gameResultDao = gameResultDao;

  const create = function(gameId, datePlayed, resultsArray) {
    return new Promise((resolve, reject) => {
      resultsArray.forEach((player) => {
        player.gameId = gameId;
        player.playerId = player._id;
        player.datePlayed = datePlayed;
        player.createdAt = Date.now();
        player.updatedAt = Date.now();
        return delete player._id;
      });
      _gameResultDao.create(resultsArray)
        .then((newResults) => {
          resolve(newResults);
        })
        .catch(reject);
    });
  };

  const getAllByUserId = function(userId) {
    return _gameResultDao.getAllByUserId(userId);
  };

  const aggregate = function(matchOptions, groupOptions) {
    matchOptions = JSON.parse(matchOptions);
    groupOptions = JSON.parse(groupOptions);
    matchOptions.playerId = mongoose.Types.ObjectId(matchOptions.playerId);
    return _gameResultDao.aggregate(matchOptions, groupOptions);
  };

  return {
    create: create,
    getAllByUserId: getAllByUserId,
    aggregate: aggregate,
  };
};
