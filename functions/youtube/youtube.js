/*
 * Advanced Cloud Code Example
 */
const express = require('express');
const app = express();
var request = require('request');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var randomString = require("randomstring");
const serverless = require('serverless-http');
const axios = require("axios")

app
// .use(cors())
// .use(cookieParser());

const router = express.Router();

router.get('/getVideoData/:videoId', function (req, res) {
  axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${req.params.videoId}&part=contentDetails,snippet&key=${process.env.YOUTUBE_API_KEY}`)
  .then(a => {
    console.log("body", a.body)
    if(!a.data.items[0]){
      return res.status(404).send({
        message: "not found"
      })
    }

    return res.send({
      videoId: req.params.videoId,
      title: a.data.items[0].snippet.title,
      duration: convertISO8601ToSeconds(a.data.items[0].contentDetails.duration)
    })
  })
});

function convertISO8601ToSeconds(input) {

  var reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
  var hours = 0, minutes = 0, seconds = 0, totalseconds;

  if (reptms.test(input)) {
      var matches = reptms.exec(input);
      if (matches[1]) hours = Number(matches[1]);
      if (matches[2]) minutes = Number(matches[2]);
      if (matches[3]) seconds = Number(matches[3]);
      totalseconds = hours * 3600  + minutes * 60 + seconds;
  }

  return (totalseconds);
}

app.use('/.netlify/functions/youtube', router);  // path must route to lambda

// app.listen(1337)
module.exports.handler = serverless(app);