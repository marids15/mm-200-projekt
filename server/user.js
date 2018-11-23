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
    res.status(200).set({'Authorization': token[0].token}).json(user); // send token to client
  } else {
    res.status(401).json({}).end();
  }
});

// creating new token
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

// Get user information
router.get('/api/users/:userid', async function(req, res) {
  let userID = req.params.userid;
  let token = req.headers.Authorization;

  // check if sent token is valid
  if (checkToken(token, userID)) {  // token is valid
    let queryUser = `SELECT * FROM public.users t
    WHERE "id" = '${userID}'`;

    let response = await db.select(queryUser);
    if (response) {
      res.status(200).json(response);
    } else {
      res.status(500).json({}).end();
    }
  } else {  // token is invalid
    res.status(403).json({}).end();
  }
});

// changing user email
router.post('/api/users/:userid/email', async function(req, res) {
  let userID = req.params.userid;
  let email = req.body.email;
  let token = req.headers.Authorization;

  // check if token is valid
  if (checkToken(token, userID)) {  // token is valid
    let queryUser =  `UPDATE "public"."users" SET "email" = '${email}' WHERE "id" = '${userID}' RETURNING *`
    let response = await db.update(queryUser);

    if (response) {
      res.status(200).json(response);
    } else {
      res.status(500).json({}).end();
    }
  } else {  // token is invalid
    res.status(403).json({}).end();
  }
});

// changing user password
router.post('/api/users/:userid/pass', async function(req, res) {
  let userID = req.params.userid;
  let token = req.headers.Authorization;

  // check if token is valid
  if (checkToken(token, userID)) {  // token is valid
    // check if old password is valid
    let oldPasswordHash = sha256(process.env.SALT + req.body.old_password)
    let queryOldPassword = `SELECT * FROM public.users t WHERE id = '${userID}' AND password = '${oldPasswordHash}'`;

    let responseOldPassword = await db.select(queryOldPassword);
    if (responseOldPassword) { // old password is valid
      let newPassword = sha256(process.env.SALT + req.body.new_password);
      let queryNewPassword = `UPDATE "public"."users" SET "password" = '${newPassword}' WHERE "id" = '${userID}' RETURNING *`;
      let responseNewPassword = await db.update(queryNewPassword);

      if (responseNewPassword) {  // new password is stored
        res.status(200).json(responseNewPassword);
      } else {  // new password is not stored (server error)
        res.status(500).json({}).end();
      }
    } else {  // old password is not valid
      res.status(400).json({}).end();
    }
  } else {  // token is not valid
    res.status(403).json({}).end();
  }
});

// deleting user
router.delete('/api/users/:userid', async function(req, res) {
  let userID = req.params.userid;
  let token = req.headers.Authorization;

  // check if token is valid
  if (checkToken(token, userID)) { // token is valid
    let deleteOption = req.body.delete_option;
    let deletedPresentations = false;

    // deleting presentations linked to user
    if (deleteOption == 0) { // deleting all presentations
      let queryPresentations = `DELETE FROM "public"."presentations" WHERE "user_id" = '${userID}' RETURNING *`;
      let responsePresentations = await db.select(queryPresentations);
      if (responsePresentations) { // presentations are deleted
        deletedPresentations = true;
      }
    } else if (deleteOption == 1) { // deleting only not public presentations
      let queryPresentations = `DELETE FROM "public"."presentations" WHERE user_id = '${userID}' AND (NOT share_option = '${SHARE_PUBLIC}') RETURNING *`;
      let responsePresentations = await db.select(queryPresentations);
      if (responsePresentations) {  // presentations are deleted
        deletedPresentations = true;
      }
    } else { // invalid delete option is sent
      res.status(400).json({}).end();
    }

    // deleting token linked to user
    let queryDeleteToken = `DELETE FROM "public"."tokens" WHERE "user_id" = ${userID} RETURNING *`;
    let responseDeleteToken = await db.delete(queryDeleteToken);

    // check if both token and presentations are deleted
    if (responseDeleteToken && deletedPresentations) { // tokens and presentations are deleted
      let queryDeleteUser = `DELETE FROM "public"."users" WHERE "id" = ${userID} RETURNING *`

      let responseDeleteUser = await db.delete(queryDeleteUser);
      if (responseDeleteUser) { // user is deleted
        res.status(200).json({}).end();
      } else {  // user is not deleted (server error)
        res.status(500).json({}).end();
      }
    } else { // token or presentation is not deleted (server error)
      res.status(500).json({}).end();
    }
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
