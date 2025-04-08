var config = require('../../server/config');


module.exports = (app) => {

   // create admin user
    const User = app.models.User;
    const Role = app.models.Role;
    const RoleMapping = app.models.RoleMapping;

    User.find({ email: config.adminEmail }, (err, admins) => {
        if (err) throw err;
        if (admins.length == 0) {
            //create admin
            User.create([
                { 'email': config.adminEmail, 'password': config.adminPassword }
            ], function (err, users) {
                if (err) throw ('%j', err);
                console.log('admin created');
                Role.create({
                    name: 'admin'
                }, function (err, role) {
                    if (err) throw err;
                    console.log('role created');
                    // Make admin
                    role.principals.create({
                        principalType: RoleMapping.USER,
                        principalId: users[0].id
                    }, function (err, principal) {
                        if (err) throw err;
                        console.log('role assigned successfully');
                    });
                });
            });
        }
    })


      // create order counter 
      const Counters = app.models.Counters;
      Counters.find({ collection: 'orders' }, (err, counters) => {
          if (err) throw err;
          if (counters.length == 0) {
              //create admin
              Counters.create(
                  { collection: 'orders', value : 0 }
                  , function (err, value) {
                  if (err) throw ('%counters', err);
                  console.log('counters created');
                 
              });
          }
      })


};
