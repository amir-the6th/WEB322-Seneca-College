/*********************************************************************************
 *  WEB322 – Assignment 02
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.
 *  No part *  of this assignment has been copied manually or electronically from any other source
 *  (including 3rd party web sites) or distributed to other students.
 *
 *  Name: Amirhossein Sabagh
 *  Student ID: 152956199
 *  Date: 2021-02-05
 *
 *  Online (Heroku) Link:  https://frozen-meadow-35295.herokuapp.com
 *
 ********************************************************************************/

const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const dataService = require('./data-service.js');

const HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHTTPStart() {
  console.log('Express http server listening on: ' + HTTP_PORT);
}

//the middleware to support image uploads
const storage = multer.diskStorage({
  destination: './public/images/uploaded',
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// tell multer to use the diskStorage function for naming files instead of the default.
const upload = multer({ storage: storage });

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

//// setup a 'route' to listen on /employees/add
app.get('/employees/add', function (req, res) {
  res.sendFile(path.join(__dirname, '/views/addEmployee.html'));
});

//// setup a 'route' to listen on /images/add
app.get('/images/add', function (req, res) {
  res.sendFile(path.join(__dirname, '/views/addImage.html'));
});

//// setup a 'route' to listen on /employees
app.get('/employees', function (req, res) {
  dataService.getAllEmployees().then((data) => {
    res.json(data);
  });
});

//// setup a 'route' to listen on /managers
app.get('/managers', function (req, res) {
  dataService.getManagers().then((data) => {
    res.json(data);
  });
});

//// setup a 'route' to listen on /departments
app.get('/departments', function (req, res) {
  dataService.getDepartments().then((data) => {
    res.json(data);
  });
});

app.post('/images/add', upload.single('photo'), (req, res) => {
  res.send('register');
});

//// setup a 'route' for no matching route
//////// Traditional way:
// app.use(function (req, res) {
//   res.status(404).send('Page Not Found');
// });
//////// Modern way:
app.use(function (req, res) {
  res.sendFile(path.join(__dirname, '/views/404.html'));
});

//// setup http server to listen on HTTP_PORT
dataService
  .initialize()
  .then(function () {
    app.listen(HTTP_PORT, onHTTPStart);
  })
  .catch(function (err) {
    console.log('Failed to start!' + err);
  });
