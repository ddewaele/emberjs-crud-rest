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

  setupController: function(controller) {

    var locations = App.Location.find();
    locations.on('didLoad', function() {
      console.log(" +++ Locations loaded!");
    });

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
        this.controllerFor('locations.edit').setProperties({isNew: true,content:App.Location.createRecord()});
  },
  renderTemplate: function() {
    this.render('locations.edit',{into:'application'});
  }

});

App.LocationsEditController = Ember.ObjectController.extend({
  updateItem: function(location) {
    location.transaction.commit();
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

    location.deleteRecord();
    location.transaction.commit();
  },

  removeSelectedLocations: function() {
    arr = this.filterProperty('selected', true);
    if (arr.length==0) {
        output = "nothing selected";
    } else { 
        output = "";
        for (i=0 ; i<arr.length ; i++) { 
          arr[i].deleteRecord()
          arr[i].store.commit();
        }
    }
  },

  locationsPresent: function() {
    var itemsPresent = this.get('content').content.length > 0;
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

