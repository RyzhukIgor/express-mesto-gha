const routerUsers = require('express').Router();

const {
  // eslint-disable-next-line comma-dangle
  getUsers, getUserId, updateUser, updateAvatar
} = require('../controllers/users');

routerUsers.get('/', getUsers);
routerUsers.get('/:userId', getUserId);
routerUsers.patch('/me', updateUser);
routerUsers.patch('/me/avatar', updateAvatar);

module.exports = routerUsers;
