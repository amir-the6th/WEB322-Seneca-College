/*********************************************************************************
 *  WEB322 – Assignment 05
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.
 *  No part *  of this assignment has been copied manually or electronically from any other source
 *  (including 3rd party web sites) or distributed to other students.
 *
 *  Name: Amirhossein Sabagh
 *  Student ID: 152956199
 *  Date: 2021-03-26
 *
 *  Online (Heroku) Link:
 *
 ********************************************************************************/

const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const path = require('path');
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');
const dataService = require('./data-service.js');

const HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHTTPStart() {
  console.log('Express http server listening on: ' + HTTP_PORT);
}

// set up engine for handlebars
app.engine(
  '.hbs',
  exphbs({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {
      //fixing the navbar 'active' issue
      navLink: (url, options) => {
        return (
          '<li' +
          (url == app.locals.activeRoute ? ' class="active" ' : '') +
          '><a href="' +
          url +
          '">' +
          options.fn(this) +
          '</a></li>'
        );
      },
      equal: (lvalue, rvalue, options) => {
        if (arguments.length < 3)
          throw new Error('Handlebars Helper equal needs 2 parameters');
        if (lvalue != rvalue) {
          return options.inverse(this);
        } else {
          return options.fn(this);
        }
      },
    },
  })
);
app.set('view engine', '.hbs');

//the middleware to support image uploads
const storage = multer.diskStorage({
  destination: './public/images/uploaded',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// tell multer to use the diskStorage function for naming files instead of the default.
const upload = multer({ storage: storage });

app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = route == '/' ? '/' : route.replace(/\/$/, '');
  next();
});

//for your server to correctly return the "css/site.css" file, the "static" middleware must be used
// setup the static folder that static resources can load from
// like images, css files, etc.
app.use(express.static('public'));

//// setup a 'route' to listen on /home
app.get('/', (req, res) => {
  // res.sendFile(path.join(__dirname, '/views/home.html'));
  res.render('home');
});

//// setup a 'route' to listen on /about
app.get('/about', (req, res) => {
  // res.sendFile(path.join(__dirname, '/views/about.html'));
  res.render('about');
});

//// setup a 'route' to listen on /employees/add
app.get('/employees/add', (req, res) => {
  // res.sendFile(path.join(__dirname, '/views/addEmployee.html'));
  dataService
    .getDepartments()
    .then((value) => res.render('addEmployee', { departments: value }))
    .catch(() => res.render('addEmployee', { departments: [] }));
});

//// setup a 'route' to listen on /images/add
app.get('/images/add', (req, res) => {
  // res.sendFile(path.join(__dirname, '/views/addImage.html'));
  res.render('addImage');
});

//// setup a 'route' to listen on /employees
app.get('/employees', (req, res) => {
  if (req.query.status) {
    dataService
      .getEmployeesByStatus(req.query.status)
      .then((data) => {
        res.render('employees', { employees: data });
      })
      .catch((err) => {
        res.render('employees', { message: err });
      });
  } else if (req.query.department) {
    dataService
      .getEmployeesByDepartment(req.query.department)
      .then((data) => {
        res.render('employees', { employees: data });
      })
      .catch((err) => {
        res.render('employees', { message: err });
      });
  } else if (req.query.manager) {
    dataService
      .getEmployeesByManager(req.query.manager)
      .then((data) => {
        res.render('employees', { employees: data });
      })
      .catch((err) => {
        res.render('employees', { message: err });
      });
  } else {
    dataService
      .getAllEmployees()
      .then((data) => {
        res.render('employees', { employees: data });
      })
      .catch((err) => {
        res.render('employees', { message: err });
      });
  }
});

app.get('/employee/:empNum', (req, res) => {
  // initialize an empty object to store the values
  let viewData = {};

  dataService
    .getEmployeeByNum(req.params.empNum)
    .then((data) => {
      if (data) {
        viewData.employee = data; //store employee data in the "viewData" object as "employee"
      } else {
        viewData.employee = null; // set employee to null if none were returned
      }
    })
    .catch(() => {
      viewData.employee = null; // set employee to null if there was an error
    })
    .then(dataService.getDepartments)
    .then((data) => {
      viewData.departments = data; // store department data in the "viewData" object as "departments"

      // loop through viewData.departments and once we have found the departmentId that matches
      // the employee's "department" value, add a "selected" property to the matching
      // viewData.departments object

      for (let i = 0; i < viewData.departments.length; i++) {
        if (
          viewData.departments[i].departmentId == viewData.employee.department
        ) {
          viewData.departments[i].selected = true;
        }
      }
    })
    .catch(() => {
      viewData.departments = []; // set departments to empty if there was an error
    })
    .then(() => {
      if (viewData.employee == null) {
        // if no employee - return an error
        res.status(404).send('Employee Not Found');
      } else {
        res.render('employee', { viewData: viewData }); // render the "employee" view
      }
    });
});

