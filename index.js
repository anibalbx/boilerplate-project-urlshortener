require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const dns = require("dns");

//app vars

const urlList = [];
let count = 0;

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/shorturl", (req, res) => {
  try {
    const urllink = new URL(req.body.url);
    //check if url is valid via dns
    dns.lookup(urllink.hostname, (err) => {
      if (!err) {
        count++;
        urlList.push(req.body.url);
        res.json({ original_url: req.body.url, short_url: count });
      } else {
        res.json({ error: "invalid url" });
      }
    });
  } catch (err) {
    console.log(err);
    res.json({ error: "invalid url" });
  }
});

app.get("/api/shorturl/:page", (req, res) => {
  const num_page = req.params.page;
  //check index in bounds
  if (num_page <= urlList.length) {
    res.redirect(urlList[req.params.page - 1]);
  } else {
    res.json({ error: "invalid url" });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
