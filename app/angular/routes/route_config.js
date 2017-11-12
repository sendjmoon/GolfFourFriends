'use strict';

module.exports = function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/dashboard', {
      template: require('../html/dashboard.html'),
    })
    .when('/friends', {
      template: require('../html/friends.html'),
    })
    .when('/games', {
      template: require('../html/games/games-landing.html'),
    })
    .when('/games/public/:publicId', {
      template: require('../html/games/game-view.html'),
      controller: 'GamesController',
      controllerAs: 'gc',
    })
    .when('/', {
      template: require('../html/landing.html'),
    })
    .otherwise({
      redirectTo: '/',
    });
};
