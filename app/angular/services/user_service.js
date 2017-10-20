'use strict';

module.exports = function(app) {
  app.service('UserService', ['$rootScope', '$http', function($rs, $http) {

    this.updateUser = function(user, newData) {
      return new Promise((resolve, reject) => {
        let userData = {
          emailOrUsername: user.emailOrUsername,
          newData: newData,
        };
        $http.post('/users/update', userData)
          .then((user) => {
            resolve(user);
          })
          .catch((err) => {
            alert('error updating user');
            reject();
          });
      });
    };

    this.calcHandicap = function(user) {
      return new Promise((resolve, reject) => {
        let gameIds = user.gameIds;
        let handicap = 0;

        if (gameIds === undefined) return reject();

        gameIds.forEach((game) => {
          handicap += game.strokes;
        });

        handicap = handicap / gameIds.length;
        resolve(handicap);
      });
    };

  }]);
};
