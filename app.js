const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
const PORT = process.env.PORT || 8080;

const indexRouter = require('./src/routes');
const questionsRouter = require('./src/routes/questions');
const responsesRouter = require('./src/routes/responses');
const usersRouter = require('./src/routes/users');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/questions', questionsRouter);
app.use('/responses', responsesRouter);
app.use('/users', usersRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
