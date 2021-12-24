const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express().use("*", cors());
const urlMetadata = require("url-metadata");
app.use(express.json());

app.get("/fetch_preview", async (req, res) => {
  let url = req.headers.url;

  urlMetadata(url, {
  })
    .then(async (metadata) => {
      res.send(metadata);
    })
    .catch((error) => {
      res.status(503).end();
    });
});


app.listen(3001, () => {
  console.log("Server Listening on port 3001");
});

module.exports = app;
