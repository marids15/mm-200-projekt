let express = require('express');
let router = express.Router();
const db = require("./db.js");
//const shaz = require('js-sha256').sha256;


router.post('/api/content', async function(req, res, next) {
let id = req.body.id;

let contentQuery = `SELECT t.* FROM public.content_table t
WHERE userid = '${id}' RETURNING *`;
let queryResults = await db.select(contentQuery)

console.log(queryResults);
if(queryResults) {
  res.status(200).json(queryResults).end();
} else {
  res.status(401).json({}).end();
}
/*let status = queryResults ? 200 : 500;
res.status(status).json(queryResults).end();

if (queryResults){
  console.log("got back");
  res.status(400).json({}).end();
} else {
  res.status(404).json({}).end();
}
*/
});
module.exports = router;
