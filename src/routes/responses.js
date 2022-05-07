const express = require('express');
const router = express.Router();
const fs = require("fs");
const JSZip = require("jszip");

/*
 * GET Given a user id, read a JSON file on disk, and return it as a JSON object.
 */
router.get('/:userId', function (req, res, next) {
  const workingDir = process.cwd();
  const userId = req.params.userId;
  let responses;
  try {
    responses = fs.readFileSync(`${workingDir}/data/responses/${userId}.json`, 'utf8');
    res.json(JSON.parse(responses));
    console.log(`Responses for user ${userId} read from disk.`);
  } catch (err) {
    console.error(`Error reading responses for user ${userId}: ${err}`);
    res.status(500).send(`Error reading responses for user ${userId}: ${err}`);
  }
});

/*
 * PUT to /responses/ receives the user's responses. It takes them from the body of the request.
 * The user's responses are saved as a JSON file on disk. The file name is the user's id.
 * And an emails is sent to the administrators with the user's responses attached as a JSON file.
 * The email is sent to the administrators in the body of the request.
 * It responds with a 200 status code or an error message.
 */

router.post('/submit/:userId', function (req, res, next) {
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
                      '1_task,1_words,1_accuracy,1_duration,' +
                      '2_task,2_words,2_accuracy,2_duration,' +
                      '3_task,3_words,3_accuracy,3_duration,' +
                      '4_task,4_words,4_accuracy,4_duration,' +
                      '5_task,5_words,5_accuracy,5_duration,' +
                      '6_task,6_words,6_accuracy,6_duration,' +
                      '7_task,7_words,7_accuracy,7_duration,' +
                      '8_task,8_words,8_accuracy,8_duration,' +
                      '9_task,9_words,9_accuracy,9_duration,' +
                      '10_task,10_words,10_accuracy,10_duration,' +
                      '11_task,11_words,11_accuracy,11_duration,' +
                      '12_task,12_words,12_accuracy,12_duration,' +
                      '13_task,13_words,13_accuracy,13_duration,' +
                      '14_task,14_words,14_accuracy,14_duration,' +
                      '15_task,15_words,15_accuracy,15_duration,' +
                      '16_task,16_words,16_accuracy,16_duration,' +
                      '17_task,17_words,17_accuracy,17_duration,' +
                      '18_task,18_words,18_accuracy,18_duration,' +
                      '19_task,19_words,19_accuracy,19_duration,' +
                      '20_task,20_words,20_accuracy,20_duration\n';

    const csvBody = userId + ',' + new Date() + ',' +
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
  const jsonFile = `${workingDir}/data/responses/${userId}.json`;
  const csvFile = `${workingDir}/data/responses/${userId}.csv`;
  const json = fs.readFileSync(jsonFile, 'utf8');
  const csv = fs.readFileSync(csvFile, 'utf8');

  zip.file(`${userId}.json`, json);
  zip.file(`${userId}.csv`, csv);
  zip.generateAsync({ type: 'nodebuffer' }).then(function (content) {
    res.setHeader('Content-disposition', `attachment; filename=${userId}.zip`);
    res.setHeader('Content-type', 'application/zip');
    res.send(content);
    console.log(`Sent responses for user ${userId} to client.`);
  }).catch(function (err) {
    console.error(`Error sending responses for user ${userId}: ${err}`);
    res.status(500).send(`Error sending responses for user ${userId}: ${err}`);
  });
});

function prepareJsonResponses(workingDir, words_specs) {
  let allResponses = [];

  try {
    fs.readdirSync(`${workingDir}/data/responses`).forEach(file => {
      if (file.endsWith('.json')) {
        let responses = JSON.parse(fs.readFileSync(`${workingDir}/data/responses/${file}`, 'utf8'));

        for (let r in responses.answers) {
          if (responses.answers[r].correct === true) {
            responses.answers[r].correct = 1;
          } else {
            responses.answers[r].correct = 0;
          }
          let words_id = responses.answers[r].id.split('.')[0];
          responses.answers[r]['parentQuestionId'] = words_id;
          responses.answers[r]['case'] = words_specs[words_id].case;
          responses.answers[r]['color'] = words_specs[words_id].color;
          responses.answers[r]['caseColor'] = `${words_specs[words_id].case}${words_specs[words_id].color}`;
          responses.answers[r]['nWords'] = words_specs[words_id].words.length;
          responses.answers[r]['words'] = responses.answers[r]['words'].join(' ');
        }
        allResponses.push(responses);
      }
    });
  } catch (err) {
    console.log(err);
  }
  return allResponses;
}

