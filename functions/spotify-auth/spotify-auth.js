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


app
  // .use(cors())
  .use(cookieParser());


var stateKey = 'spotify_auth_state';
var redirectToCookie = 'redirect_to_cookie';

var client_id = '13f5eb87218a47ed87ce06e45329bd6c'; // Your client id
var client_secret = process.env.SLAPPER_SPOTIFY_SECRET; // Your secret
var redirect_uri = process.env.SLAPPER_ORIGIN + '/.netlify/functions/spotify-auth/callback'; // Your redirect uri
console.log('redirect_uri: ', redirect_uri);

const scopes = [
  "user-read-currently-playing",
  "user-read-playback-state",
  "user-modify-playback-state",
  "streaming",
  "user-read-private",
  "user-read-email",
  "playlist-read-private",
  "playlist-read-collaborative"
];


const router = express.Router();

router.get('/test', function (req, res) {
  res.send({ application: 'sample-app', version: '1' });
});


router.get('/login', function (req, res) {

  var state = randomString.generate(16);
  res.cookie(stateKey, state);
  res.cookie(redirectToCookie, req.query.redirect);

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scopes.join(" "),
      redirect_uri: redirect_uri,
      state: state
    }));
});

router.get('/callback', function (req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;
  var redirectTo = req.cookies ? req.cookies[redirectToCookie] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
          refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function (error, response, body) {
          console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect((redirectTo || "/s") + '#' +
          querystring.stringify({
            spotify_a_token: access_token,
            spotify_r_token: refresh_token
          }));
      } else {
        res.redirect((redirectTo || "/s") + '#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

router.get('/refresh_token', function (req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.spotify_r_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'spotify_a_token': access_token
      });
    }
  });
});


app.use('/.netlify/functions/spotify-auth', router);  // path must route to lambda

// app.listen(1337)
module.exports.handler = serverless(app);