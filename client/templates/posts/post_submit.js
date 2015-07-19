Template.postSubmit.onCreated(function() {
  Session.set('postSubmitErrors', {});
});

Template.postSubmit.helpers({
  errorMessage: function(field) {
    // return the error message
    return Session.get('postSubmitErrors')[field];
  },
  errorClass: function(field) {
    // check for presence of a message and return `has-error` if one exists
    return !!Session.get('postSubmitErrors')[field] ? 'has-error' : '';
  }
});

/* Bind an event handler to the form `submit` event
 */
Template.postSubmit.events({
  'submit form': function(e) {
    e.preventDefault();

    var post = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val()
    };

    var errors = validatePost(post);
    if (errors.title || errors.url) {
      return Session.set('postSubmitErrors', errors);
    };

    // Call server-side Meteor method `postInsert` from the client
    Meteor.call('postInsert', post, function(error, result) {
      // display error to the user and abort
      if (error) {
        return throwError(error.reason);
      }

      // show this result but route anyway
      if (result.postExists) {
        throwError('This link has already been posted!');
      }
      Router.go('postPage', {_id: result._id});
    });
  }
});