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
var Employee = sequelize.define(
  'Employee',
  {
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
    //maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    hireDate: Sequelize.STRING,
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);

var Department = sequelize.define(
  'Department',
  {
    departmentId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    departmentName: Sequelize.STRING,
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);

// Associate Department with Employee
Department.hasMany(Employee, { foreignKey: 'department' });

module.exports = {
  initialize: function () {
    return new Promise((resolve, reject) => {
      sequelize
        .sync()
        .then((Employee) => {
          resolve();
        })
        .then((Department) => {
          resolve();
        })
        .catch((err) => {
          reject('Unable to sync the database');
        });
    });
  },

  getAllEmployees: function () {
    return new Promise((resolve, reject) => {
      Employee.findAll({ raw: true })
        .then((data) => {
          if (data.length > 0) {
            resolve(data);
          } else reject('No Employees Found!');
        })
        .catch(() => {
          reject('No results returned!');
        });
    });
  },

  getManagers: function () {
    return new Promise((resolve, reject) => {
      Employee.findAll({
        where: {
          isManager: true,
        },
        raw: true,
      })
        .then((data) => {
          if (data.length > 0) {
            resolve(data);
          } else {
            reject('No Employees Found!');
          }
        })
        .catch(() => {
          reject('No results returned!');
        });
    });
  },

  getDepartments: function () {
    return new Promise((resolve, reject) => {
      Department.findAll({ raw: true })
        .then(function (data) {
          if (data.length > 0) {
            resolve(data);
          } else {
            reject('No Departments Found!');
          }
        })
        .catch(() => reject('No results returned!'));
    });
  },

  getEmployeesByStatus: function (e_status) {
    return new Promise((resolve, reject) => {
      Employee.findAll({
        where: {
          status: e_status,
        },
        raw: true,
      })
        .then((data) => {
          if (data.length > 0) {
            resolve(data);
          } else reject('No Employees Found!');
        })
        .catch(() => {
          reject('No results returned!');
        });
    });
  },

  getEmployeesByDepartment: function (e_department) {
    return new Promise((resolve, reject) => {
      Employee.findAll({
        where: {
          department: e_department,
        },
        raw: true,
      })
        .then((data) => {
          if (data.length > 0) {
            resolve(data);
          } else reject('No Employees Found!');
        })
        .catch(() => {
          reject('No results returned!');
        });
    });
  },

  getEmployeesByManager: function (manager) {
    return new Promise((resolve, reject) => {
      Employee.findAll({
        where: {
          employeeManagerNum: manager,
        },
        raw: true,
      })
        .then((data) => {
          if (data.length > 0) {
            resolve(data);
          } else reject('No Employees Found!');
        })
        .catch(() => {
          reject('No results returned!');
        });
    });
  },

  getEmployeeByNum: function (num) {
    return new Promise((resolve, reject) => {
      Employee.findAll({
        where: {
          employeeNum: num,
        },
        raw: true,
      })
        .then((data) => {
          if (data.length > 0) {
            resolve(data);
          } else reject('No Employees Found!');
        })
        .catch(() => {
          reject('No results returned!');
        });
    });
  },

  getDepartmentById: function (id) {
    return new Promise((resolve, reject) => {
      Department.findAll({
        where: {
          departmentName: id,
        },
        raw: true,
      })
        .then((data) => {
          if (data.length > 0) {
            resolve(data);
          } else reject('No Department Found!');
        })
        .catch(() => {
          reject('No results returned!');
        });
    });
  },

  addEmployee: function (employeeData) {
    employeeData.isManager = employeeData.isManager ? true : false;
    for (let field in employeeData) {
      if (employeeData[field] == '') employeeData[field] = null;
    }

    return new Promise((resolve, reject) => {
      Employee.create({
        firstName: employeeData.firstName,
        lastName: employeeData.lastName,
        email: employeeData.email,
        SSN: employeeData.SSN,
        addressStreet: employeeData.addressStreet,
        addressCity: employeeData.addressCity,
        addressState: employeeData.addressState,
        addressPostal: employeeData.addressPostal,
        isManager: employeeData.isManager,
        employeeManagerNum: employeeData.employeeManagerNum,
        status: employeeData.status,
        hireDate: employeeData.hireDate,
        department: employeeData.department,
      })
        .then(() => {
          resolve('New employee added!');
        })
        .catch(() => {
          reject('Unable to add the new employee!');
        });
    });
  },

  updateEmployee: function (employeeData) {
    employeeData.isManager = employeeData.isManager ? true : false;
    for (let field in employeeData) {
      if (employeeData[field] == '') employeeData[field] = null;
    }

    return new Promise((resolve, reject) => {
      Employee.update(
        {
          firstName: employeeData.firstName,
          lastName: employeeData.lastName,
          email: employeeData.email,
          SSN: employeeData.SSN,
          addressStreet: employeeData.addressStreet,
          addressCity: employeeData.addressCity,
          addressState: employeeData.addressState,
          addressPostal: employeeData.addressPostal,
          isManager: employeeData.isManager,
          employeeManagerNum: employeeData.employeeManagerNum,
          status: employeeData.status,
          hireDate: employeeData.hireDate,
          department: employeeData.department,
        },
        {
          where: {
            employeeNum: employeeData.employeeNum,
          },
        }
      )
        .then(() => {
          resolve('Eemployee information has been updated!');
        })
        .catch(() => {
          reject('Unable to update the employee information!');
        });
    });
  },

  addDepartment: function (departmentData) {
    for (let field in departmentData) {
      if (departmentData[field] == '') departmentData[field] = null;
    }

    return new Promise((resolve, reject) => {
      Department.create({
        departmentName: departmentData.departmentName,
      })
        .then(() => {
          resolve('New department added!');
        })
        .catch(() => {
          reject('Unable to add the new department!');
        });
    });
  },

  updateDepartment: function (departmentData) {
    for (let field in departmentData) {
      if (departmentData[field] == '') departmentData[field] = null;
    }

    return new Promise((resolve, reject) => {
      Department.update(
        {
          departmentName: departmentData.departmentName,
        },
        {
          where: {
            departmentId: departmentData.departmentId,
          },
        }
      )
        .then(() => {
          resolve('Department information has been updated!');
        })
        .catch(() => {
          reject('Unable to update the department information!');
        });
    });
  },

  deleteDepartmentById: function (id) {
    return new Promise((resolve, reject) => {
      Department.destroy({
        where: { departmentId: id },
      })
        .then(() => {
          resolve('Department has been deleted!');
        })
        .catch(() => {
          reject('Unable to delete the department!');
        });
    });
  },

  deleteEmployeeByNum: function (empNum) {
    return new Promise((resolve, reject) => {
      Employee.destroy({
        where: { employeeNum: empNum },
      })
        .then(() => {
          resolve('Employee has been deleted!');
        })
        .catch(() => {
          reject('Unable to delete the employee!');
        });
    });
  },
}; //end of module.exports
