App = Ember.Application.create({ LOG_TRANSITIONS: true});

App.Router.map(function() {
  this.route("index", { path: "/" });
  this.route("about", { path: "/about" });


  
  this.resource("locations", function(){
      console.log("Inside locations....");
      this.route("new", {path:"/new"});
      this.route("edit", {path: "/:location_id" });
  });

  // this.route("locations", {path:"/locations"});
  // this.route("locations.edit", {path: "/locations/:location_id" });

});

App.ApplicationController = Ember.Controller.extend({
  
  // some property of our controller.
  globalString: 'this is the application string',

});

App.Adapter = DS.RESTAdapter.extend({
  serializer: DS.RESTSerializer.extend({
    primaryKey: function (type){
      return '_id';
   }
  })
});

App.Store = DS.Store.extend({
  revision: 12,
  adapter: 'App.Adapter'
});

DS.RESTAdapter.reopen({
  url: 'http://localhost:3000'
});


App.Location = DS.Model.extend({
    latitude: DS.attr('string'),
    longitude: DS.attr('string'),
    accuracy: DS.attr('string')

});



App.LocationsIndexRoute = Ember.Route.extend({
  
  // model: function() {
  // 	console.log("returning locations");
  //   return App.Location.find();
  // },

  setupController: function(controller) {
    // Set the IndexController's `title`
    controller.set('content', App.Location.find());
  }  ,

// setupController: function(controller) {
//     console.log("Returning locations from route...");
//     controller.set('content', App.Location.find());
//   }
  

  renderTemplate: function() {
    console.log("Rendering locationsRouteTemplate");
    this.render('locations.index',{into:'application'});
  }

});

App.LocationsEditRoute = Ember.Route.extend({

  renderTemplate: function() {
    console.log("Rendering template...");
    this.render('locations.edit',{into:'application'});
  }

});

App.LocationsNewRoute = Ember.Route.extend({
  model: function() {
    return App.Location.createRecord();
  }
});


App.LocationsNewController = Ember.ObjectController.extend({
  addItem: function(location) {
    //this.get("store").commit();
    //this.get("target").transitionTo("locations");
    location.transaction.commit();
    this.get("target").transitionTo("locations");
  },

  isNewObject: function() {
  	console.log("inside isNewObject");
  	return true;
  }.property(),

  dataFromController: function() {
  	return "dataFromControllerValue";
  }.property()

});




