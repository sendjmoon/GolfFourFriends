'use strict';

module.exports = function(app) {
  app.controller('CreateGameController', ['$rootScope', '$route', 'UserService', 'FriendService', 'GameService', 'ResultService', function($rs, $route, userService, friendService, gameService, resultService) {

    const ctrl = this;
    ctrl.user = userService.data.user;
    ctrl.allFriends = friendService.data.allFriends;
    ctrl.players = [];
    ctrl.editing = false;

    ctrl.createGame = function(gameData) {
      gameData.players = ctrl.players;
      gameService.create(gameData)
        .then((newGame) => {
          resultService.calcResults(gameData.players)
            .then((resultsArray) => {

              let userUpdateData = {
                usersArray: resultsArray,
                updateQuery: { $addToSet: { gameIds: newGame._id }},
              };
              userService.updateMany(userUpdateData)
              .then(() => {
                gameService.
                $route.reload();
              });
            })
        })
        .catch((err) => {
          console.log(err);
        });
    }

    ctrl.addUser = function(user) {
      let friendsArray = ctrl.allFriends.friends;
      ctrl.players.push(user);
      friendsArray.splice(friendsArray.indexOf(user), 1);
    }

    ctrl.removeUser = function(user) {
      ctrl.players.splice(ctrl.players.indexOf(user), 1);
      ctrl.allFriends.friends.push(user);
    }

    ctrl.init = function() {
      let userData = {
        _id: ctrl.user._id,
        fullName: ctrl.user.fullName,
        email: ctrl.user.email,
      };
      ctrl.players.push(userData);
      friendService.getAllFriends(ctrl.user.email);
    }

    ctrl.init();
  }]);
}
