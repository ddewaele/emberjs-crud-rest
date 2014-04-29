When the REST call /locations returns the following data :

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

I'm getting the following error :

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


When the REST call /locations returns the following data :

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

I'm getting the following error

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
	    


