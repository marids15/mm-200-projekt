const {
  Pool,
  Client
} = require('pg');

const connectionString = process.env.DATABASE_URL;

const db = {}

async function runQuery(query) {
  let response = null;
  const client = new Client({
    connectionString:connectionString,
    ssl: true
  })

  try {

    // wait till connection is established
    await client.connect();

    // promise for query
    let res = await client.query(query).then(function(res) {
      return res;
    }).catch(function(err) {
      console.err(err);
    });

    console.log(res.rows);
    if (res.rows && res.rows.length > 0) {
        response = res.rows; //returns array with resulting rows of query
    }
  } catch (e) {
    console.err("Error: ");
    console.log(e);
  }

  return response;
}

db.insert = async function (query) {
    return await runQuery(query);
}

db.select = async function (query) {
    return await runQuery(query);
}

db.delete = async function (query) {
    //Is actually an update
    return await runQuery(query);
}

db.update = async function (query) {
    return await runQuery(query);
}

module.exports = db;
