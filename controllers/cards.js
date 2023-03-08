/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const Card = require('../models/card');
const {
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER,
  STATUS_CREATED,
  STATUS_OK,
} = require('../utils/errors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(STATUS_OK).send({ data: cards }))
    .catch(() => res.status(ERROR_INTERNAL_SERVER).send({ message: 'Внутренняя ошибка сервера' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((newCard) => res.status(STATUS_CREATED).send(newCard))
    .catch(() => res.status(ERROR_INTERNAL_SERVER).send({ message: 'Внутренняя ошибка сервера' }));
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndDelete(cardId)
    .orFail(() => res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена' }))
    .then((result) => {
      console.log(result);
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.status(STATUS_OK).send(card))
    .catch(() => res.status(ERROR_INTERNAL_SERVER).send({ message: 'Внутренняя ошибка сервера' }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.status(200).send(card))
    .catch(() => res.status(ERROR_INTERNAL_SERVER).send({ message: 'Внутренняя ошибка сервера' }));
};
