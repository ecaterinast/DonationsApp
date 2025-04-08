'use strict';

var app = require('../../server/server');
var config = require('../../server/config');
var fcmNode = require('fcm-node');


module.exports = function (Notifications) {

  /**
   * push notifications
   * @param {string} to topic or decice token
   * @param {string} title notification title
   * @param {string} body notification body
   * @param {Function(Error, object)} callback
   */

  Notifications.send = function (to, title, body, callback) {
    app.fcm = new fcmNode(config.serverKey);

    var message = {
      "to": "/topics/" + to,
      "notification": {
        "title": title,
        "body": body,
        "click_action": "FCM_PLUGIN_ACTIVITY",
        "icon": "fcm_push_icon",
        "sound" : "default"
      },
    }


    app.fcm.send(message, callback)

  };


};
