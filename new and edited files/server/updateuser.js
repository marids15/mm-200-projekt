let express = require('express');
let router = express.Router();
const db = require("./db.js");
const sha2565 = require('js-sha256').sha256;

// creating new user
// creating new user
router.post('/api/update', async function(req, res, next) {

  console.log("apiiienimnnnnn1");
console.log(res);
  let userName = req.body.username;
  let userEmail = req.body.email;
  let userPasss = sha2565(process.env.SALT + req.body.password);
  let userRole = req.body.role;
  let userID = req.body.id;
  let oldname= req.body.oldname;
  let oldemail= req.body.oldemail;
  let oldpsw= req.body.psw;

  let queryUser = `SELECT * FROM public.users t
  WHERE username = '${oldname}'`;

  let userExists = await db.select(queryUser);

  //console.log(userExists);
  if(userExists) {
    let query = `UPDATE "public"."users" SET "username" = '${userName}', "email" = '${userEmail}, "password" = '${userPasss}'
    WHERE "id" = '${userID}' AND "username" LIKE '${oldname}' ESCAPE '#' AND "email" LIKE '${oldemail}' ESCAPE '#' AND "password" LIKE '${oldpsw}' ESCAPE '#' AND "role" = '${userRole}'RETURNING *`;
;

    let user = await db.insert(query);

    let userId = user[0].id;
    let newToken = createToken2(userId);
    let queryToken = `UPDATE "public"."tokens" SET "token" = '${newToken}' WHERE "user_id" LIKE '${userID}' ESCAPE '#' RETURNING *`;
    let token = await db.insert(queryToken);

    let status = (user && token) ? 200 : 500;
    res.status(status).set('Authorization', token[0].token).json(user).end();
  } else {
res.status(404).json({}).end();

  }
});
function createToken2(userID) {
  console.log('creating token...Updateudser');
  let date = new Date();
  return sha2565(process.env.TOKEN_WORD + date + userID);
}
module.exports = router;
/*
router.post('/api/update', async function(req, res, next) {
  let userName = req.body.username;
  let userEmail = req.body.email;
  let userPass = sha256(process.env.SALT + req.body.password);
  let userRole = req.body.role;
  console.log("apiiienimnnnnn1");

  let userName = req.body.username;
  let userEmail = req.body.email;
  let userPasss = sha2565(process.env.SALT + req.body.password);
  let userRole = req.body.role;
  let userID = req.body.id;
  let oldname= req.body.oldname;
  let oldemail= req.body.oldemail;
  let oldpsw= req.body.psw;


  let queryUser = `SELECT * FROM public.users t
  WHERE username = '${userName}'`;

  let userExists = await db.select(queryUser);

  //console.log(userExists);
    if(userExists) {
    res.status(403).json({}).end();
  } else {

    let query = `INSERT INTO "public"."users" ("id", "username", "email", "password", "role")
      VALUES (DEFAULT, '${userName}', '${userEmail}', '${userPasss}', '${userRole}') RETURNING *`;

    let user = await db.insert(query);

    let userId = user[0].id;
    let newToken = createToken(userId);
    let queryToken = `INSERT INTO "public".tokens ("token", "user_id") VALUES ('${newToken}', '${userId}') RETURNING *`;
    let token = await db.insert(queryToken);

    let status = (user && token) ? 200 : 500;
    res.status(status).set('Authorization', token[0].token).json(user).end();

});

    function createToken2(userID) {
      console.log('creating token...Updateudser');
      let date = new Date();
      return sha2565(process.env.TOKEN_WORD + date + userID);
    }

module.exports = router;

router.post('/api/update', async function(req, res, next) {
  console.log("apiiienimnnnnn1");
  console.log(req.body.username);
      let userName = req.body.username;
      let userEmail = req.body.email;
      let userPasss = sha2565(process.env.SALT + req.body.password);
      let userRole = req.body.role;
      let userID = req.body.id;
      let oldname= req.body.oldname;
      let oldemail= req.body.oldemail;
      let oldpsw= req.body.psw;

      let query = `UPDATE "public"."users" SET "username" = '${userName}', "email" = '${userEmail}, "password" = '${userPasss}'
      WHERE "id" = '${userID}' AND "username" LIKE '${oldname}' ESCAPE '#' AND "email" LIKE '${oldemail}' ESCAPE '#' AND "password" LIKE '${oldpsw}' ESCAPE '#' AND "role" = '${userRole}'RESPONSE`;
  let user = await db.update(query);
//  console.log(user);
console.log("api2");
//console.log(userExists);

        let newToken = createToken2(userID);
        let queryToken = `INSERT "public".tokens ("token", "user_id") VALUES ('${newToken}', '${userID}') RETURNING *`;
        let token = await db.insert(queryToken);

        let status = (user && token) ? 200 : 500;.set('Authorization', token[0].token)
        res.status(status).end();

      }
    );
*/
