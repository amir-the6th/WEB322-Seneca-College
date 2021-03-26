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

module.exports = {
  initialize: function () {
    return new Promise((resolve, reject) => {
      reject();
    });
  },

  getAllEmployees: function () {
    return new Promise((resolve, reject) => {
      reject();
    });
  },

  getManagers: function () {
    return new Promise((resolve, reject) => {
      reject();
    });
  },

  getDepartments: function () {
    return new Promise((resolve, reject) => {
      reject();
    });
  },

  addEmployee: function (employeeData) {
    return new Promise((resolve, reject) => {
      reject();
    });
  },

  updateEmployee: function (employeeData) {
    return new Promise((resolve, reject) => {
      reject();
    });
  },

  getEmployeesByStatus: function (status) {
    return new Promise((resolve, reject) => {
      reject();
    });
  },

  getEmployeesByDepartment: function (department) {
    return new Promise((resolve, reject) => {
      reject();
    });
  },

  getEmployeesByManager: function (manager) {
    return new Promise((resolve, reject) => {
      reject();
    });
  },

  getEmployeeByNum: function (num) {
    return new Promise((resolve, reject) => {
      reject();
    });
  },

  getEmployeesByStatus: function (status) {
    return new Promise((resolve, reject) => {
      reject();
    });
  },
}; //end of module.exports
