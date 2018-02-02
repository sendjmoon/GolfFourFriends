'use strict';

module.exports = function(app) {
  app.controller('ChartController', ['$rootScope', '$scope', 'ChartService', 'GameService', 'ResultService', 'UserService', function($rs, $scope, chartService, gameService, resultService, userService) {

    let ctrl = this;
    ctrl.user = userService.data.user;
    ctrl.gameData;
    ctrl.games = [];
    let strokeData = [];
    let dateData = [];

    ctrl.parseData = function(array, property) {
      return array.map((item) => {
        return property === 'datePlayed' ? new Date(item[property]).toDateString() : item[property];
      });
    };

    ctrl.initChart = function() {
      let Chart = require('chart.js');
      let gameCtx = document.getElementById('gameChart').getContext('2d');
      let winCtx = document.getElementById('winChart').getContext('2d');
      let chartjsPluginAnnotation = require('chartjs-plugin-annotation');
      let gameChartConfig = require('./game_chart_config');
      let winChartConfig = require('./win_chart_config');

      let gameChartData = {
        labels: dateData,
        datasets: [{
          label: 'Strokes',
          data: strokeData,
          }],
      };

      let winChartData = {
        labels: ['Wins', 'Losses'],
        datasets: [{
          data: [ctrl.user.stats.wins, ctrl.user.stats.losses],
          backgroundColor: ['#89c97a', '#ddd'],
        }],
      };

      Chart.pluginService.register(chartjsPluginAnnotation);
      let gameChart = new Chart(gameCtx, gameChartConfig(gameChartData, ctrl.user.stats.handicap));
      let winChart = new Chart(winCtx, winChartConfig(winChartData));
    };

    ctrl.init = function() {
      resultService.getAllByUserId(ctrl.user._id)
        .then((results) => {
          strokeData = ctrl.parseData(results, 'strokes');
          dateData = ctrl.parseData(results, 'datePlayed');
          ctrl.initChart();
        });
    };

    ctrl.init();
  }]);
};
