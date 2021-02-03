var express = require('express');
var app = express();
var path = require('path');
var dataService = require('./data-service.js');

var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHTTPStart() {
  console.log('Express http server listening on: ' + HTTP_PORT);
}

//for your server to correctly return the "css/site.css" file, the "static" middleware must be used
// setup the static folder that static resources can load from
// like images, css files, etc.
app.use(express.static('public'));

//// setup a 'route' to listen on /home
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/views/home.html'));
});

//// setup a 'route' to listen on /about
app.get('/about', function (req, res) {
  res.sendFile(path.join(__dirname, '/views/about.html'));
});

//// setup a 'route' to listen on /employees
app.get('/employees', function (req, res) {
  res.sendFile(path.join(__dirname, '/views/about.html'));
});

//// setup a 'route' to listen on /managers
app.get('/managers', function (req, res) {
  res.json({ isManager: 'true' });
});

//// setup a 'route' to listen on /departments
app.get('/departments', function (req, res) {
  res.send('<h3>Departments</h3>');
});

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, onHTTPStart);