router.get('/get/reports', async (req, res) => {
    const workingDir = `${process.cwd()}`;
    const words_specs = {
      1: {
        'words': ['telotaxi', 'is', 'sour'],
        'case': 'k',
        'color': 'm'
      },
      2: {
        'words': ['vinyl', 'paint'],
        'case': 'k',
        'color': 'm'
      },
      3: {
        'words': ['handy', 'dandy'],
        'case': 'k',
        'color': 'm'
      },
      4: {
        'words': ['file', 'not', 'found'],
        'case': 'k',
        'color': 'm'
      },
      5: {
        'words': ['brew', 'coffee', 'now'],
        'case': 'k',
        'color': 'm'
      },
      6: {
        'words': ['asphyxy', 'cloud'],
        'case': 'k',
        'color': 'c'
      },
      7: {
        'words': ['narrow', 'polyphone'],
        'case': 'k',
        'color': 'c'
      },
      8: {
        'words': ['dark', 'side', 'guy'],
        'case': 'k',
        'color': 'c'
      },
      9: {
        'words': ['biotron', 'mnemonic'],
        'case': 'k',
        'color': 'c'
      },
      10: {
        'words': ['modal', 'horizontal', 'size'],
        'case': 'k',
        'color': 'c'
      },
      11: {
        'words': ['sad', 'user'],
        'case': 'c',
        'color': 'm'
      },
      12: {
        'words': ['come', 'closer'],
        'case': 'c',
        'color': 'm'
      },
      13: {
        'words': ['rainbow', 'kid'],
        'case': 'c',
        'color': 'm'
      },
      14: {
        'words': ['has', 'golden', 'pass'],
        'case': 'c',
        'color': 'm'
      },
      15: {
        'words': ['megatron', 'movies'],
        'case': 'c',
        'color': 'm'
      },
      16: {
        'words': ['eudemons', 'combo'],
        'case': 'c',
        'color': 'c'
      },
      17: {
        'words': ['electron', 'shower', 'night'],
        'case': 'c',
        'color': 'c'
      },
      18: {
        'words': ['computerphobe', 'user'],
        'case': 'c',
        'color': 'c'
      },
      19: {
        'words': ['quantum', 'daemon'],
        'case': 'c',
        'color': 'c'
      },
      20: {
        'words': ['has', 'not', 'paid'],
        'case': 'c',
        'color': 'c'
      }
    };

    let header_general = 'user_id,age,gender,base_background,background,' +
                         'accu_k,accu_c,accu_km,accu_kc,accu_cm,accu_cc,' +
                         'medn_time_k,medn_time_c,medn_time_km,medn_time_kc,medn_time_cm,medn_time_cc,' +
                         '1_accu_km,2_accu_km,3_accu_km,4_accu_km,5_accu_km,' +
                         '6_accu_kc,7_accu_kc,8_accu_kc,9_accu_kc,10_accu_kc,' +
                         '11_accu_cm,12_accu_cm,13_accu_cm,14_accu_cm,15_accu_cm,' +
                         '16_accu_cc,17_accu_cc,18_accu_cc,19_accu_cc,20_accu_cc,' +
                         '1_time_km,2_time_km,3_time_km,4_time_km,5_time_km,' +
                         '6_time_kc,7_time_kc,8_time_kc,9_time_kc,10_time_kc,' +
                         '11_time_cm,12_time_cm,13_time_cm,14_time_cm,15_time_cm,' +
                         '16_time_cc,17_time_cc,18_time_cc,19_time_cc,20_time_cc,' +
                         '1_n_words,2_n_words,3_n_words,4_n_words,5_n_words,' +
                         '6_n_words,7_n_words,8_n_words,9_n_words,10_n_words,' +
                         '11_n_words,12_n_words,13_n_words,14_n_words,15_n_words,' +
                         '16_n_words,17_n_words,18_n_words,19_n_words,20_n_words,' +
                         '1_case,2_case,3_case,4_case,5_case,' +
                         '6_case,7_case,8_case,9_case,10_case,' +
                         '11_case,12_case,13_case,14_case,15_case,' +
                         '16_case,17_case,18_case,19_case,20_case,' +
                         '1_color,2_color,3_color,4_color,5_color,' +
                         '6_color,7_color,8_color,9_color,10_color,' +
                         '11_color,12_color,13_color,14_color,15_color,' +
                         '16_color,17_color,18_color,19_color,20_color,' +
                         '1_case_color,2_case_color,3_case_color,4_case_color,5_case_color,' +
                         '6_case_color,7_case_color,8_case_color,9_case_color,10_case_color,' +
                         '11_case_color,12_case_color,13_case_color,14_case_color,15_case_color,' +
                         '16_case_color,17_case_color,18_case_color,19_case_color,20_case_color\n';
    let header_kebab_vs_camel = 'user_id,age,gender,base_background,background,accu_k,accu_c,time_k,time_c\n';
    let header_mono_vs_color = 'user_id,age,gender,base_background,background,accu_km,accu_kc,accu_cm,accu_cc,time_km,time_kc,time_cm,time_cc\n';

    let allResponses = [];
    let general = header_general;
    let kebab_vs_camel = header_kebab_vs_camel;
    let mono_vs_color = header_mono_vs_color;

    allResponses = prepareJsonResponses(workingDir, words_specs);

    for (let r in allResponses) {
      let user = allResponses[r].user;
      let answers = allResponses[r].answers;

      let kebab_accu = 0;
      let camel_accu = 0;
      let kebab_mono_accu = 0;
      let camel_mono_accu = 0;
      let kebab_color_accu = 0;
      let camel_color_accu = 0;

      let kebab_times = [];
      let camel_times = [];
      let kebab_mono_times = [];
      let camel_mono_times = [];
      let kebab_color_times = [];
      let camel_color_times = [];

      let kebab_median = 0;
      let camel_median = 0;
      let kebab_mono_median = 0;
      let camel_mono_median = 0;
      let kebab_color_median = 0;
      let camel_color_median = 0;

      for (let r in answers) {
        let answer = answers[r];

        if (answer.case === 'k') {
          kebab_accu += answer.correct;
          kebab_times.push(answer.time);

          if (answer.color === 'm') {
            kebab_mono_accu += answer.correct;
            kebab_mono_times.push(answer.time);
          } else {
            kebab_color_accu += answer.correct;
            kebab_color_times.push(answer.time);
          }
        } else {
          camel_accu += answer.correct;
          camel_times.push(answer.time);

          if (answer.color === 'm') {
            camel_mono_accu += answer.correct;
            camel_mono_times.push(answer.time);
          } else {
            camel_color_accu += answer.correct;
            camel_color_times.push(answer.time);
          }
        }
      }

      kebab_accu = kebab_accu / 10 * 100;
      camel_accu = camel_accu / 10 * 100;
      kebab_mono_accu = kebab_mono_accu / 5 * 100;
      camel_mono_accu = camel_mono_accu / 5 * 100;
      kebab_color_accu = kebab_color_accu / 5 * 100;
      camel_color_accu = camel_color_accu / 5 * 100;

      kebab_median = median(kebab_times);
      camel_median = median(camel_times);
      kebab_mono_median = median(kebab_mono_times);
      camel_mono_median = median(camel_mono_times);
      kebab_color_median = median(kebab_color_times);
      camel_color_median = median(camel_color_times);

      let bkg = user.background;

      if (user.background !== 'n/a') {
        bkg = user.background.substring(0, 2);
      }

      general += `${user.userId},${user.age},${user.gender},${bkg},${user.background},${kebab_accu},${camel_accu},${kebab_mono_accu},${kebab_color_accu},${camel_mono_accu},${camel_color_accu},${kebab_median},${camel_median},${kebab_mono_median},${kebab_color_median},${camel_mono_median},${camel_color_median},${answers[1].correct},${answers[2].correct},${answers[3].correct},${answers[4].correct},${answers[5].correct},${answers[6].correct},${answers[7].correct},${answers[8].correct},${answers[9].correct},${answers[10].correct},${answers[11].correct},${answers[12].correct},${answers[13].correct},${answers[14].correct},${answers[15].correct},${answers[16].correct},${answers[17].correct},${answers[18].correct},${answers[19].correct},${answers[20].correct},${answers[1].time},${answers[2].time},${answers[3].time},${answers[4].time},${answers[5].time},${answers[6].time},${answers[7].time},${answers[8].time},${answers[9].time},${answers[10].time},${answers[11].time},${answers[12].time},${answers[13].time},${answers[14].time},${answers[15].time},${answers[16].time},${answers[17].time},${answers[18].time},${answers[19].time},${answers[20].time},${answers[1].nWords},${answers[2].nWords},${answers[3].nWords},${answers[4].nWords},${answers[5].nWords},${answers[6].nWords},${answers[7].nWords},${answers[8].nWords},${answers[9].nWords},${answers[10].nWords},${answers[11].nWords},${answers[12].nWords},${answers[13].nWords},${answers[14].nWords},${answers[15].nWords},${answers[16].nWords},${answers[17].nWords},${answers[18].nWords},${answers[19].nWords},${answers[20].nWords},${answers[1].case},${answers[2].case},${answers[3].case},${answers[4].case},${answers[5].case},${answers[6].case},${answers[7].case},${answers[8].case},${answers[9].case},${answers[10].case},${answers[11].case},${answers[12].case},${answers[13].case},${answers[14].case},${answers[15].case},${answers[16].case},${answers[17].case},${answers[18].case},${answers[19].case},${answers[20].case},${answers[1].color},${answers[2].color},${answers[3].color},${answers[4].color},${answers[5].color},${answers[6].color},${answers[7].color},${answers[8].color},${answers[9].color},${answers[10].color},${answers[11].color},${answers[12].color},${answers[13].color},${answers[14].color},${answers[15].color},${answers[16].color},${answers[17].color},${answers[18].color},${answers[19].color},${answers[20].color},${answers[1].caseColor},${answers[2].caseColor},${answers[3].caseColor},${answers[4].caseColor},${answers[5].caseColor},${answers[6].caseColor},${answers[7].caseColor},${answers[8].caseColor},${answers[9].caseColor},${answers[10].caseColor},${answers[11].caseColor},${answers[12].caseColor},${answers[13].caseColor},${answers[14].caseColor},${answers[15].caseColor},${answers[16].caseColor},${answers[17].caseColor},${answers[18].caseColor},${answers[19].caseColor},${answers[20].caseColor}\n`;
    }

    for (let r in allResponses){
      let response = allResponses[r];
      let user = allResponses[r].user;
      let bkg = user.background;

      if (user.background !== 'n/a') {
        bkg = user.background.substring(0, 2);
      }

      for (let a = 1; a <= 10; a++) {
        kebab_vs_camel += `${user.userId},${user.age},${user.gender},${bkg},${user.background},${response.answers[a].correct},${response.answers[parseInt(a) + 10].correct},${response.answers[a].time},${response.answers[parseInt(a) + 10].time}\n`;

        if (a + 15  <= 20) {
          mono_vs_color += `${user.userId},${user.age},${user.gender},${bkg},${user.background},${response.answers[a].correct},${response.answers[parseInt(a) + 5].correct},${response.answers[parseInt(a) + 10].correct},${response.answers[parseInt(a) + 15].correct},${response.answers[a].time},${response.answers[parseInt(a) + 5].time},${response.answers[parseInt(a) + 10].time},${response.answers[parseInt(a) + 15].time}\n`;
        }
      }
    }

    const timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    const zip = new JSZip();
    zip.file(`general (${timestamp}).csv`, general);
    zip.file(`kebab_vs_camel (${timestamp}.csv`, kebab_vs_camel);
    zip.file(`mono_vs_color (${timestamp}).csv`, mono_vs_color);

    zip.generateAsync({ type: 'nodebuffer' }).then(function (content) {
      res.setHeader('Content-disposition', `attachment; filename=EExp2 - Reports (${timestamp}).zip`);
      res.setHeader('Content-type', 'application/zip');
      res.send(content);
      console.log(`Sent all reports files to client on ${timestamp}`);
    }).catch(function (err) {
      console.error(`Error sending reports files to client on ${timestamp}`);
      res.status(500).send(`Error sending responses: ${err}`);
    });
  }
);

