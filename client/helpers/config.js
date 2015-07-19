/* Behind the scenes, the `accounts` package does `auto-publish` the currently
 * logged in user's basic account details no matter what (otherwise the user
 * could never log in in the first place).
 * The `accounts` package only publishes the current user though. So the
 * publication is only publishing one user object per logged-in user (and none
 * when you are not logged in).
 * Compare the differences in the browser: Meteor.users.find().count(); and
 * in Mongo: db.users.count();
 */
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY'
});