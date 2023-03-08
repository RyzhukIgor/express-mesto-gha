const User = require('../models/user');

const {
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
  STATUS_CREATED,
  STATUS_OK,
} = require('../utils/errors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((u) => res.status(STATUS_OK).send({ data: u }))
    .catch(() => res.status(ERROR_NOT_FOUND).send({ message: 'Пользователи не найдены' }));
};

module.exports.getUserId = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' }))
    .then((user) => res.status(STATUS_OK).send({ data: user }))
    .catch(() => res.status(ERROR_INTERNAL_SERVER).send({ message: 'Внутренняя ошибка сервера' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((newUser) => res.status(STATUS_CREATED).send({ data: newUser }))
    .catch(() => res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные пользователя' }));
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .orFail(() => res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные пользователя' }))
    .then((updatedUser) => res.status(STATUS_OK).send(updatedUser))
    .catch(() => res.status(ERROR_INTERNAL_SERVER).send({ message: 'Внутрення ошибка сервера' }));
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .orFail(() => res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' }))
    .then((updatedAvatar) => res.status(STATUS_OK).send(updatedAvatar))
    .catch(() => res.status(ERROR_INTERNAL_SERVER).send({ message: 'Внутренняя ошибка сервера' }));
};
