const routerUsers = require('express').Router();

const {
  // eslint-disable-next-line comma-dangle
  getUsers, getUserId, updateUser, updateAvatar, getInfoUser
} = require('../controllers/users');
// eslint-disable-next-line import/no-extraneous-dependencies, import/order
const { Joi, celebrate, errors } = require('celebrate');

routerUsers.get('/', getUsers);
routerUsers.get('/me', getInfoUser);
routerUsers.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getUserId);
routerUsers.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);
routerUsers.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/),
  }),
}), updateAvatar);

routerUsers.use(errors());
module.exports = routerUsers;
