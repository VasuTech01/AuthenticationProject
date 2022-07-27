
fetch("https://localhost:3000/", {
  method: "GET",
  headers: {
    "content-type": "application/json",
    Authorization: "Bearer ",
  },
  body: {
    username: "robin",
  },
}).then((response) => response.json())
    .then((response) => {
        console.log(response);
  });
