/*********************************************************************************
 *  WEB322 – Assignment 1
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.
 *  No part of this assignment has been copied manually or electronically from any other source
 *  (including web sites) or distributed to other students.
 *
 *  Name: Amirhossein Sabagh Student ID: 192956199 Date: 2021-01-11
 *
 *  Online (Heroku) URL: https://pacific-cove-66100.herokuapp.com
 *
 ********************************************************************************/

var HTTP_PORT = process.env.PORT || 8080;
var express = require('express');
var app = express();

// setup a 'route' to listen on the default url path
app.get('/', (req, res) => {
  res.send('Amir Sabagh - 152956199');
});
console.log('Amir Sabagh - 152956199');

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT);

// I just want to make a change so I can push it and check if it works. Cheers!