app.get('/employees/delete/:empNum', (req, res) => {
  dataService
    .deleteEmployeeByNum(req.params.empNum)
    .then(() => res.redirect('/employees'))
    .catch(() => {
      res.status(500).render('employee', {
        message: '500: Unable to Remove Employee / Employee not found',
      });
    });
});

app.get('/department/:departmentId', (req, res) => {
  dataService
    .getDepartmentById(req.params.departmentId)
    .then((value) => {
      res.render('department', { department: value });
    })
    .catch((err) => {
      res
        .status(404)
        .render('department', { message: '404: Department Not Found' });
    });
});

app.get('/departments/delete/:departmentId', (req, res) => {
  dataService
    .deleteDepartmentById(req.params.departmentId)
    .then(res.redirect('/departments'))
    .catch((err) => {
      res.status(500).render('department', {
        message: 'Unable to Remove Department / Department not found)',
      });
    });
});

//// setup a 'route' to listen on /managers
app.get('/managers', (req, res) => {
  dataService
    .getManagers()
    .then((data) => {
      res.render('managers', { managers: data });
    })
    .catch((err) => {
      res.render('managers', { message: err });
    });
});

//// setup a 'route' to listen on /departments
app.get('/departments', (req, res) => {
  dataService
    .getDepartments()
    .then((data) => {
      res.render('departments', { departments: data });
    })
    .catch((err) => {
      res.render('departments', { message: err });
    });
});

app.get('/departments/add', function (req, res) {
  res.render('addDepartment');
});

app.get('/images', (req, res) => {
  fs.readdir('./public/images/uploaded', (err, items) => {
    res.render('images', { image: items });
  });
});

app.post('/images/add', upload.single('imageFile'), (req, res) => {
  res.redirect('/images');
});

app.post('/employees/add', (req, res) => {
  dataService
    .addEmployee(req.body)
    .then(res.redirect('/employees'))
    .catch((err) => {
      res
        .status(500)
        .render('employee', { message: '500: Unable to add the employee' });
    });
});

app.post('/employee/update', (req, res) => {
  dataService
    .updateEmployee(req.body)
    .then(res.redirect('/employees'))
    .catch((err) => {
      res
        .status(500)
        .render('employee', { message: '500: Unable to update the employee' });
    });
});

app.post('/departments/add', (req, res) => {
  dataService
    .addDepartment(req.body)
    .then(res.redirect('/departments'))
    .catch((err) => {
      res.status(500).render('departments', {
        message: '500: Unable to add the department',
      });
    });
});

app.post('/department/update', (req, res) => {
  dataService
    .updateDepartment(req.body)
    .then(res.redirect('/departments'))
    .catch((err) => {
      res.status(500).render('departments', {
        message: '500: Unable to update the department',
      });
    });
});

//////////////////////////////////////////////////////////////////////////////
/////// Extra Feature: Middleware to add, update, and delete a manager ///////
app.get('/managers/add', function (req, res) {
  res.render('addManager');
});

app.post('/managers/add', (req, res) => {
  dataService
    .addManager(req.body)
    .then(res.redirect('/managers'))
    .catch((err) => {
      res.status(500).render('managers', {
        message: '500: Unable to add the manager',
      });
    });
});

app.post('/manager/update', (req, res) => {
  dataService
    .updateManager(req.body)
    .then(res.redirect('/manager'))
    .catch((err) => {
      res.status(500).render('managers', {
        message: '500: Unable to update the manager',
      });
    });
});

app.get('/managers/delete/:empNum', (req, res) => {
  dataService
    .deleteManagerByNum(req.params.empNum)
    .then(() => res.redirect('/managers'))
    .catch(() => {
      res.status(500).render('managers', {
        message: '500: Unable to Remove Manager / Manager not found',
      });
    });
});
//////////////////////////////////////////////////////////////////////////////

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
