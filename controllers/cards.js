// eslint-disable-next-line no-unused-vars
const mongoose = require('mongoose');
const Card = require('../models/card');
const ErrorNotFound = require('../utils/ErrorNotFound');

const {
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  STATUS_CREATED,
  STATUS_OK,
  FORBIDDEN_ERR,
} = require('../utils/errors');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((error) => next(error));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((newCard) => res.status(STATUS_CREATED).send(newCard))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные пользователя' });
      } else {
        next(error);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const { userId } = req.user._id;
  Card.findByIdAndDelete(cardId)
    .orFail(() => {
      throw new ErrorNotFound('NotFound');
    })
    .then((card) => {
      const ownerId = card.owner.id;
      if (ownerId !== userId) {
        res.status(FORBIDDEN_ERR).send({ message: 'Вы не можете удалить эту карточку' });
      } else {
        card.remove();
        res.send({ data: card });
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
        next(error);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
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
        next(error);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
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
        next(error);
      }
    });
};
