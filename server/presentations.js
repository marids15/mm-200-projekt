let express = require('express');
let router = express.Router();
var db = require("./db.js");

// Create new presentation
router.post('/api/presentations/new', async function(req, res) {
  let name = req.body.name;
  let owner = req.body.owner; // user id of owner
  let share_option = 0;
  let token = req.headers.Authorization;

  // check if token is valid
  if (checkToken(token, owner)) { // token is valid
    let emptyPresentation = JSON.stringify({
      presentation: {
        name: name,
        currentSlideIndex: 0,
        theme: 'Default',
        slides: []
      }
    });

    let query =  `INSERT INTO "public"."presentations" ("id", "presentation_json", "user_id", "share_option")
      VALUES (DEFAULT, '${emptyPresentation}', '${owner}', '${share_option}') RETURNING *`;

    let presentation = await db.insert(query);
    let status = presentation ? 200: 500;
    res.status(status).json(presentation).end();
  } else { // token is invalid
    res.status(403).json({}).end();
  }

});

// load already existing presentation
router.post('/api/presentations', async function(req, res) {
  let presentationID = req.body.presentation_id;

  // check if token is valid
  if (checkToken(token, owner)) {   // token is valid
    let query = `SELECT * FROM public.presentations t
    WHERE id = '${presentationID}'`;

    let presentation = await db.select(query);
    let status = presentation ? 200 : 500;
    res.status(status).json(presentation).end();
  } else {  // token is invalid
    res.status(403).json({}).end();
  }
});

// store presentation
router.post('/api/presentations/save', async function(req, res) {
  let presentationID = req.body.presentation_id;
  let presentation = req.body.presentation;

  // check if token is valid
  if (checkToken(token, owner)) { // token is valid
    let query = `UPDATE "public"."presentations" SET "presentation_json" = '${presentation}' WHERE "id" = ${presentationID} RETURNING *`;
    let response = await db.update(query);

    let status = response ? 200 : 500;
    res.status(status).json(response).end();
  } else { // token is invalid
    res.status(403).json({}).end();
  }
});

// get all presentations from one user
router.get('/api/presentations/:userid', async function(req, res) {
  let userid = req.params.userid;

  // check if token is valid
  if (checkToken(token, owner)) { // token is valid
    let query = `SELECT * FROM public.presentations t
    WHERE "user_id" = '${userid}'`;

    let response = await db.select(query);
    let status = response ? 200 : 500;
    res.status(status).json(response).end();
  } else {  // token is invalid
    res.status(403).json({}).end();
  }
});

// function to check whether token and userid combination is valid, returns boolean
async function checkToken(token, userid) {
  let query = `SELECT * FROM public.tokens t
  WHERE token = '${token}' and user_id = '${userid}'`;
  let response = db.select(query);
  if (response) {
    return true;
  } else {
    return false;
  }
}

module.exports = router;
