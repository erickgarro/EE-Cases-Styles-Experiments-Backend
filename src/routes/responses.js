const express = require('express');
const fs = require("fs");
const JSZip = require("jszip");
const router = express.Router();


/*
 * GET Given a user id, read a JSON file on disk, and return it as a JSON object.
 */
router.get('/:userId', function(req, res, next) {
  const workingDir = process.cwd();
  const userId = req.params.userId;
  let responses;
  try {
    responses = fs.readFileSync(`${workingDir}/data/responses/${userId}.json`, 'utf8');
    res = JSON.parse(responses);
    console.log(`Responses for user ${userId} read from disk.`);
  } catch (err) {
    console.error(`Error reading responses for user ${userId}: ${err}`);
    res.status(500).send(`Error reading responses for user ${userId}: ${err}`);
  }
  res.send();
});

/*
 * PUT to /responses/ receives the user's responses. It takes them from the body of the request.
 * The user's responses are saved as a JSON file on disk. The file name is the user's id.
 * And an emails is sent to the administrators with the user's responses attached as a JSON file.
 * The email is sent to the administrators in the body of the request.
 * It responds with a 200 status code or an error message.
 */

router.post('/submit/:userId', function(req, res, next) {
  const userId = req.params.userId;
  let responses = req.body;
  try {
    const workingDir = process.cwd();
    if (!fs.existsSync(workingDir + '/data')) {
      fs.mkdirSync(workingDir + '/data');
    }

    if (!fs.existsSync(`${workingDir}/data/responses`)) {
      fs.mkdirSync(`${workingDir}/data/responses`);
    }

    fs.writeFileSync(`${workingDir}/data/responses/${userId}.json`, JSON.stringify(responses));

    const csvHeader = 'userId,date,age,gender,background,gaveConsent,' +
                      '1_task,1_words,1_accurracy,1_duration,' +
                      '2_task,2_words,2_accurracy,2_duration,' +
                      '3_task,3_words,3_accurracy,3_duration,' +
                      '4_task,4_words,4_accurracy,4_duration,' +
                      '5_task,5_words,5_accurracy,5_duration,' +
                      '6_task,6_words,6_accurracy,6_duration,' +
                      '7_task,7_words,7_accurracy,7_duration,' +
                      '8_task,8_words,8_accurracy,8_duration,' +
                      '9_task,9_words,9_accurracy,9_duration,' +
                      '10_task,10_words,10_accurracy,10_duration,' +
                      '11_task,11_words,11_accurracy,11_duration,' +
                      '12_task,12_words,12_accurracy,12_duration,' +
                      '13_task,13_words,13_accurracy,13_duration,' +
                      '14_task,14_words,14_accurracy,14_duration,' +
                      '15_task,15_words,15_accurracy,15_duration,' +
                      '16_task,16_words,16_accurracy,16_duration,' +
                      '17_task,17_words,17_accurracy,17_duration,' +
                      '18_task,18_words,18_accurracy,18_duration,' +
                      '19_task,19_words,19_accurracy,19_duration,' +
                      '20_task,20_words,20_accurracy,20_duration\n';

    const csvBody = userId + ',' +new Date() + ',' + 
                    responses.user.age + ',' + responses.user.gender + ',' + responses.user.background + ',' + responses.user.gaveConsent + ',' +
                    responses.answers[1].id + ',' + responses.answers[1].words.join(' ') + ',' + responses.answers[1].correct + ',' + responses.answers[1].time + ',' +
                    responses.answers[2].id + ',' + responses.answers[2].words.join(' ') + ',' + responses.answers[2].correct + ',' + responses.answers[2].time + ',' +
                    responses.answers[3].id + ',' + responses.answers[3].words.join(' ') + ',' + responses.answers[3].correct + ',' + responses.answers[3].time + ',' +
                    responses.answers[4].id + ',' + responses.answers[4].words.join(' ') + ',' + responses.answers[4].correct + ',' + responses.answers[4].time + ',' +
                    responses.answers[5].id + ',' + responses.answers[5].words.join(' ') + ',' + responses.answers[5].correct + ',' + responses.answers[5].time + ',' +
                    responses.answers[6].id + ',' + responses.answers[6].words.join(' ') + ',' + responses.answers[6].correct + ',' + responses.answers[6].time + ',' +
                    responses.answers[7].id + ',' + responses.answers[7].words.join(' ') + ',' + responses.answers[7].correct + ',' + responses.answers[7].time + ',' +
                    responses.answers[8].id + ',' + responses.answers[8].words.join(' ') + ',' + responses.answers[8].correct + ',' + responses.answers[8].time + ',' +
                    responses.answers[9].id + ',' + responses.answers[9].words.join(' ') + ',' + responses.answers[9].correct + ',' + responses.answers[9].time + ',' +
                    responses.answers[10].id + ',' + responses.answers[10].words.join(' ') + ',' + responses.answers[10].correct + ',' + responses.answers[10].time + ',' +
                    responses.answers[11].id + ',' + responses.answers[11].words.join(' ') + ',' + responses.answers[11].correct + ',' + responses.answers[11].time + ',' +
                    responses.answers[12].id + ',' + responses.answers[12].words.join(' ') + ',' + responses.answers[12].correct + ',' + responses.answers[12].time + ',' +
                    responses.answers[13].id + ',' + responses.answers[13].words.join(' ') + ',' + responses.answers[13].correct + ',' + responses.answers[13].time + ',' +
                    responses.answers[14].id + ',' + responses.answers[14].words.join(' ') + ',' + responses.answers[14].correct + ',' + responses.answers[14].time + ',' +
                    responses.answers[15].id + ',' + responses.answers[15].words.join(' ') + ',' + responses.answers[15].correct + ',' + responses.answers[15].time + ',' +
                    responses.answers[16].id + ',' + responses.answers[16].words.join(' ') + ',' + responses.answers[16].correct + ',' + responses.answers[16].time + ',' +
                    responses.answers[17].id + ',' + responses.answers[17].words.join(' ') + ',' + responses.answers[17].correct + ',' + responses.answers[17].time + ',' +
                    responses.answers[18].id + ',' + responses.answers[18].words.join(' ') + ',' + responses.answers[18].correct + ',' + responses.answers[18].time + ',' +
                    responses.answers[19].id + ',' + responses.answers[19].words.join(' ') + ',' + responses.answers[19].correct + ',' + responses.answers[19].time + ',' +
                    responses.answers[20].id + ',' + responses.answers[20].words.join(' ') + ',' + responses.answers[20].correct + ',' + responses.answers[20].time;

    const csv = `${csvHeader}${csvBody}`;
    
    // save the csv to a file synchronously
    fs.writeFileSync(`${workingDir}/data/responses/${userId}.csv`, csv);
  
    res.status(200).send(`Saved responses for user ${userId}`);
    console.log(`Saved responses for user ${userId} to disk.`);
    sendMail(req.params.userId, responses, csv);
    console.log(`Email sent to admin.`);
  } catch (err) {
    console.error(`Error writing responses for user ${userId}: ${err}`);
    res.status(500).send(`Error writing responses for user ${userId}: ${err}`);
  }
  res.send();
});