// 'user_id,age,gender,base_background,background,words,case,color,case_color' +
// 'accuracy_kebab,accuracy_camel,accuracy_kebab_mono,accuracy_kebab_color,accuracy_camel_mono,accuracy_camel_color,' +
//
// 'median_kebab,median_camel,median_kebab_mono,median_kebab_color,median_camel_mono,median_camel_color,' +
//
// '1_accu_km3,2_accu_km2,3_accu_km2,4_accu_km3,5_accu_km2,6_accu_kc2,7_accu_kc2,8_accu_kc3,9_accu_kc2,10_accu_kc3,' +
// '11_accu_cm2,12_accu_cm2,13_accu_cm2,14_accu_cm3,15_accu_cm2,16_accu_cc2,17_accu_cc3,18_accu_cc2,19_accu_cc2,20_accu_cc3,' +
//
// '1_time_km3,2_time_km2,3_time_km2,4_time_km3,5_time_km2,6_time_kc2,7_time_kc2,8_time_kc3,9_time_kc2,10_time_kc3,' +
// '11_time_cm2,12_time_cm2,13_time_cm2,14_time_cm3,15_time_cm2,16_time_cc2,17_time_cc3,18_time_cc2,19_time_cc2,20_time_cc3,' +
//
// '1_n_words,2_n_words,3_n_words,4_n_words,5_n_words,6_n_words,7_n_words,8_n_words,9_n_words,10_n_words,' +
// '11_n_words,12_n_words,13_n_words,14_n_words,15_n_words,16_n_words,17_n_words,18_n_words,19_n_words,20_n_words\n';

