// Copyright IBM Corp. 2016. All Rights Reserved.
// Node module: loopback-workspace
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';

var app = require('../server');
var User = app.models.User;
var config = require('../../server/config');
var database;

//get database
User.getDataSource().connector.connect((err, db) => {
  if (err) throw ("couldn't connect to db : ", err);
  console.log(`connected to db < ${db.s.namespace.db} >`);
  database = db;
});

//helpers
const getOrderCredit = (query) => {
  return new Promise((resolve, reject) => {
    database.collection('order').aggregate([
      {
        $match: query
      },
      {
        $group: {
          _id: null,
          credit: { $sum: '$total' }
        }
      }
    ]).toArray((err, data) => {
      if (err)
        reject(err);
      else
        resolve(data.length ? data[0].credit : 0);
    });
  });
}


module.exports = function (server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();

  //password reset request
  router.post('/api/reset-password-request', (req, res, next) => {
    User.resetPassword({
      email: req.body.email
    }, (err) => {
      if (err) {
        let err = new Error('email not found');
        err.statusCode = 404;
        return next(err);
      }

      User.on('resetPasswordRequest', (info) => {
        let url = 'http://' + config.domain + ':' + config.port + '/api/reset-password?access_token='
          + info.accessToken.id;
        let html = `dear customer , please visit this <a href='${url}'>link</a> to reset your password`;
        User.app.models.Email.send({
          to: info.email,
          from: config.emailAddress,
          subject: 'password reset',
          html: html
        }, (err) => {
          if (err) {
            let error = new Error('send email error >> ' + err);
            return next(error);
          }
          res.status(200).json({ success: true, message: 'reset email sent' });

        })
      })



    })
  })

  //reset password page
  app.get('/api/reset-password', function (req, res, next) {
    if (!req.accessToken) return res.sendStatus(401);
    res.render('reset-password', {
      redirectURL: '/api/users/reset-password?access_token=' +
        req.accessToken.id
    });
  });

  // statistics
  router.get('/api/stats/orders-count', async (req, res, next) => {
    try {
      let counters = {
        completedOrders: await database.collection('order').countDocuments({ status: 'completed' }),
        waitingOrders: await database.collection('order').countDocuments({ status: 'waiting' }),
        cancelledOrders: await database.collection('order').countDocuments({ status: 'cancelled' }),
      }
      res.json(counters);
    } catch (error) {
      next(error);
    }
  });


  router.get('/api/stats/orders-credit', async (req, res, next) => {
    try {
      let credit = {
        inCredit: await getOrderCredit({ status: 'completed' }),
        outCredit: await getOrderCredit({ status: 'confirmed' })
      }
      res.json(credit);
    } catch (error) {
      next(error);
    }
  });



  server.use(router);
};
