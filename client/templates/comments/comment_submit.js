Template.commentSubmit.onCreated(function() {
  Session.set('commentSubmitErrors', {});
});

Template.commentSubmit.helpers({
  errorMessage: function(field) {
    // return the error message
    return Session.get('commentSubmitErrors')[field];
  },
  errorClass: function(field) {
    // check for presence of a message and return `has-error` if one exists
    return !!Session.get('commentSubmitErrors')[field] ? 'has-error' : '';
  }
});

/* Bind an event handler to the form `submit` event for comments
 */
Template.commentSubmit.events({
  'submit form': function(e, template) {
    e.preventDefault();

    var $body = $(e.target).find('[name=commentBody]');

    var comment = {
      body: $body.val(),
      postId: template.data._id
    };

    var errors = {};
    if (!comment.body) {
      errors.body = "Uh oh, please write some content";
      return Session.set('commentSubmitErrors', errors);
    }

    // Call server-side Meteor method `commentInsert` from the client
    Meteor.call('commentInsert', comment, function(error, commentId) {
      // display error to the user and abort
      if (error) {
        throwError(error.reason);
      } else {
        $body.val('');
      }
    });
  }
});