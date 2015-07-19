Template.header.helpers({
  activeRouteClass: function(/* route names */) {
    var args = Array.prototype.slice.call(arguments, 0);
    args.pop();

    // if any routes matches curr path return true
    var active = _.some(args, function(name) {
      // false && someString returns false
      // true && someString returns someString
      return Router.current() && Router.current().route.getName() === name;
    });

    return active && 'active';
  }
});