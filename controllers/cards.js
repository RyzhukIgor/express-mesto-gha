const Card = require('../models/card');
const ErrorNotFound = require('../utils/ErrorNotFound');

const {
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
  STATUS_CREATED,
  STATUS_OK,
} = require('../utils/errors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(ERROR_INTERNAL_SERVER).send({ message: 'Внутренняя ошибка сервера' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((newCard) => res.status(STATUS_CREATED).send(newCard))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные пользователя' });
      } else {
        res.status(ERROR_INTERNAL_SERVER).send({ message: 'Внутрення ошибка сервера' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndDelete(cardId)
    .orFail(() => {
      throw new ErrorNotFound('NotFound');
    })
    .then((result) => {
      res.send(result);
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

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new ErrorNotFound('NotFound');
    })
    .then((card) => res.status(STATUS_OK).send(card))
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

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new ErrorNotFound('NotFound');
    })
    .then((card) => res.status(200).send(card))
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
