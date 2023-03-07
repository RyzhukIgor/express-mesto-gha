const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes/index');

const app = express();
const { PORT = 3000 } = process.env;

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Connected');
  })
  .catch((err) => {
    console.error(err);
  });

// подключаем мидлвары, роуты и всё остальное...

app.use(bodyParser.json());
app.use('/', router);

app.listen(PORT, () => {
  console.log(`Listing on port ${PORT}`);
});
