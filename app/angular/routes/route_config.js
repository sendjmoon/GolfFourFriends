'use strict';

module.exports = function($routeProvider) {
  $routeProvider
    .when('/home', {
      template: require('../html/home.html'),
    })
    .when('/register', {
      template: require('../html/register.html'),
    })
    .when('/signin', {
      template: require('../html/signin.html'),
    })
    .otherwise({
      redirectTo: '/register',
    });
};