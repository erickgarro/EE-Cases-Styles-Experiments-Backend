const express = require('express');
const fs = require("fs");
const router = express.Router();

/*
 * GET create a user id
 */
router.get('/getId', function(req, res) {
    res.status(200).json({
        userId: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    });
});

/*
 * GET /users/hasFinished/:userId  - Returns true if the user has finished the experiment.
 */
router.get('/hasFinished/:userId', (req, res) => {
  try {
    const userId = req.params.userId;
    const userResponses = JSON.parse(fs.readFileSync(`./data/${userId}.json`));
    res.status(200).json({
      hasFinished: userResponses.hasFinished
    });
  } catch (err) {
    res.status(200).json({
      hasFinished: false
    });
    console.error(err);
  }
});

module.exports = router;
