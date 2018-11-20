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

  let userExists = await db.select(queryUser);

  //console.log(userExists);
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
    let tokenQuery = `SELECT * FROM public.tokens t WHERE user_id = '${user[0].id}'`;

    let token = await db.select(tokenQuery);
    console.log(token[0]);
    res.status(200).set({'Authorization': token[0].token}).json(user);
  } else {
    res.status(401).json({}).end();
  }
});

function createToken(userID) {
  console.log('creating token...');
  let date = new Date();
  return sha256(process.env.TOKEN_WORD + date + userID);
}

// Get user information
router.get('/api/users/:userid', async function(req, res) {
  let userID = req.params.userid;

  let queryUser = `SELECT * FROM public.users t
  WHERE "user_id" = '${userID}'`;

  let response = await db.select(queryUser);
  console.log(response[0]);
  if (response) {
    res.status(200).json(response);
  } else {
    res.status(500).json({}).end();
  }
});

module.exports = router;
