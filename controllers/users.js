const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((u) => res.status(200).send({ data: u }))
    .catch(() => res.status(500).send({ message: 'Пользователи не найдены' }));
};

module.exports.getUserId = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => res.status(404).send({ message: 'Запрашиваемый пользователь не найден' }))
    .then((user) => res.status(200).send({ data: user }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((newUser) => res.status(200).send({ data: newUser }))
    .catch(() => res.status(400).send({ message: 'Переданы некорректные данные пользователя' }));
};
