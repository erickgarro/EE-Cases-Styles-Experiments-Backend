const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const questionsRouter = require('./routes/questions');
const responsesRouter = require('./routes/responses');
const usersRouter = require('./routes/users');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/questions', questionsRouter);
app.use('/responses', responsesRouter);
app.use('/users', usersRouter);

module.exports = app;
