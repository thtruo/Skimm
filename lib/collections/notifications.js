/* Just like posts or comments, this `Notifications` collection will be shared
 * client and server side. As we need to update notifications once a user has
 * seen them, we also enable updates, ensuring as usual that we restrict update
 * permissions to a user's own data
 */
Notifications = new Mongo.Collection('notifications');

/* Restrict updates to the user's own data when updating notifications once
 * an owner has seem them
 */
Notifications.allow({
  update: function(userId, doc, fieldNames) {
    return ownsDocument(userId, doc) && fieldNames.length === 1 &&
      fieldNames[0] === 'read';
  }
});

/* Looks at a post that the user is commenting on, discovers who should be
 * notified from there, and inserts a new matching notification
 */
createCommentNotification = function(comment) {
  var post = Posts.findOne(comment.postId);
  if (comment.userId !== post.userId) {
    Notifications.insert({
      userId: post.userId,
      postId: post._id,
      commentId: comment._id,
      commenterName: comment.author,
      read: false
    });
  }
};