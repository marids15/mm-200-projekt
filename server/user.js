let express = require('express');
let router = express.Router();
const db = require("./db.js");
const sha256 = require('js-sha256').sha256;
const SHARE_PUBLIC = 1;

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

// creating new token
function createToken(userID) {
  console.log('creating token...');
  let date = new Date();
  return sha256(process.env.TOKEN_WORD + date + userID);
}

// Get user information
router.get('/api/users/:userid', async function(req, res) {
  let userID = req.params.userid;

  let queryUser = `SELECT * FROM public.users t
  WHERE "id" = '${userID}'`;

  let response = await db.select(queryUser);
  if (response) {
    res.status(200).json(response);
  } else {
    res.status(500).json({}).end();
  }
});

// changing user email
router.post('/api/users/:userid/email', async function(req, res) {
  let userID = req.params.userid;
  let email = req.body.email;

  let queryUser =  `UPDATE "public"."users" SET "email" = '${email}' WHERE "id" = '${userID}' RETURNING *`
  let response = await db.update(queryUser);
  console.log(response[0]);

  if (response) {
    res.status(200).json(response);
  } else {
    res.status(500).json({}).end();
  }
});

// changing user password
router.post('/api/users/:userid/pass', async function(req, res) {
  let userID = req.params.userid;
  let oldPasswordHash = sha256(process.env.SALT + req.body.old_password)
  let queryOldPassword = `SELECT * FROM public.users t WHERE id = '${userID}' AND password = '${oldPasswordHash}'`;
  console.log(oldPasswordHash);
  console.log(queryOldPassword);

  let responseOldPassword = await db.select(queryOldPassword);
  console.log(responseOldPassword)
  if (responseOldPassword) {
    let newPassword = sha256(process.env.SALT + req.body.new_password);
    let queryNewPassword = `UPDATE "public"."users" SET "password" = '${newPassword}' WHERE "id" = '${userID}' RETURNING *`;
    let responseNewPassword = await db.update(queryNewPassword);

    if (responseNewPassword) {
      res.status(200).json(responseNewPassword);
    } else {
      res.status(500).json({}).end();
    }
  } else {
    res.status(403).json({}).end();
  }
});

// deleting user
router.delete('/api/users/:userid', async function(req, res) {
  let userID = req.params.userid;
  console.log(userID);
  let deleteOption = req.body.delete_option;
  console.log('Option: ' + deleteOption);
  let deletedPresentations = false;

  // deleting presentations linked to user
  if (deleteOption == 0) {
    console.log('Deleting All presentations');
    let queryPresentations = `DELETE FROM "public"."presentations" WHERE "user_id" = '${userID}' RETURNING *`;
    console.log(queryPresentations);
    let responsePresentations = await db.select(queryPresentations);
    console.log(responsePresentations);
    if (responsePresentations) {
      deletedPresentations = true;
    }
  } else if (deleteOption == 1) {
    let queryPresentations = `DELETE FROM "public"."presentations" WHERE user_id = '${userID}' AND (NOT share_option = '${SHARE_PUBLIC}') RETURNING *`;
    let responsePresentations = await db.select(queryPresentations);
    if (responsePresentations) {
      deletedPresentations = true;
    }
  } else {
    res.status(400).json({}).end();
  }

  console.log('Deleted presentations');
  // deleting token
  let queryDeleteToken = `DELETE FROM "public"."tokens" WHERE "user_id" = ${userID} RETURNING *`;
  console.log(queryDeleteToken);
  let responseDeleteToken = await db.delete(queryDeleteToken);
  console.log(responseDeleteToken);

  if (responseDeleteToken && deletedPresentations) {
    console.log('Token deleted...');
    let queryDeleteUser = `DELETE FROM "public"."users" WHERE "id" = ${userID} RETURNING *`

    let responseDeleteUser = await db.delete(queryDeleteUser);
    if (responseDeleteUser) {
      console.log('User deleted!');
      res.status(200).json({}).end();
    } else {
      console.log('User not deleted :(');
      res.status(500).json({}).end();
    }
  } else {
    console.log('Token not deleted :(');
    res.status(500).json({}).end();
  }
});

module.exports = router;
