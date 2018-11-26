let express = require('express');
let router = express.Router();
var db = require("./db.js");
const SHARE_INDIVIDUAL = 2;

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
  let token = req.headers.Authorization;
  let userID = req.body.user_id;
  // check if token is valid
  if (checkToken(token, userID)) {   // token is valid
    let query = `SELECT * FROM public.presentations t
    WHERE id = '${presentationID}' AND (user_id = '${userID}' OR share_option = '${SHARE_INDIVIDUAL}')`;

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
  let token = req.headers.Authorization;
  let owner = req.body.owner; // id of owner

  // check if token is valid
  if (checkToken(token, owner)) { // token is valid
    let query = `UPDATE "public"."presentations" SET "presentation_json" = '${presentation}'
    WHERE "id" = '${presentationID}' AND (user_id = '${owner}' OR share_option = '${SHARE_INDIVIDUAL}') RETURNING *`;
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
  let token = req.headers.Authorization;

  // check if token is valid
  if (checkToken(token, userid)) { // token is valid
    let query = `SELECT * FROM public.presentations t
    WHERE "user_id" = '${userid}'`;

    let response = await db.select(query);
    let status = response ? 200 : 500;
    res.status(status).json(response).end();
  } else {  // token is invalid
    res.status(403).json({}).end();
  }
});

// Delete presentation of user
router.delete('/api/presentations/:presentationid', async function(req, res) {
  let userid = req.body.user_id;
  let presentationid = req.body.presentation_id;
  let token = req.headers.Authorization;

  // check token and if user is owner of presentation
  if (checkToken(token, userid) && checkOwner(presentationid, userid)) { // token is valid and user is owner
    let queryDeletePresentation = `DELETE FROM "public"."presentations" WHERE "id" = '${presentationid}' RETURNING *`;
    let deleted = await db.delete(queryDeletePresentation);
    let status = deleted ? 200 : 500;
    res.status(status).json({}).end();

  } else { // token is invalid or user is not owner
    res.status(403).json({}).end();
  }
});

// Update sharing options
router.post('/api/presentations/:presentationid/sharing', async function(req, res){
  let userId = req.body.user_id;
  let presentationId = req.body.presentation_id;
  let shareOption = req.body.share_option;
  let token = req.headers.Authorization;

  // check token and if user is owner
  if (checkToken(token, userId) && checkOwner(userId, presentationId)) { // token is valid and user is owner
    let queryUpdateSharing = `UPDATE "public"."presentations" SET "share_option" = '${shareOption}' WHERE "id" = ${presentationId} RETURNING *`;
    let response = await db.update(queryUpdateSharing);
    let status = response? 200: 500;
    res.status(status).json({}).end();
  } else {
    res.status(403).json({}).end();
  }
});

// retrieving all public presentations
router.get('/api/public/presentations', async function(req, res) {
  let shareOption = 1;

  let queryPresentations = `SELECT * FROM public.presentations t
  WHERE share_option = '${shareOption}'`;

  let response = await db.select(queryPresentations);
  let status = response? 200 : 500;
  res.status(status).json(response).end();
})

// function to check whether token and userid combination is valid, returns boolean
async function checkToken(token, userid) {
  let query = `SELECT * FROM public.tokens t
  WHERE token = '${token}' and user_id = '${userid}'`;
  let response = await db.select(query);
  if (response) {
    return true;
  } else {
    return false;
  }
}

// function to check whether user is owner of presentation.
async function checkOwner(presentationid, userid) {
    let queryIfOwner = `SELECT * FROM public.presentations t
    WHERE id = '${presentationid}' and user_id = '${userid}'`;
    let isOwner = await db.select(queryIfOwner);
    if (isOwner) {
      return true;
    } else {
      return false;
    }
}

module.exports = router;
