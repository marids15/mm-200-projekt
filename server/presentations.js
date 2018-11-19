let express = require('express');
let router = express.Router();
var db = require("./db.js");

router.post('/api/presentations/new', async function(req, res, next) {
  let name = req.body.name;
  let owner = req.body.owner;
  let share_option = 0;

  let emptyPresentation = JSON.stringify({
    presentation: {
      name: name,
      currentSlideIndex: 0,
      slides: []
    }
  });

  let query =  `INSERT INTO "public"."presentations" ("id", "presentation_json", "user_id", "share_option")
    VALUES (DEFAULT, '${emptyPresentation}', '${owner}', '${share_option}') RETURNING *`;

  let presentation = await db.insert(query);
  let status = presentation ? 200: 500;
  res.status(status).json(presentation).end();
});

router.post('/api/presentations', async function(req, res) {
  //console.log('Finding presentation...');
  let presentationID = req.body.presentation_id;
  //console.log(presentationID);
  let query = `SELECT * FROM public.presentations t
  WHERE id = '${presentationID}'`;

  let presentation = await db.select(query);
  let status = presentation ? 200 : 500;
  res.status(status).json(presentation).end();
});

router.post('/api/presentations/save', async function(req, res) {
  let presentationID = req.body.presentation_id;
  let presentation = req.body.presentation;
  console.log(presentationID);
  console.log(presentation);
  let query = `UPDATE "public"."presentations" SET "presentation_json" = '${presentation}' WHERE "id" = ${presentationID} RETURNING *`;
  console.log(query);

  let response = await db.update(query);
  console.log(response);
  let status = response ? 200 : 500;
  res.status(status).json(response).end();
});

router.get('/api/presentations/:userid', async function(req, res) {
  let userid = req.params.userid;

  let query = `SELECT * FROM public.presentations t
  WHERE "user_id" = '${userid}'`;

  let response = await db.select(query);
  let status = response ? 200 : 500;
  res.status(status).json(response).end();
})

module.exports = router;
