Template.errors.helpers({
  errors: function() {
    return Errors.find();
  }
});

/* `onRendered` callback triggers once the `error` template has rendered in the
 * browser. `this` refers to the current `error` template and `this.data` gives
 * access to the data of the object currently being rendered, an error.
 */
Template.error.onRendered(function() {
  var error = this.data;

  // Clear errors after 3 seconds
  Meteor.setTimeout(function() {
    Errors.remove(error._id);
  }, 3000);
});