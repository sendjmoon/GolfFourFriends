'use strict';

module.exports = function(app) {
  app.controller('GamesController', ['$rootScope', '$http', '$location', '$route', 'AuthService', 'UserService', 'GameService', function($rs, $http, $location, $route, AuthService, UserService, GameService) {

    AuthService.checkSessionExists();

    this.user = $rs.user;
    this.gameData = $rs.gameData;
    this.games = [];
    this.publicIds = [];
    this.friendsList = [];
    this.game = {
      players: [],
    };
    this.game.players[0] = $rs.user;

    $rs.user.gameIds.forEach((game) => {
      this.publicIds.push(game.publicId);
    });

    this.createGame = function(gameData) {
      $http.post('/games/create', gameData)
        .then((game) => {
          let playersArray = game.data.players;
          playersArray.forEach((player) => {
            this.updatePlayer(player)
              .then((playerData) => {
                if (playerData.data.email === $rs.user.email) {
                  $rs.user = playerData.data;
                  window.sessionStorage.setItem('currentUser', JSON.stringify($rs.user));
                }
                $route.reload();
              })
              .catch((err) => {
                alert('error creating game');
              });
          });
        })
        .catch((err) => {
          alert('error creating game');
        });
    };

    this.getById = GameService.getById;
    GameService.getAllByPublicId(this.publicIds)
      .then((games) => {
        console.log(games);
        this.games = games.data;
      })
      .catch(() => {
        alert('uh oh');
      });

    // this.getGames = function() {
    //   new Promise((resolve, reject) => {
    //     $http.get('/games/all')
    //       .then((games) => {
    //         this.games = games.data;
    //         resolve();
    //       })
    //       .catch(() => {
    //         alert('error getting games');
    //         reject();
    //       });
    //   });
    // };

    this.getFriendsList = function() {
      $http.get('/friends/list')
        .then((friendsList) => {
          this.friendsList = friendsList.data;
        })
        .catch((err) => {
          alert('error getting friends list');
        });
    };

    this.addPlayer = function(user) {
      if (user === undefined || user === null) return;
      user = JSON.parse(user);
      this.game.players.push(user);
      this.friendsList = this.friendsList.filter((friend) => {
        return friend._id !== user._id;
      });
    };

    this.removePlayer = function(user) {
      let playersArray = this.game.players;
      let userIndex = playersArray.indexOf(user);
      this.friendsList.push(playersArray[userIndex]);
      playersArray.splice(userIndex, 1);
    };

    this.updatePlayer = function(player) {
      return new Promise((resolve, reject) => {
        let playerData = {
          emailOrUsername: player.email,
        };
        $http.post('/users', playerData)
          .then((user) => {
            UserService.calcHandicap(user.data)
              .then((handicap) => {
                let handicapData = {
                  handicap: handicap,
                };
                UserService.updateUser(playerData, handicapData)
                  .then((user) => {
                    resolve(user);
                  })
                  .catch(reject);
              })
              .catch(reject);
          })
          .catch(reject);
      });
    };

  }]);
};
