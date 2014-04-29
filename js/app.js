App = Ember.Application.create({ LOG_TRANSITIONS: true});

App.Router.map(function() {
  this.route("index", { path: "/" });
  this.route("about", { path: "/about" });
  
  this.resource("locations", function(){
      console.log("Inside locations....");
      this.route("new", {path:"/new"});
      this.route("edit", {path: "/:location_id" });
  });

});

App.ApplicationSerializer = DS.RESTSerializer.extend({
  primaryKey: '_id'
});

App.ApplicationAdapter = DS.RESTAdapter.extend({
  //namespace: 'api'
});


App.Store = DS.Store.extend({
  adapter: 'App.ApplicationAdapter'
});

DS.RESTAdapter.reopen({
  host: 'http://localhost:3000'
});


App.Location = DS.Model.extend({
    latitude: DS.attr('string'),
    longitude: DS.attr('string'),
    accuracy: DS.attr('string')

});

App.LocationsIndexRoute = Ember.Route.extend({

  setupController: function(controller) {

    var locations = this.get('store').find('location'); // App.Location.find();
    controller.set('content', locations);
  },

  renderTemplate: function() {
    this.render('locations.index',{into:'application'});
  }

});

App.LocationsEditRoute = Ember.Route.extend({

  setupController: function(controller, model) {
      this.controllerFor('locations.edit').setProperties({isNew: false,content:model});
  },

  renderTemplate: function() {
    this.render('locations.edit',{into:'application'});
  }

});

App.LocationsNewRoute = Ember.Route.extend({
  setupController: function(controller, model) {
        var newLocation = this.store.createRecord('location',{});
        this.controllerFor('locations.edit').setProperties({isNew: true,content:newLocation});
  },
  renderTemplate: function() {
    this.render('locations.edit',{into:'application'});
  }

});

App.LocationsEditController = Ember.ObjectController.extend({
  updateItem: function(location) {
    location.save();
    this.get("target").transitionTo("locations");
  },

  isNew: function() {
    console.log("calculating isNew");
    return this.get('content').get('id');
  }.property()


});


App.LocationsIndexController = Ember.ArrayController.extend({
  
  editCounter: function () {
    return this.filterProperty('selected', true).get('length');
  }.property('@each.selected'),

  itemsSelected: function() {
    return this.get("editCounter")>0;
  }.property('editCounter'),

  removeItem: function(location) {
    location.on("didDelete", this, function() {
	   	console.log("record deleted");
    });

    location.destroyRecord();
  },

  removeSelectedLocations: function() {
    arr = this.filterProperty('selected', true);
    if (arr.length==0) {
        output = "nothing selected";
    } else { 
        output = "";
        for (i=0 ; i<arr.length ; i++) { 
          arr[i].destroyRecord()
        }
    }
  },

  locationsPresent: function() {

    var itemsPresent = this.get('content').get('length') > 0;
    console.log(" +++ Computed locationsPresent prop with value " + itemsPresent);
    return itemsPresent;
  }.property("content.@each")
  //}.property("content.isLoaded")
});

Ember.Handlebars.registerBoundHelper('locsPresent', 
    function(myBinding, options) {
      console.log(myBinding);
      console.log(options);
      return true;
    }
);

App.NavView = Ember.View.extend({
    tagName: 'li',
    classNameBindings: ['active'],

    didInsertElement: function () {
          this._super();
          this.notifyPropertyChange('active');
          var _this = this;
          this.get('parentView').on('click', function () {
              _this.notifyPropertyChange('active');
          });
    },

    active: function() {
      return this.get('childViews.firstObject.active');
    }.property()
  });

