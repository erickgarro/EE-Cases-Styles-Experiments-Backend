const express = require('express');
const router = express.Router();
const fs = require("fs");
const Questions = require('../questions/Questions');


/*
 * GET /questions/get/:userId/ Given a user id, find a pre-existing questions file and return it, else create a new one and return it.
 */
router.get('/get/:userId', function(req, res, next) {
  const workingDir = process.cwd();
  const userId = req.params.userId;
  let questions;
  try {
    if (!fs.existsSync(workingDir + '/data')) {
      fs.mkdirSync(workingDir + '/data');
    }

    if (!fs.existsSync(workingDir + '/data/questions')) {
      fs.mkdirSync(workingDir + '/data/questions');
    }

    console.log(workingDir);
    questions = JSON.parse(fs.readFileSync(`${workingDir}/data/questions/${userId}.json`, 'utf8'));
    res.status(200).json(questions);
    console.log(`Pre-existing questions for user ${userId} requested.`);
  } catch (err) {
    console.error(`Error reading questions for user ${userId}: ${err}`);
    questions = Questions.createQuestions(userId);
    fs.writeFileSync( `${workingDir}/data/questions/${userId}.json`, JSON.stringify(questions), 'utf8');
    res.status(200).json(questions);
  }
  res.send()
});

module.exports = router;
