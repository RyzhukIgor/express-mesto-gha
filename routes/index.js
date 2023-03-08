const router = require('express').Router();

const routerUsers = require('./users');
const cardRouter = require('./cards');

router.use('/users', routerUsers);
router.use('/cards', cardRouter);

module.exports = router;
