'use strict';

const express = require('express');
const router = express.Router();
const userService = require('../services').userService;

router.get('/check-session', function(req, res, next) {
  if (req.session.user) {
    res.json({
      user: {
        _id: req.session.user._id,
        fullName: req.session.user.fullName,
        email: req.session.user.email,
      },
    });
  }
  else res.status(401).json({
    error: 'Unauthorized.',
  });
});

router.post('/', function(req, res, next) {
  userService.getUser(req.body.emailOrUsername)
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.status(500).json({
        error: 'Error getting user.',
      });
    });
});

router.post('/all', function(req, res, next) {
  userService.getAllUsers(req.body.emailOrUsername)
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      res.status(500).json({
        error: 'Error getting users.',
      });
    });
});

router.post('/signup', function(req, res, next) {
  userService.create(
      req.body.username,
      req.body.fullName,
      req.body.email,
      req.body.password
    )
    .then((user) => {
      delete user.password;
      req.session.user = user;
      res.status(200).json({
        message: 'Signup successful.',
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: 'Error creating user. Try again.',
      });
    });
});

router.post('/signin', function(req, res, next) {
  userService.authenticateUser(req.body.emailOrUsername, req.body.password)
    .then((user) => {
      delete user.password;
      req.session.user = user;
      res.status(200).json({
        message: 'Signin successful.',
      });
    })
    .catch((err) => {
      res.status(400).json({
        error: 'Incorrect username or password. Try again.',
      });
    });
});

router.post('/update', function(req, res, next) {
  userService.updateUser(req.body.emailOrUsername, req.body.newData)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      res.status(500).json({
        error: 'Error updating user.',
      });
    });
});

router.post('/update-many', function(req, res, next) {
  userService.updateManyById(req.body.usersArray, req.body.updateQuery)
    .then(() => {
      res.status(200).json({
        message: 'Great success',
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: 'Error updating users.',
      });
    });
});

router.get('/signout', function(req, res, next) {
  req.session.user = null;
  res.json({
    message: 'signed out',
  });
});

module.exports = router;
