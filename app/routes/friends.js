'use strict';

const express = require('express');
const router = express.Router();
const friendService = require('../services').friendService;

router.post('/all', function(req, res, next) {
  console.log(req.body);
  friendService.getFriendsData(req.session.user.email, req.body.options)
    .then((friendsData) => {
      res.json(friendsData);
    })
    .catch((err) => {
      res.status(500).json({
        error: 'error getting friends data',
      });
    });
});

router.post('/add', function(req, res, next) {
  friendService.addFriend(req.session.user._id, req.body._id)
    .then((friend) => {
      res.json(friend);
    })
    .catch((err) => {
      res.status(500).json({
        error: 'Error adding friend.',
      });
    });
});

module.exports = router;
