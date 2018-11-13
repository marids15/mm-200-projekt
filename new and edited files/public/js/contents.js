document.getElementById("getdata").onclick= getDATA;
document.getElementById("postdata").onclick= postDATA;
const CONTENT_URL = 'api/content';

function getDATA(){
  console.log("getting");

  contentFromServer();
}
function postDATA(){
  console.log("posting");
}

async function contentFromServer() {
  let data = JSON.stringify({
  id: localStorage.getItem("id").value
  console.log(id);
    });
  fetch(CONTENT_URL, {
    method: 'POST',
    body: data,
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }).then(response => {
    if (response.status < 400) {
      console.log('got my content');
      console.log(response);
    } else {
      console.log('did not get content :(');
    }
  }).then(data => console.log('next'))
  .catch(err => console.err(err));
  }
  // password: document.getElementById('inpPsw').value
  //UPDATE "public"."users" SET "username" = 'james2' WHERE "id" = 34 AND "username" LIKE 'james' ESCAPE '#' AND "email" LIKE 'test@mytest.com' ESCAPE '#' AND "password" LIKE '123' ESCAPE '#' AND "role" = 0