// This router gets all the available responses with .json extension and compresses them into a single .zip file.
// But it does not save the zip file to disk.
router.get('/responses/:userId', (req, res) => {
  const workingDir = process.cwd();
  const userId = req.params.userId;
  const zip = new JSZip();
  const jsonFile = `${workingDir}/data/responses/${userId}.json`;
  const csvFile = `${workingDir}/data/responses/${userId}.csv`;
  const json = fs.readFileSync(jsonFile, 'utf8');
  const csv = fs.readFileSync(csvFile, 'utf8');

  let responses = [];

  responses.push(JSON.parse(json));
  responses.push(csv);
  zip.file(`${userId}.json`, json);
  zip.file(`${userId}.csv`, csv);
  zip.generateAsync({type: 'nodebuffer'})
  .then(function (content) {
    res.setHeader('Content-disposition', 'attachment; filename=' + `${userId}.zip`);
    res.setHeader('Content-type', 'application/zip');
    res.send(content);
  });
});

router.get('/get/all/', (req, res) => {
  const workingDir = `${process.cwd()}`;
  let csvData = 'userId,date,age,gender,background,gaveConsent,' +
                    '1_task,1_words,1_accurracy,1_duration,' +
                    '2_task,2_words,2_accurracy,2_duration,' +
                    '3_task,3_words,3_accurracy,3_duration,' +
                    '4_task,4_words,4_accurracy,4_duration,' +
                    '5_task,5_words,5_accurracy,5_duration,' +
                    '6_task,6_words,6_accurracy,6_duration,' +
                    '7_task,7_words,7_accurracy,7_duration,' +
                    '8_task,8_words,8_accurracy,8_duration,' +
                    '9_task,9_words,9_accurracy,9_duration,' +
                    '10_task,10_words,10_accurracy,10_duration,' +
                    '11_task,11_words,11_accurracy,11_duration,' +
                    '12_task,12_words,12_accurracy,12_duration,' +
                    '13_task,13_words,13_accurracy,13_duration,' +
                    '14_task,14_words,14_accurracy,14_duration,' +
                    '15_task,15_words,15_accurracy,15_duration,' +
                    '16_task,16_words,16_accurracy,16_duration,' +
                    '17_task,17_words,17_accurracy,17_duration,' +
                    '18_task,18_words,18_accurracy,18_duration,' +
                    '19_task,19_words,19_accurracy,19_duration,' +
                    '20_task,20_words,20_accurracy,20_duration\n';

  fs.readdirSync(`${workingDir}/data/responses/`).forEach(file => {
    if (file.includes('.csv')) {
      const csvFile = `${workingDir}/data/responses/${file}`;
      const csv = fs.readFileSync(csvFile, 'utf8');
      const csvRows = csv.split('\n');
      const csvRow = csvRows[1];
      csvData += csvRow + '\n';
    }
  });
  let timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  res.setHeader('Content-disposition', 'attachment; filename=' + `EE_Exp2_All_responses (${timestamp}).csv`);
  res.setHeader('Content-type', 'application/csv');
  res.send(csvData);
});

