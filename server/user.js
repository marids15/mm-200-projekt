let express = require('express');
let router = express.Router();
const db = require("./db.js");
const sha256 = require('js-sha256').sha256;

// creating new user
router.post('/api/user', async function(req, res, next) {
  let userName = req.body.username;
  let userEmail = req.body.email;
  let userPass = sha256(process.env.SALT + req.body.password);
  let userRole = req.body.role;

  let queryUser = `SELECT * FROM public.users t
  WHERE username = '${userName}'`;

  // check if user already exists
  let userExists = await db.select(queryUser);
  if(userExists) {
    res.status(403).json({}).end();
  } else {

    let query = `INSERT INTO "public"."users" ("id", "username", "email", "password", "role")
      VALUES (DEFAULT, '${userName}', '${userEmail}', '${userPass}', '${userRole}') RETURNING *`;

    let user = await db.insert(query);

    let userId = user[0].id;
    let newToken = createToken(userId);
    let queryToken = `INSERT INTO "public".tokens ("token", "user_id") VALUES ('${newToken}', '${userId}') RETURNING *`;
    let token = await db.insert(queryToken);

    let status = (user && token) ? 200 : 500;
    res.status(status).set('Authorization', token[0].token).json(user).end();
  }
});

// Logging in
router.post('/api/users/auth', async function(req, res, next) {
  let userName = req.body.username;
  let userPass = sha256(process.env.SALT + req.body.password);

  let query = `SELECT * FROM public.users t
  WHERE username = '${userName}' and password = '${userPass}'`;

  let user = await db.select(query);
  if(user) {
    let userID = user[0].id;
    let newToken = createToken(userID);
    let queryToken = `UPDATE "public"."tokens" SET "token" = '${newToken}'
    WHERE "user_id" = ${userID} RETURNING *`;

    let token = await db.select(queryToken);
    res.status(200).set({'Authorization': token[0].token}).json(user);
  } else {
    res.status(401).json({}).end();
  }
});

function createToken(userID) {
  let date = new Date();
  return sha256(process.env.TOKEN_WORD + date + userID);
}

// checking tokens for accessing pages
router.post('/api/users/token', async function(req, res) {
  let token = req.body.token;
  let userID = req.body.userID;

  let queryToken = `SELECT * FROM public.tokens t
  WHERE token = '${token}' and user_id = '${userID}'`;

  let response = await db.select(queryToken);
  if (response){
    res.status(200).json(response).end();
  } else {
    res.status(403).json({}).end();
  }
});

module.exports = router;
