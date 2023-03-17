const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes/index');
const { login, createUser } = require('./controllers/users');

const app = express();
const { PORT = 3000 } = process.env;

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Connected');
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
  });

// подключаем мидлвары, роуты и всё остальное...

app.use(bodyParser.json());
app.post('/signin', login);
app.post('/signup', createUser);
app.use((req, res, next) => {
  req.user = {
    _id: '640713b70310ec8e892e7d3e',
  };
  next();
});
app.use('/', router);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listing on port ${PORT}`);
});