/*
 * Sends an email to the administrators with the user's responses attached as a JSON file.
 *
 * @param {string} userId - The user's id.
 * @param {object} responses - The user's responses.
 */
function sendMail (userId, jsonFile, csvFile) {
  const MAILJET_API_KEY = process.env.MAILJET_API_KEY;
  const MAILJET_SECRET_KEY = process.env.MAILJET_SECRET_KEY;
  const MAILJET_FROM = process.env.MAILJET_FROM;
  const MAILJET_TO_1 = process.env.MAILJET_TO_1;
  const MAILJET_TO_2 = process.env.MAILJET_TO_2;

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
          { Email: MAILJET_TO_1 },
          { Email: MAILJET_TO_2 },
        ],
        "Subject": `[EE-Exp2] Response from user ${userId}`,
        "TextPart": "The response is attached in a JSON file.",
        "HTMLPart": "<h3>The response is attached in JSON and CSV files.</h3><br />",
        "CustomID": "AppGettingStartedTest",
        "Attachments": [
          {
            "ContentType": "application/json",
            "Filename": `${userId}.json`,
            "Base64Content": Buffer.from(JSON.stringify(jsonFile)).toString('base64')
          },
          {
            "ContentType": "text/csv",
            "Filename": `${userId}.csv`,
            "Base64Content": Buffer.from(csvFile).toString('base64')
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
