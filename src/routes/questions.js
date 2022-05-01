const express = require('express');
const router = express.Router();
const fs = require("fs");
const Questions = require('../questions/Questions');


/*
 * GET /questions/get/:userId/ Given a user id, find a JSON file named after the user id, parsed into a JSON object, and return it.
 */
router.get('/get/:userId', function(req, res, next) {
  const userId = req.params.userId;
  let questions;
  try {
    //working directory
    const workingDir = process.cwd();
    console.log(workingDir);
    questions = JSON.parse(fs.readFileSync(`${process.cwd()}/data/questions/${userId}.json`, 'utf8'));
    res.status(200).json(questions);
  } catch (err) {
    console.error(`Error reading questions for user ${userId}: ${err}`);
    res.status(500).json({ error: `Error reading questions for user ${userId}: ${err}` });
  }
});

/*
 * GET /questions/:userId Given a user id and a question id, read a JSON file on disk with the answers for the user, and return it as a JSON object.
 */
router.get('/generate/:userId', function(req, res, next) {
  const userId = req.params.userId;
  const questions = Questions.createQuestions(userId);

  try {
    fs.writeFileSync(`${process.cwd()}/data/questions/${userId}.json`, JSON.stringify(questions));
    res.status(200).json(questions);
    res.send();
  } catch (err) {
    res.status(500).json({ error: `Error writing questions for user ${userId}: ${err}` });
    console.error(`Error writing questions for user ${userId}: ${err}`);
  }
});

module.exports = router;
