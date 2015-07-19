/* Define a `posts` server collection. Doing so implicitly defines three
 * Meteor Methods (see below): `posts/insert`, `posts/update`, `posts/delete`.
 */
Posts = new Mongo.Collection('posts');

/* After issuing `meteor remove insecure` client-side inserts into the `posts`
 * collection are no longer allowed. This is baked in data security.
 *
 * Since we edit and delete posts from the client, we need the `allow()` block.
 */
Posts.allow({
  update: function(userId, post) {
    return ownsDocument(userId, post);
  },
  remove: function(userId, post) {
    return ownsDocument(userId, post);
  }
});

/* Limit edits using the `deny()` block.
 */
Posts.deny({
  update: function(userId, post, fieldNames) {
    // May only edit the following two fields:
    return (_.without(fieldNames, 'url', 'title').length > 0);
  }
});

/* Server-side validation of editing a post.
 */
Posts.deny({
  update: function(userId, post, fieldNames, modifier) {
    var errors = validatePost(modifier.$set);
    return errors.title || errors.url;
  }
});

/* A Meteor method is a server-side function that is called from the client.
 *
 * Add security to the method by using the `audit-argument-checks` package.
 * This checks any JS object against a predefined pattern, namely that the
 * user is properly logged in and the passed `postAttributes` object contains
 * `title` and `url` strings.
 */
Meteor.methods({
  /* Rather than inserting directly into the `Posts` collection, call a method
   * called `postInsert`. Here we allow client-side inserts to get our
   * submit form working again.
   */
  postInsert: function(postAttributes) {
    check(Meteor.userId(), String);
    check(postAttributes, {
      title: String,
      url: String
    });

    // Server side validation.
    // Error message will only show up if someone bypasses the UI using console
    var errors = validatePost(postAttributes);
    if (errors.title || errors.url) {
      throw new Meteor.Error('invalid-post','You must set a title and URL for your post');
    };

    // Check for duplicate links
    var postWithSameLink = Posts.findOne({url: postAttributes.url});
    if (postWithSameLink) {
      return {
        postExists: true,
        _id: postWithSameLink._id
      };
    }

    var user = Meteor.user();
    var post = _.extend(postAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date(),
      commentsCount: 0,
      upvoters: [],
      votes: 0
    });

    var postId = Posts.insert(post);

    return {_id: postId};
  },

  /* Upvote posts */
  upvote: function(postId) {
    check(this.userId, String);
    check(postId, String);

    // improved call to Mongo - eliminate race condition from calling twice
    // find posts with id that user hasn't voted for yet and upvote post with id
    var affected = Posts.update({
      _id: postId,
      upvoters: {$ne: this.userId}
    }, {
      $addToSet: {upvoters: this.userId},
      $inc: {votes: 1}
    });

    if (!affected) {
      throw new Meteor.Error('invalid', 'You weren\'t able to upvote that post');
    };
  }
});

/* Post validation
 */
validatePost = function(post) {
  var errors = {};

  if (!post.title) {
    errors.title = "Please fill in a headline";
  }

  if (!post.url) {
    errors.url = "Please fill in a URL";
  }

  return errors;
}