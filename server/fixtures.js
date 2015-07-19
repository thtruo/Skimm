if (Posts.find().count() === 0) {
  var now = new Date().getTime();

  // create two users
  var tomId = Meteor.users.insert({
    profile: {name: 'Thomas Truongchau'}
  });
  var tom = Meteor.users.findOne(tomId);

  var sachaId = Meteor.users.insert({
    profile: {name: 'Sacha Greif'}
  });
  var sacha = Meteor.users.findOne(sachaId);

  var telescopeId = Posts.insert({
    title: 'Introducing Telescope',
    userId: sacha._id,
    author: sacha.profile.name,
    url: 'http://sachagreif.com/introducing-telescope/',
    submitted: new Date(now - 7 * 3600 * 1000),
    commentsCount: 2
  });

  Comments.insert({
    postId: telescopeId,
    userId: tom._id,
    author: tom.profile.name,
    submitted: new Date(now - 5 * 3600 * 1000),
    body: 'Interesting project Sacha, can I get involved?'
  });

  Comments.insert({
    postId: telescopeId,
    userId: sacha._id,
    author: sacha.profile.name,
    submitted: new Date(now - 3 * 3600 * 1000),
    body: 'You sure can Tom!'
  });

  Posts.insert({
    title: 'Meteor',
    userId: tom._id,
    author: tom.profile.name,
    url: 'http://meteor.com',
    submitted: new Date(now - 10 * 3600 * 1000),
    commentsCount: 0
  });
  Posts.insert({
    title: 'The Meteor Book',
    userId: tom._id,
    author: tom.profile.name,
    url: 'http://themeteorbook.com',
    submitted: new Date(now - 12 * 3600 * 1000),
    commentsCount: 0
  });
  Posts.insert({
    title:'Architectural Notes on Meteor',
    userId: tom._id,
    author: tom.profile.name,
    url:'https://gist.github.com/debergalis/bf76084cdb1434d8733d',
    submitted: new Date(now - 13 * 3600 * 1000),
    commentsCount: 0
  });
  Posts.insert({
    title:'Javascript the Right Way',
    url:'http://jstherightway.org/',
    userId: tom._id,
    author: tom.profile.name,
    submitted: new Date(now - 14 * 3600 * 1000),
    commentsCount: 0
  });
  Posts.insert({
    title:'Why I Invest in Tools',
    url:'https://medium.com/@leeb/why-invest-in-tools-3240ce289930',
    userId: tom._id,
    author: tom.profile.name,
    submitted: new Date(now - 15 * 3600 * 1000),
    commentsCount: 0
  });
  for (var i = 0; i <= 20; i++) {
    Posts.insert({
      title:'Test Post No.' + i,
      userId: tom._id,
      author: tom.profile.name,
      url:'http://www.bing.com/?q=test-' + i,
      submitted: new Date(now - (50 + i) * 3600 * 1000),
      commentsCount: 0
    });
  };
}