/** PIE DE NOTA VARIABLES
 * q are the accurate values (TRUE = 1 or FALSE = 0)


 kebab_accu =  (sum (q1+q2+q3+q4+q5+q6+q7+q8+q9+q10))/10) * 100 ---> per user q values are 1 and 0s
 camel_accu = ( sum (q11+q12+q13+q14+q15+q16+q17+q18+q19+q20)/10 ) * 100
 kebab_mono_accu = (sum (q1+q2+q3+q4+q5))/5) * 100
 kebab_color_accu = (sum (q6+q7+q8+q9+q10))/5) * 100
 camel_mono_accu = sum (q11+q12+q13+q14+q15)/5 ) * 100
 camel_mono_accu = sum (q16+q17+q18+q19+q20)/10 ) * 100

 kebab_time =  (median (q1,q2,q3,q4,q5,q6,q7,q8,q9,q10))---> per user q values are 1 and 0s
 camel_time = ( median (q11+q12+q13+q14+q15+q16+q17+q18+q19+q20)
 kebab_mono_time = (median (q1+q2+q3+q4+q5))
 kebab_color_time = (median (q6+q7+q8+q9+q10))
 camel_mono_time = median (q11+q12+q13+q14+q15)
 camel_mono_time = median (q16+q17+q18+q19+q20)

 OBJETIVOS CSV 1: EN ESTE CASO SE TIENE UN SOLO USUARIO CON TODA LA INFORMACION
 PERMITE COMPARAR ABSOLUTAMENTE TODOS LOS USUARIOS AL TIEMPO
 1) DEMOGRAFICO VS KEBAB
 2) DEMOGRAFICO VS CAMEL

 3) DEMOGRAFICO VS KEBAB MONO
 ...
 6) DEMOGRAFICO VS CAMEL CHROMO

 */
