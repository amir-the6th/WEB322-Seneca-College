const Sequelize = require('sequelize');

// set up sequelize to point to our postgres database
var sequelize = new Sequelize(
  'd59ngr6842m6fg',
  'otnflwyiosqbrq',
  '918c29fcd072ef5b54664020682caf4f1dc1beebb588a26c1021aebf2de32de8',
  {
    host: 'ec2-52-7-115-250.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
  }
);

// Define our "Employee" and "Department" models

var Employee = sequelize.define('Employee', {
  employeeNum: {
    type: Sequelize.INTEGER,
    primaryKey: true, // use "employeeNum" as a primary key
    autoIncrement: true, // automatically increment the value
  },
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: Sequelize.STRING,
  SSN: Sequelize.STRING,
  addressStreet: Sequelize.STRING,
  addressCity: Sequelize.STRING,
  addressState: Sequelize.STRING,
  addressPostal: Sequelize.STRING,
  maritalStatus: Sequelize.STRING,
  isManager: Sequelize.BOOLEAN,
  employeeManagerNum: Sequelize.INTEGER,
  status: Sequelize.STRING,
  hireDate: Sequelize.STRING,
});

var Department = sequelize.define('Department', {
  departmentId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  departmentName: Sequelize.STRING,
});

// Associate Department with Employee
Department.hasMany(Employee, { foreignKey: 'department' });

sequelize.sync().then(function () {
  // Create user "Jason Bourne"
  User.create({
    fullName: 'Jason Bourne',
    title: 'developer',
  }).then(function (user) {
    console.log('user created');

    // Create "Task 1" for the new user
    Task.create({
      title: 'Task 1',
      description: 'Task 1 description',
      UserId: user.id, // set the correct Userid foreign key
    }).then(function () {
      console.log('Task 1 created');
    });

    // Create "Task 2" for the new user
    Task.create({
      title: 'Task 2',
      description: 'Task 2 description',
      UserId: user.id, // set the correct Userid foreign key
    }).then(function () {
      console.log('Task 2 created');
    });
  });
});

const fs = require('fs');
const { resolve } = require('path');
const { DOUBLE } = require('sequelize');
let employees = [];
let departments = [];

module.exports = {
  initialize: function () {
    return new Promise((resolve, reject) => {
      fs.readFile('./data/employees.json', (err, data) => {
        if (err) {
          reject(err);
        }
        employees = JSON.parse(data);
        resolve();
      });
      fs.readFile('./data/departments.json', (err, data) => {
        if (err) {
          reject(err);
        }
        departments = JSON.parse(data);
        resolve();
      });
    });
  },

  getAllEmployees: function () {
    return new Promise((resolve, reject) => {
      if (employees.length == 0) {
        reject('No Employee Found!');
      }
      resolve(employees);
    });
  },

  getManagers: function () {
    return new Promise((resolve, reject) => {
      var managers = [];
      for (let i = 0; i < employees.length; i++) {
        if (employees[i].isManager == true) {
          managers.push(employees[i]);
        }
      }
      if (managers.length == 0) {
        reject('No Managers Found!');
      }
      resolve(managers);
    });
  },

  getDepartments: function () {
    return new Promise((resolve, reject) => {
      if (departments.length == 0) {
        reject('No Department Found!');
      }
      resolve(departments);
    });
  },

  addEmployee: function (employeeData) {
    return new Promise((resolve, reject) => {
      if (employeeData.isManager == undefined) employeeData.isManager = false;
      else employeeData.isManager = true;
      employeeData.employeeNum = employees.length + 1;
      employees.push(employeeData);
      resolve(
        `Employee #${employeeData.employeeNum} has been added successfully!`
      );
    });
  },

  updateEmployee: function (employeeData) {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < employees.length; i++) {
        if (employeeData.employeeNum == employees[i].employeeNum) {
          // let info = Object.info(employees[i]);
          // for (let j = 0; j < info.length; j++)
          //   employees[i][info[j]] = empData[info[j]];
          employees[i].firstName = employeeData.firstName;
          employees[i].lastName = employeeData.lastName;
          employees[i].email = employeeData.email;
          employees[i].addressStreet = employeeData.addressStreet;
          employees[i].addressCity = employeeData.addressCity;
          employees[i].addressState = employeeData.addressState;
          employees[i].addressPostal = employeeData.addressPostal;
          employees[i].isManager = employeeData.isManager;
          employees[i].employeeManagerNum = employeeData.employeeManagerNum;
          employees[i].status = employeeData.status;
          employees[i].department = employeeData.department;
          employees[i].hireDate = employeeData.hireDate;
          resolve();
        }
      }
    });
  },

  getEmployeesByStatus: function (status) {
    return new Promise((resolve, reject) => {
      var empByStatus = [];
      empByStatus = employees.filter((employee) => {
        return employee.status == status;
      });
      if (empByStatus.length == 0) reject('No Employee by this status found!');
      else resolve(empByStatus);
    });
  },

  getEmployeesByDepartment: function (department) {
    return new Promise((resolve, reject) => {
      var empByDepartment = [];
      empByDepartment = employees.filter((employee) => {
        return employee.department == department;
      });
      if (empByDepartment.length == 0)
        reject('No Employee by this department found!');
      else resolve(empByDepartment);
    });
  },

  getEmployeesByManager: function (manager) {
    return new Promise((resolve, reject) => {
      var empByManager = [];
      empByManager = employees.filter((employee) => {
        return employee.employeeManagerNum == manager;
      });
      if (empByManager.length == 0)
        reject('No Employee managed this manager found!');
      else resolve(empByManager);
    });
  },

  getEmployeeByNum: function (num) {
    return new Promise((resolve, reject) => {
      var findEmp = employees.filter((employee) => {
        return employee.employeeNum == num;
      });
      if (findEmp.length == 0) reject('No Employee by this id found!');
      else resolve(findEmp);
    });
  },

  getEmployeesByStatus: function (status) {
    return new Promise((resolve, reject) => {});
  },
}; //end of module.exports
