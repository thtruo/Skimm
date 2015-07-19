Template.postsList.onRendered(function() {

  // _uihooks replace Meteor's default behavior
  this.find('.wrapper')._uihooks = {

    // define hook whenever a new post is inserted
    insertElement: function(node, next) {
      $(node)
        .hide()
        .insertBefore(next)
        .fadeIn();
    },

    // define hook whenever a post's position changes
    moveElement: function(node, next) {
      var $node = $(node), $next = $(next);
      var oldTop = $node.offset().top;
      var height = $node.outerHeight(true);

      // find all the elements between next and node
      var $inbetween = $next.nextUntil(node);
      if ($inbetween.length === 0) {
        $inbetween = $node.nextUntil(next);
      };

      // now put node in place
      $node.insertBefore(next);

      // measure new top
      var newTop = $node.offset().top;

      // move node *back* to where it was before
      $node
        .removeClass('animate')
        .css('top', oldTop - newTop);

      // push every other element down (or up) to put them back
      $inbetween
        .removeClass('animate')
        .css('top', oldTop < newTop ? height : -1 * height);

      // force a redraw
      $node.offset();

      // reset everything to 0, animated
      $node.addClass('animate').css('top', 0);
      $inbetween.addClass('animate').css('top', 0);
    },

    // define hook whenever a post is deleted
    insertElement: function(node, next) {
      $(node).fadeOut(function() {
        $(this).remove();
      });
    }
  };
});