/**
 * OBJETIVO CVS2: HACER LA COMPARACION SE HACEN 10 ROWS para un mismo usuario
 * EN LAS CUALES LO IMPORTANTE ES TENER DOS COLUMNAS:
 * 1) times (q1 - q10)  (KEBAB)
 * 2) times (Q11 - Q20) (CAMEL)
 *
 * // van verticales (hacia abajo)
 * 3) KM || KC  ---> columna dice {KM,KM,KM,KM,KM, KC, KC, KC, KC, KC...} these are columns (verticales)
 * 3) CM || CC  ---> columna dice {CM,CM,CM,CM,CM, CC, CC, CC, CC, CC...}
 */

// response
//     for(let r in allResponses)
//     let kebab_answers = responses.filter(response => response.case === 'k');
//     let camel_answers = responses.filter(response => response.case === 'c');
//     let kebab_mono_answers = responses.filter(response => response.case === 'k' && response.color === 'm');
//     let camel_mono_answers = responses.filter(response => response.case === 'c' && response.color === 'm');
//     let kebab_color_answers = responses.filter(response => response.case === 'k' && response.color === 'c');
//     let camel_color_answers = responses.filter(response => response.case === 'c' && response.color === 'c');
//

/**
 * OBJETIVO CVS3: HACER LA COMPARACION SE HACEN 5 ROWS para un mismo usuario
 * EN LAS CUALES LO IMPORTANTE ES TENER cuatro COLUMNAS: ---> Todas estas son verticales, mira eel fol;der testing...
 * 1) times (q1 - q5)  (KEBAB)
 * 2) times (q6 - q10)  (KEBAB)
 * 3) times (Q11 - Q15) (CAMEL)
 * 4) times (Q16 - Q20) (CAMEL)
 *
 */

