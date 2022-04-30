const express = require('express');
const fs = require("fs");
const router = express.Router();

// Given a user id, read a JSON file on disk, and return it as a JSON object.
router.get('/:userId', function(req, res, next) {
  const userId = req.params.userId;
  let responses;
  try {
    responses = fs.readFileSync(`${process.cwd()}/data/responses/${userId}.json`, 'utf8');
    res = JSON.parse(responses);
  } catch (err) {
    console.error(`Error reading responses for user ${userId}: ${err}`);
    res.status(500).send(`Error reading responses for user ${userId}: ${err}`);
  }
  res.send();
});

/*
 * POST to /questions/ to save a user's questions. The user's questions are in the body of the request.
 * The user's questions are saved as a JSON file on disk. The file name is the user's id.
 */
router.post('/', function(req, res, next) {
  const userId = req.body.userId;
  const responses = req.body;
  try {
    fs.writeFileSync(`${process.cwd()}/data/responses/${userId}.json`, JSON.stringify(responses));
    res.status(200).send(`Saved responses for user ${userId}`);
  } catch (err) {
    console.error(`Error writing responses for user ${userId}: ${err}`);
    res.status(500).send(`Error writing responses for user ${userId}: ${err}`);
  }
});

module.exports = router;
