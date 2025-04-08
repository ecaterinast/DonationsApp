'use strict';
var config = require('../../server/config');
var fcmNode = require('fcm-node');

module.exports = function (Order) {

    // setup order code
    Order.observe('before save', function (ctx, next) {

        var app = ctx.Model.app;

        //Apply this hooks for save operation only..
        if(ctx.isNewInstance){
            var mongoConnector = app.dataSources.market.connector;
            mongoConnector.collection("counters").findAndModify({collection: 'orders'}, [['_id','asc']], {$inc: { value: 1 }}, {new: true}, function(err, sequence) {
                if(err) {
                    throw err;
                } else {
                    ctx.instance.code = sequence.value.value;
                    next();

                } 
            });
        } 
        else{
            next(); 
        }
    });
    //push notification if new order
    Order.observe('after save', function (cxt, next) {
        let newOrder = cxt.instance;
        if (newOrder.status == 'waiting') {
            let app = Order.app;

            //socket
            if (app.socket) {
                app.socket.emit(`orders` , {});                
            }

            //push notiication
            let fcm = new fcmNode(config.serverKey);
            let message = {
                "to": `/topics/orders`,
                "notification": {
                    "title": "طلب جديد",
                    "body": "الرجاء التأكد من الطلب",
                    "click_action": "FCM_PLUGIN_ACTIVITY",
                    "icon": "fcm_push_icon",
                    "sound": "default",
                }
            }
            fcm.send(message, (err, res) => {
                if ( err)  return console.log('could not push notification >>' + err);                
                
            });

        }
        return next();

    })

};