// 'user_id,age,gender,base_background,background,words,case,color,kebab_case_color,camel_case_color' +
// 'kebab_accu,camel_accu,kebab_time,camel_time\n';

//
//  += header_kebab_vs_camel;
// for (let i = 0; i < kebab_answers.length; i++) {
//   kebab_vs_camel += `${kebab_answers[i].userId},${kebab_answers[i].age},${kebab_answers[i].gender},
// ${kebab_answers[i].background.substring(0, 2)},${kebab_answers[i].background},${kebab_answers[i].kebab_answers[i].join(' ')},
// ${kebab_answers[i].case},${kebab_answers[i].color},${kebab_answers[i].case + kebab_answers[i].color},
// ${camel_answers[i].case + camel_answers[i].color},${kebab_answers[i].correct},${camel_answers[i].correct},
// ${kebab_answers[i].time},${camel_answers[i].time}\n`;
// }

//   //    case: k|c, color: m|c, kebab_case_color: km|kc, camel_case_color: cm|cc
//   //    case,color,case_color,
//   //    kebab_mono_accu,kebab_color_accu,camel_mono_accu,camel_color_accu,
//   //    kebab_mono_time,kebab_color_time,camel_mono_time,camel_color_time\n';
//
//   mono_vs_color += header_mono_vs_color;
//   for (let i = 0; i < kebab_mono_answers.length; i++) {
//     mono_vs_color += `${kebab_answers[i].userId},${kebab_answers[i].age},${kebab_answers[i].gender},
// ${kebab_answers[i].base_background},${kebab_answers[i].background},${kebab_answers[i].kebab_answers[i].join(' ')},
// ${kebab_mono_answers[i].correct},${kebab_color_answers[i].correct},${camel_mono_answers[i].correct},${camel_color_answers[i].correct},
// ${kebab_mono_answers[i].time},${kebab_color_answers[i].time},${camel_mono_answers[i].time},${camel_color_answers[i].time}`;
//   }
//


/*
 * Sends an email to the administrators with the user's responses attached as a JSON file.
 *
 * @param {string} userId - The user's id.
 * @param {object} responses - The user's responses.
 */
function sendMail(userId, jsonFile, csvFile) {
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
        "Subject": `[EE - Exp2]
  Response
  from
  user ${userId}`,
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

/*
 * This function calculates the median according to an array of numbers.
 * @param {array} numbers - The array of numbers.
 * @return {number} The media.
 */
function median(numbers) {
  const sorted = numbers.slice().sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

module.exports = router;
