const GET_USER_URL = "/api/users"

let userID = localStorage.getItem('user_id');

fetch(GET_USER_URL + userID).
