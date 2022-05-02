const express = require('express');
const fs = require("fs");
const router = express.Router();

/*
 * GET Given a user id, read a JSON file on disk, and return it as a JSON object.
 */
router.get('/:userId', function(req, res, next) {
  const userId = req.params.userId;
  let responses;
  try {
    responses = fs.readFileSync(`${process.cwd()}/data/responses/${userId}.json`, 'utf8');
    res = JSON.parse(responses);
    console.log(`Responses for user ${userId} read from disk.`);
  } catch (err) {
    console.error(`Error reading responses for user ${userId}: ${err}`);
    res.status(500).send(`Error reading responses for user ${userId}: ${err}`);
  }
  res.send();
});

/*
 * POST to /responses/ to save a user's responses. The user's responses are in the body of the request.
 * The user's responses are saved as a JSON file on disk. The file name is the user's id.
 */
router.post('/', function(req, res, next) {
  const userId = req.body.userId;
  const responses = req.body;
  try {
    fs.writeFileSync(`${process.cwd()}/data/responses/${userId}.json`, JSON.stringify(responses));
    res.status(200).send(`Saved responses for user ${userId}`);
    console.log(`Saved responses for user ${userId} to disk.`);
    sendMail(req.body.userId, responses);
    console.log(`Email sent to admin.`);
  } catch (err) {
    console.error(`Error writing responses for user ${userId}: ${err}`);
    res.status(500).send(`Error writing responses for user ${userId}: ${err}`);
  }
});

/*
 * PUT to /responses/ receives the user's responses. It takes them from the body of the request.
 * The user's responses are saved as a JSON file on disk. The file name is the user's id.
 * And an emails is sent to the administrators with the user's responses attached as a JSON file.
 * The email is sent to the administrators in the body of the request.
 * It responds with a 200 status code or an error message.
 */

router.put('/submit/:userId', function(req, res, next) {
  const userId = req.params.userId;
  const responses = req.body;
  try {
    fs.writeFileSync(`${process.cwd()}/data/responses/${userId}.json`, JSON.stringify(responses));
    res.status(200).send(`Saved responses for user ${userId}`);
    console.log(`Saved responses for user ${userId} to disk.`);
    sendMail(req.params.userId, responses);
    console.log(`Email sent to admin.`);
  } catch (err) {
    console.error(`Error writing responses for user ${userId}: ${err}`);
    res.status(500).send(`Error writing responses for user ${userId}: ${err}`);
  }
  res.send();
});


/*
 * Sends an email to the administrators with the user's responses attached as a JSON file.
 *
 * @param {string} userId - The user's id.
 * @param {object} responses - The user's responses.
 */
function sendMail (userId, payload) {
  const MAILJET_API_KEY = process.env.MAILJET_API_KEY;
  const MAILJET_SECRET_KEY = process.env.MAILJET_SECRET_KEY;
  const MAILJET_FROM = process.env.MAILJET_FROM;
  const MAILJET_TO = process.env.MAILJET_TO;

  const mailjet = require('node-mailjet')
  .connect(MAILJET_API_KEY, MAILJET_SECRET_KEY)
  const request = mailjet
  .post("send", { 'version': 'v3.1' })
  .request({
    "Messages": [
      {
        "From": {
          "Email": MAILJET_FROM,
          "Name": "EE-Exp2"
        },
        "To": [
          {
            "Email": MAILJET_TO,
            "Name": "Erick"
          }
        ],
        "Subject": `[EE-Exp2] Response from user ${userId}`,
        "TextPart": "The response is attached in a JSON file.",
        "HTMLPart": "<h3>The response is attached in a JSON file.</h3><br />",
        "CustomID": "AppGettingStartedTest",
        "Attachments": [
          {
            "ContentType": "application/json",
            "Filename": `${userId}.json`,
            "Base64Content": Buffer.from(JSON.stringify(payload)).toString('base64')
          }
        ]
      }
    ]
  })
  request
  .then((result) => {
    console.log(result.body)
  })
  .catch((err) => {
    console.log(err.statusCode)
  })
}

module.exports = router;
