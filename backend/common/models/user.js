'use strict';


module.exports = function(User) {

   //render UI page after password reset
  User.afterRemote('setPassword', function(context, user, next) {
    context.res.render('response', {
      title: 'Password reset success',
      content: 'Your password has been reset successfully',
    });
  });

};
