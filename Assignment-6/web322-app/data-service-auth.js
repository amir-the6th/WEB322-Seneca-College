var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
  userName: {
    type: String,
    unique: true,
  },
  password: String,
  email: String,
  loginHistory: {
    dateTime: Date,
    userAgent: String,
  },
});

let User; // to be defined on new connection ( in initialize() )

module.exports = {
  initialize: () => {
    return new Promise((resolve, reject) => {
      let db = mongoose.createConnection(
        'mongodb+srv://ass6User:5$B*NSnO8b*H@senecaweb.8po28.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
      );
      db.on('error', (err) => {
        reject(err); // reject the promise with the provided error
      });
      db.once('open', () => {
        User = db.model('users', userSchema);
        resolve();
      });
    });
  },

  registerUser: (userData) => {
    return new Promise((resolve, reject) => {
      if (userData.password != userData.password2) {
        reject('Passwords do not match!');
      } else {
        let newUser = new User(userData);
        newUser
          .save()
          .then(() => {
            resolve();
          })
          .catch((err) => {
            if (err.code == 11000) {
              reject('User Name already taken!');
            } else {
              reject('There was an error creating the user: ' + err);
            }
          });
      }
    });
  },

  checkUser: (userData) => {
    return new Promise((resolve, reject) => {
      User.find({ userName: userData.userName })
        .exec()
        .then((users) => {
          if (!users) {
            reject('Unable to find user: ' + userData.userName);
          } else {
            if (users[0].password !== userData.password) {
              reject('Incorrect Password for user: ' + userData.userName);
            } else {
              users[0].loginHistory.push({
                dateTime: new Date().toString(),
                userAgent: userData.userAgent,
              });
              User.update(
                { userName: users[0].userName },
                { $set: { loginHistory: users[0].loginHistory } }
              )
                .exec()
                .then(() => {
                  resolve(users[0]);
                })
                .catch((err) => {
                  reject('There was an error verifying the user: ' + err);
                });
            }
          }
        })
        .catch(() => {
          reject('Unable to find user: ' + userData.userName);
        });
    });
  },
};
