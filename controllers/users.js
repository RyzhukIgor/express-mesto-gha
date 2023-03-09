const User = require('../models/user');
const ErrorNotFound = require('../utils/ErrorNotFound');

const {
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
  STATUS_CREATED,
  STATUS_OK,
} = require('../utils/errors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((u) => res.send({ data: u }))
    .catch(() => res.status(ERROR_INTERNAL_SERVER).send({ message: 'Пользователи не найдены' }));
};

module.exports.getUserId = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(ERROR_NOT_FOUND).send({
          message: 'Пользователь с указанным id не найден',
        });
      } else {
        res.status(STATUS_OK).send({ data: user });
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      } else if (error.message === 'NotFound') {
        res.status(ERROR_NOT_FOUND).send({
          message: 'Пользователь с указанным id не найден',
        });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'Внутрення ошибка сервера' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((newUser) => res.status(STATUS_CREATED).send({ data: newUser }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные пользователя' });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'Внутрення ошибка сервера' });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      throw new ErrorNotFound('NotFound');
    })
    .then((user) => res.status(STATUS_OK).send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      } else if (error.message === 'NotFound') {
        res.status(ERROR_NOT_FOUND).send({
          message: 'Пользователь с указанным id не найден',
        });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'Внутрення ошибка сервера' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      throw new ErrorNotFound('NotFound');
    })
    .then((user) => res.status(STATUS_OK).send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      } else if (error.message === 'NotFound') {
        res.status(ERROR_NOT_FOUND).send({
          message: 'Пользователь с указанным id не найден',
        });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'Внутрення ошибка сервера' });
      }
    });
};
