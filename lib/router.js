Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() {
    return [Meteor.subscribe('notifications')];
  }
});

/* `data` gets the proper data context for the post based on `_id`
 * `this` corresponds to the currently matched route
 * `this.params` accesses the named parts of the route based on `:` prefix
 */
Router.route('/posts/:_id', {
  name: 'postPage',

  // restrict our data set to comments belonging to the current post
  waitOn: function() {
    return [
      Meteor.subscribe('singlePost', this.params._id),
      Meteor.subscribe('comments', this.params._id)
    ];
  },
  data: function() {
    return Posts.findOne(this.params._id);
  }
});

/* Define a route for accessing the edit posts page and set its data context
 */
Router.route('/posts/:_id/edit', {
  name: 'postEdit',
  waitOn: function() {
    return Meteor.subscribe('singlePost', this.params._id);
  },
  data: function() {
    return Posts.findOne(this.params._id);
  }
});

/* Define a route for accessing the submit new posts page
 */
Router.route('/submit', {
  name: 'postSubmit'
});

/* Define the route controller for the postsList route and generalize it for
 * extension with the newPosts and bestPosts routes (to achieve post rankings)
 */
PostsListController = RouteController.extend({
  template: 'postsList',
  increment: 5,
  postsLimit: function() {
    return parseInt(this.params.postsLimit) || this.increment;
  },
  findOptions: function() {
    return {sort: this.sort, limit: this.postsLimit()};
  },
  subscriptions: function() {
    this.postsSub = Meteor.subscribe('posts', this.findOptions());
  },
  posts: function() {
    return Posts.find({}, this.findOptions());
  },
  data: function() {
    var hasMore = this.posts().count() === this.postsLimit();
    return {
      posts: this.posts(),
      ready: this.postsSub.ready,
      nextPath: hasMore ? this.nextPath() : null
    };
  }
});

/* Route Controller for the `home` and `newPosts` routes
 */
NewPostsController = PostsListController.extend({
  sort: {submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.newPosts.path({postsLimit: this.postsLimit() + this.increment});
  }
});

/* Route Controller for the `bestPosts`route
 */
BestPostsController = PostsListController.extend({
  sort: {votes: -1, submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.bestPosts.path({postsLimit: this.postsLimit() + this.increment});
  }
});

Router.route('/', {
  name: 'home',
  controller: NewPostsController
});

Router.route('/new/:postsLimit?', {name: 'newPosts'});
Router.route('/best/:postsLimit?', {name: 'bestPosts'});

 /* Define a route hook to intercept the `/submit/ route.
  * Check if the user is logged in, and if they're not render `accessDenied`
  */
var requireLogin = function() {
  if (! Meteor.user()) {
    // Display loadingTemplate when waiting to see if the user has access or not
    if (Meteor.loggingIn()) {
      this.render('this.loadingTemplate');
    } else {
      this.render('accessDenied');
    };
  } else {
    this.next();
  }
}

/* Add a special `dataNotFound` hook to tell Iron Router to show the "not found"
 * page not just for invalid routes but also for the `postPage` route, whenever
 * the `data` function returns a "falsy" object.
 */
Router.onBeforeAction('dataNotFound', {
  only: 'postPage'
});

Router.onBeforeAction(requireLogin, {
  only: 'postSubmit'
});