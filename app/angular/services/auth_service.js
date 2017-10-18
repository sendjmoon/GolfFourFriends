'use strict';

module.exports = function(app) {
  app.service('AuthService', ['$rootScope', '$http', '$location', function($rs, $http, $location) {
    $rs.user = {};

    this.signup = function(userData) {
      $http.post(`${$rs.baseUrl}/users/signup`, userData)
        .then((res) => {
          delete res.config.data.password;
          $rs.user = res.data;
          $location.path('/dashboard');
        })
        .catch((err) => {
          alert('Error creating user.');
        });
    };

    this.signin = function(userData) {
      $http.post(`${$rs.baseUrl}/users/signin`, userData)
        .then((res) => {
          delete res.config.data.password;
          $rs.user = res.data;
          $location.path('/dashboard');
        })
        .catch((err) => {
          alert('Error signing in.');
        });
    };

    this.signout = function() {
      $http.get(`${$rs.baseUrl}/users/signout`)
        .then((res) => {
          $location.path('/signin');
        })
        .catch((err) => {
          alert('Error signing out.');
        });
    };

    this.checkSessionExists = function() {
      // let isLoggedIn = false;
      //
      // for (var prop in $rs.user) {
      //   if ($rs.user.hasOwnProperty(prop)) {
      //     isLoggedIn = true;
      //   }
      // };
      //
      // isLoggedIn ? true : $location.path('/');
    };

  }]);
};
