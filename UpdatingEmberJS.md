## The REST RESTSerializer

In my previous version, the RESTSerializer was stored as property in the RESTAdapter.
The primary key also used to be a function.

	App.Adapter = DS.RESTAdapter.extend({
	  serializer: DS.RESTSerializer.extend({
	    primaryKey: function (type){
	      return '_id';
	   }
	})

I extracted the RESTSerializer in its own ApplicationSerializer.
Also notice how the ```primaryKey``` is now a property.

	App.ApplicationSerializer = DS.RESTSerializer.extend({
	  primaryKey: '_id'
	});


## The RESTAdapter

Before the RESTAdapter was configured with ```url``` :

	DS.RESTAdapter.reopen({
	  url: 'http://localhost:3000'
	});

It now needs to be configured with ```host``` :

	DS.RESTAdapter.reopen({
	  host: 'http://localhost:3000'
	});

## The on function

No longer working:

    locations.on('didLoad', function() {
      console.log(" +++ Locations loaded!");
    });

## Creating records

A new record used to be created like this:

	var newLocation = App.Location.createRecord()

And now it is created like this

	var newLocation = this.store.createRecord('location',{});

## Updating records

This used to be done like this:

	location.transaction.commit();

And is now done like this:

	location.save();

## Deleting records

This used to be done like this:
 
     location.deleteRecord();
     location.transaction.commit();
     
And is now done like this:

     location.destroyRecord();

## Retrieving the length

Used to have this:

var itemsPresent = this.get('content').content.length > 0;

And now this:

var itemsPresent = this.get('content').get('length') > 0;


## Finding records.

Used to have this:

	var locations = App.Location.find();

Now need to have this:

	var locations = this.get('store').find('location');


## CamelCasing calls to the store.

While fixing the code I had written the following (notice the upper-case L in Location) :

var locations = this.get('store').find('Location');

This resulted in an error.

The REST call /locations returned the following (correct) data :

	{
	  "locations": [
	    {
	      "latitude": "90",
	      "longitude": "80",
	      "accuracy": "77",
	      "_id": "535fd49c7f4a0b0e11000001"
	    },
	    {
	      "latitude": "90",
	      "longitude": "80",
	      "accuracy": "70",
	      "_id": "535fd4bf7f4a0b0e11000002"
	    }
	  ]
	}

But I was getting this erorr :

	Uncaught Error: Assertion Failed: Error: Assertion Failed: The response from a findAll must be an Array, not undefined ember-1.5.1.js:73
	Ember.assert ember-1.5.1.js:73
	Ember.RSVP.onerrorDefault ember-1.5.1.js:17187
	__exports__.default.trigger ember-1.5.1.js:8977
	Promise._onerror ember-1.5.1.js:9701
	publishRejection ember-1.5.1.js:10108
	(anonymous function) ember-1.5.1.js:18380
	DeferredActionQueues.flush ember-1.5.1.js:6127
	Backburner.end ember-1.5.1.js:6215
	Backburner.run ember-1.5.1.js:6254
	Ember.run ember-1.5.1.js:6664
	Adapter.extend.ajax.Ember.RSVP.Promise.hash.success ember-data-1.0.0-beta.7.f87cba88.js:1523
	jQuery.Callbacks.fire jquery-1.9.1.js:1037
	jQuery.Callbacks.self.fireWith jquery-1.9.1.js:1148
	done jquery-1.9.1.js:8074
	jQuery.ajaxTransport.send.callback


In an attempt to fix it I changed the REST call to ommit the root element

	[
	  {
	    "latitude": "90",
	    "longitude": "80",
	    "accuracy": "77",
	    "_id": "535fd49c7f4a0b0e11000001"
	  },
	  {
	    "latitude": "90",
	    "longitude": "80",
	    "accuracy": "70",
	    "_id": "535fd4bf7f4a0b0e11000002"
	  }
	]

But then I got the following error because EmberData could not find the correct model.

	Error: No model was found for '0'
	    at new Error (native)
	    at Error.Ember.Error (file://localhost/Users/ddewaele/Projects/emberjs-crud-rest/js/ember-1.5.1.js:910:19)
	    at Ember.Object.extend.modelFor (file://localhost/Users/ddewaele/Projects/emberjs-crud-rest/js/ember-data-1.0.0-beta.7.f87cba88.js:9805:33)
	    at JSONSerializer.extend.extractArray (file://localhost/Users/ddewaele/Projects/emberjs-crud-rest/js/ember-data-1.0.0-beta.7.f87cba88.js:3172:28)
	    at superWrapper (file://localhost/Users/ddewaele/Projects/emberjs-crud-rest/js/ember-1.5.1.js:1292:16)
	    at Ember.Object.extend.extractFindAll (file://localhost/Users/ddewaele/Projects/emberjs-crud-rest/js/ember-data-1.0.0-beta.7.f87cba88.js:2380:21)
	    at Ember.Object.extend.extract (file://localhost/Users/ddewaele/Projects/emberjs-crud-rest/js/ember-data-1.0.0-beta.7.f87cba88.js:2365:37)
	    at file://localhost/Users/ddewaele/Projects/emberjs-crud-rest/js/ember-data-1.0.0-beta.7.f87cba88.js:10396:34
	    at invokeCallback (file://localhost/Users/ddewaele/Projects/emberjs-crud-rest/js/ember-1.5.1.js:10013:19)
	    at publish (file://localhost/Users/ddewaele/Projects/emberjs-crud-rest/js/ember-1.5.1.js:9683:9) 


## Deleting records


	Error: Attempted to handle event `pushedData` on <App.Location:ember418:535fd4bf7f4a0b0e11000002> while in state root.deleted.uncommitted. 
	    at new Error (native)
	    at Error.Ember.Error (file://localhost/Users/ddewaele/Projects/emberjs-crud-rest/js/ember-1.5.1.js:910:19)
	    at Ember.Object.extend._unhandledEvent (file://localhost/Users/ddewaele/Projects/emberjs-crud-rest/js/ember-data-1.0.0-beta.7.f87cba88.js:5717:15)
	    at Ember.Object.extend.send (file://localhost/Users/ddewaele/Projects/emberjs-crud-rest/js/ember-data-1.0.0-beta.7.f87cba88.js:5660:16)
	    at Ember.Object.extend.pushedData (file://localhost/Users/ddewaele/Projects/emberjs-crud-rest/js/ember-data-1.0.0-beta.7.f87cba88.js:5755:14)
	    at Ember.Object.extend.setupData (file://localhost/Users/ddewaele/Projects/emberjs-crud-rest/js/ember-data-1.0.0-beta.7.f87cba88.js:5990:26)
	    at Ember.Object.extend._load (file://localhost/Users/ddewaele/Projects/emberjs-crud-rest/js/ember-data-1.0.0-beta.7.f87cba88.js:9782:16)
	    at Ember.Object.extend.push (file://localhost/Users/ddewaele/Projects/emberjs-crud-rest/js/ember-data-1.0.0-beta.7.f87cba88.js:9889:14)
	    at null.<anonymous> (file://localhost/Users/ddewaele/Projects/emberjs-crud-rest/js/ember-data-1.0.0-beta.7.f87cba88.js:9956:23)
	    at Array.map (native) 



## Deprecated messages:

Some of the deprecated message I received:

	event.returnValue is deprecated. Please use the standard event.preventDefault() instead. jquery-1.9.1.js:3345
	Attr.specified is deprecated. Its value is always true. jquery-1.9.1.js:6209
	
	WARNING: The 'linkTo' view helper is deprecated in favor of 'link-to' ember-1.5.1.js:3521
	WARNING: The 'bindAttr' view helper is deprecated in favor of 'bind-attr' ember-1.5.1.js:3521
	
	WARNING: The current default is deprecated but will prefer to handle actions directly on the controller instead of a similarly named action in the actions hash. To turn off this deprecated feature set: Ember.FEATURES['ember-routing-drop-deprecated-action-style'] = true ember-1.5.1.js:3521
	

	DEPRECATION: Action handlers implemented directly on controllers are deprecated in favor of action handlers on an `actions` object ( action: `updateItem` on <App.LocationsEditController:ember475>)
	        at Ember.ControllerMixin.Ember.Mixin.create.deprecatedSend (file://localhost/Users/ddewaele/Projects/emberjs-crud-rest/js/ember-1.5.1.js:20775:11)
	        at Ember.ActionHandler.Ember.Mixin.create.send (file://localhost/Users/ddewaele/Projects/emberjs-crud-rest/js/ember-1.5.1.js:18679:31)
	        at runRegisteredAction (file://localhost/Users/ddewaele/Projects/emberjs-crud-rest/js/ember-1.5.1.js:38512:25)
	        at Object.Backburner.run (file://localhost/Users/ddewaele/Projects/emberjs-crud-rest/js/ember-1.5.1.js:6249:26)
	        at Object.Ember.run (file://localhost/Users/ddewaele/Projects/emberjs-crud-rest/js/ember-1.5.1.js:6664:27)
	        at Object.handleRegisteredAction [as handler] (file://localhost/Users/ddewaele/Projects/emberjs-crud-rest/js/ember-1.5.1.js:38510:15)
	        at HTMLButtonElement.<anonymous> (file://localhost/Users/ddewaele/Projects/emberjs-crud-rest/js/ember-1.5.1.js:22259:23)
	        at HTMLBodyElement.jQuery.event.dispatch (file://localhost/Users/ddewaele/Projects/emberjs-crud-rest/js/jquery-1.9.1.js:3074:9)
	        at HTMLBodyElement.jQuery.event.add.elemData.handle (file://localhost/Users/ddewaele/Projects/emberjs-crud-rest/js/jquery-1.9.1.js:2750:46) 