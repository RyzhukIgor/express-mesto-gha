const routerUsers = require('express').Router();

const {
  // eslint-disable-next-line comma-dangle
  getUsers, getUserId, createUser, updateUser, updateAvatar
} = require('../controllers/users');

routerUsers.get('/', getUsers);
routerUsers.get('/:userId', getUserId);
routerUsers.post('/', createUser);
routerUsers.patch('/me', updateUser);
routerUsers.patch('/me/avatar', updateAvatar);

module.exports = routerUsers;
