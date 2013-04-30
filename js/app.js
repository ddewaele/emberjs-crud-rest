App = Ember.Application.create({ LOG_TRANSITIONS: true});

App.Router.map(function() {
  this.route("index", { path: "/" });
  this.route("about", { path: "/about" });
});

App.ApplicationController = Ember.Controller.extend({
  
  // some property of our controller.
  globalString: 'this is the application string',


  model: function() {
    console.log(" -- Inside App.ApplicationController");
  },

  query: function() {
    // the current value of the text field
    var query = this.get('search');
    this.transitionToRoute('search', { query: query });
  }
});


App.IndexController = Ember.Controller.extend({

  helloString: 'this is the index string',

  model: function() {
    console.log(" -- Inside App.IndexController");
  },
  activate: function() {
    console.log("activate");
  },

  deactivate: function() {
    console.log("deactivate");
  }  

});

App.AboutController = Ember.Controller.extend({

  helloString: 'this is the about string',

  model: function() {
    console.log(" -- Inside App.AboutController");
  },
  activate: function() {
    console.log("activate");
  },

  deactivate: function() {
    console.log("deactivate");
  }  

});