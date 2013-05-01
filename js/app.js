App = Ember.Application.create({ LOG_TRANSITIONS: true});

App.Router.map(function() {
  this.route("index", { path: "/" });
  this.route("about", { path: "/about" });
  this.route("locations", { path: "/locations" });
});

App.ApplicationController = Ember.Controller.extend({
  
  // some property of our controller.
  globalString: 'this is the application string',

});

App.Store = DS.Store.extend({
  revision: 12
});

App.Location = DS.Model.extend({
    latitude: DS.attr('string'),
    longitude: DS.attr('string'),
    accuracy: DS.attr('string')

});

App.LocationsRoute = Ember.Route.extend({
  
  model: function() {
    return App.Location.find();
  }
  
});



