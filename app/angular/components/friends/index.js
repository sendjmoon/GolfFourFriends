'use strict';

module.exports = function(app) {
  app.component('friends', {
    template: require('./friends-template.html'),
    controller: 'UserController',
    controllerAs: 'uc',
    bindings: {
      baseUrl: '<',
    },
  });
  require('./add')(app);
  require('./list')(app);
};
