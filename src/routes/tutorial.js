const express = require('express');
const router = express.Router();
const fs = require("fs");
const Questions = require('../questions/Questions');


/*
 * GET /questions/get/:userId/ Given a user id, find a pre-existing questions file and return it, else create a new one and return it.
 */
router.get('/get/:userId', function(req, res, next) {
  const userId = req.params.userId;
  let questions;
  try {
    questions = Questions.createTutorialQuestions(userId);
    res.status(200).json(questions);
    console.log(`Tutorial questions for user ${userId} generated.`);
  } catch (err) {
    console.error(`Something when wrong when generating tutorial questions for user ${userId}`);
    res.status(500).json({error: err});
  }
  res.send();
});

module.exports = router;
