**Important Note:** 

Code has been updated to 

- ember-1.5.1.js
- ember-data-1.0.0-beta.7
- handlebars-v1.3.0

The docs below still have some rc7 references. 

The goal of this project is to show a working CRUD sample. 
Icons provided by [Custom Icon Design](http://www.customicondesign.com/).

![main screen](https://dl.dropboxusercontent.com/u/13246619/Blog%20Articles/EmberJS/intro.png)

It is still very much a work-in-progress but it is fully functional as it is. 
Open items / questions that need clarification and fixes in the code:

- When creating a new record, if the user decides to do something else (not clicking save), the record still shows up in the list
[When to call createRecord and how to handle store transactions](http://stackoverflow.com/questions/16263915/when-to-call-createrecord-and-how-to-handle-store-transactions)

- When a record is removed from the DB by an external process, it is not picked up by the model/controller. The deleted record is still shown in the list.
[EmberJS Model.find not up-to-date with underlying store](http://stackoverflow.com/questions/16380143/emberjs-model-find-not-up-to-date-with-underlying-store)

This project uses EmberJS 1.0.0-rc.6 and EmberData 0.13. EmberJS and EmberData builds can be downloaded [here](http://builds.emberjs.com/).

##Project folder/file structure

We'll create a project with the following filestructure.

![Project structure](https://dl.dropboxusercontent.com/u/13246619/Blog%20Articles/EmberJS/file_structure.png)

- The CSS folder contains the Twitter Bootstrap stylesheet as well as our own stylesheet.
- The JS folder contains the Javascript files for EmberJS, EmberData, Twitter bootstrap, Handlebars and jQueryy. It also contains our EmberJS application.


##Project dependencies

In order for this application to work, a REST backend needs to be available. I've pushed a very simple NodeJS based backend in the [location-rest-api Github repository](https://github.com/ddewaele/location-rest-api).

##Bootstrap Ember

We'll start our application in Javascript by creating an Ember Application

    App = Ember.Application.create({ LOG_TRANSITIONS: true});

This will bootstrap the Ember application. Just think of this as some internal plumbing that needs to be done before you can start using EmberJS. We've enabled the ```LOG_TRANSITIONS``` option for debugging purposes, as it will print out messages each time we transition from one screen to another.

##Templates


Ember.js uses Handlebars templates to render items on the screen. Each template is embedded in a script tag and can be given a name using the **data-template-name** attribute. If no **data-template-name** is provided, Ember.JS will consider this to be the **application** template, meaning that it will be processed (shown) when the application starts. This is your most top-level template.

So the following Handlebars template definition

    <script type="text/x-handlebars">
      Hello Ember.JS
    </script>

is the equivalent of this:

    <script type="text/x-handlebars" data-template-name="application" >
      Hello Ember.JS
    </script>

If you launch the index page you should see the Hello Ember.JS text.  If you open up the Web Developer Tools console, you should also see the following text:

	Transitioned into 'index' 

This is Ember.JS telling you that it has transitioned into the "index" route. The "index" route is another magical keyword that represents the root or index of your application. Whenever somebody goes to the root or index of your application (using / , index.html or index.html#/), Ember.JS will transition ot the index route.

This means that when we add a template called "index" to our page, Ember.JS will load up that template.	

We'll add another template to our page, this time calling it the "index" template.

    <script type="text/x-handlebars" data-template-name="index" >
      This is the homepage....
    </script>

You'll notice when you launch the browser that although Ember.JS is transitioning to the "index" route, it is not showing the text. This is because we haven't allowed for thie "index" template to be inserted anywhere. For that we need to add an {{outlet}} to our parent template, the application template.

So go ahead and change 

    <script type="text/x-handlebars">
      Hello Ember.JS
    </script>

into 

    <script type="text/x-handlebars">
      Hello Ember.JS
      {{outlet}}
    </script>

If we now go to the index, you'll see that "Hello Ember.JS" is rendered on the screen, along with the text from our index template. 

If we want to introduce other templates in our application, we need to have some way of mapping a URL to a template. That's what Ember routes are all about. But before we dive into routes, let's take a step back and see how Ember.JS was able to display the text from our existing templates.

## Ember auto generated code.

It's important to realize at even with this trivial example Ember.JS has already done a lot of things in the background. In fact, it has constructed and used a lot of Core Ember Concepts, including

- A router
- A controller
- A view
- Templates

And yet, the only thing we needed to do was create a template. So how did all of this happen ?

Well, Ember.JS relies heavily on naming conventions. When these naming conventions are applied correctly, Ember.JS can generate a lot of code you. This code generation is done at runtime so you won't even see it or heave to deal with it, but it's something that you'll need to learn upfront. In the background, Ember.JS has created these core concepts that we'll visit one by one.....


### The router.

Ember uses a Router to determine what it should render when the user enters a URL or transitions from one view to another. In the background, and invisible to us, Ember has created the following "index" route and added it to its map :

	App.Router.map(function() {
	  this.route("index", { path: "/" });
	});

This router makes it possible for us to go the index page, and have EmberJS render the index template for us.	

If you go to another router, for example by going to **index.html#/about** , you'll see the following error msg :

	Uncaught Error: No route matched the URL '/about' 

As you can see, Ember.JS has detected that no route matches this url. So lets create one....

	App.Router.map(function() {
	  this.route("index", { path: "/" });
	  this.route("about", { path: "/about" });
	});

Now when we access the about URL, we'll see that error goes away, and Ember.JS now knows it has transitioned to the "about" route. You might have guessed it, if we want to display something we need to create an "about" template, otherwise EmberJS will only display your application template.

	 <script type="text/x-handlebars" data-template-name="about" >
		 <p>This is the about page.</p>
	 </script>

We'll do some more advanced things with our routers in a while, but what's important to remember is that ... [TODO]

### The controller.

Ember has also create 2 controllers for us:

-The ApplicationController

	App.ApplicationController = Ember.Controller.extend({
	});


-The IndexController

	App.IndexController = Ember.Controller.extend({
	});

### Models

Models represent the data you want to work with in your application. Up until now the data that we worked with was static text embedded in our templates. 

In this Ember.JS application we'll retrieve and store our data (model) form / to a REST server. 

In order to interact with a data store we first need to define it :

	App.Store = DS.Store.extend({
	  revision: 12
	});

We'll also define our Model :

	App.Location = DS.Model.extend({
	    latitude: DS.attr('string'),
	    longitude: DS.attr('string'),
	    accuracy: DS.attr('string')

	});


Once we have the store and the model defined, we can already start interacting with our model. Note that we haven't defined any templates yet so we won't be able to see anything on the screen, but you can already get a feel of the API by going into the browser console, and typing the following command to create a new record :

	newLocation = App.Location.createRecord({latitude:3.1232, longitude:5.321312, accuracy:6000});


When you start interacting with them model you'll get the following warning :

	A custom DS.Adapter was not provided as the 'Adapter' property of your application's Store. The default (DS.RESTAdapter) will be used. 

This is EmberJS's way of saying that we'll be using the default RESTAdapter. The RESTAdapter is a data adapter that is capable of interacting with a standard REST API that follows certain patterns imposed by Ember.JS. It allows you to interact with that REST API with very little code.

You can access the properties of the record like this:

	newLocation.get('latitude')
	newLocation.get('longitude')
	newLocation.get('accuracy')

IF you want to persist your model you retrieve a reference to the transaction and call commit:

	newLocation.transaction.commit();	

At this point you'll see that the REST adapter is trying to connect to a REST API running on your local system:

	OPTIONS file:///locations  

[TODO explain how this works , CORS , .... ]

If you want to override the URL that EmberJS shoud connect to you need to repoen it.

	DS.RESTAdapter.reopen({
	  url: 'http://localhost:3000'
	});

Our REST server is built using Node.JS and is using MongoDB for storage. When persisting objects in MongoDB it automatically adds an identifier to the object using the field "_id".

In order for our Ember.JS application to work with objects coming from the MongoDB, we need to setup our RESTAdapter to deal with this _id type. We can do this by creating a custom Adapter that extends the basic RESTAdapter in order to override the primaryKey property in the serializer.

	App.Adapter = DS.RESTAdapter.extend({
	  serializer: DS.RESTSerializer.extend({
	    primaryKey: function (type){
	      return '_id';
	   }
	  })
	});

We need to reference our new adapter in the store.

	App.Store = DS.Store.extend({
	  revision: 12,
	  adapter: 'App.Adapter'
	});

## Showing the model on the screen.

In order to show our locations on the screen we need a couple of thing :

### A link to get us there

From our homepage we need to transition to the locations route using a link:

	{{#linkTo "locations"}}Locations{{/linkTo}} |

### A route

In order for our link to work we need a route definition to support the transition.

	this.route("locations", { path: "/locations" });

We also need a route object below will set up a Controller to provide the data

	App.LocationsRoute = Ember.Route.extend({
	  setupController: function(controller) {
	    console.log("Returning locations from route...");
	    controller.set('content', App.Location.find());
	  }
	});

### A template

And finally we need a template that loops over the model. (notice how content and model are often used referring to the same thing.)


	<script type="text/x-handlebars" data-template-name="locations" >
	<table>
		{{#each location in model}}
		    <tr>
		    <td>{{location.latitude}}</td>
		    <td>{{location.longitude}}</td>
		    <td>{{location.accuracy}}</td>
		    </tr>
		{{/each}}
	</table>
	</script>


An alternative way of creating the each block is like this :

      {{#each this}}
        <tr>
        <td>{{latitude}}</td>
        <td>{{longitude}}</td>
        <td>{{accuracy}}</td>
        </tr>
      {{/each}}

Providing you have setup your route like this:

	App.LocationsRoute = Ember.Route.extend({
	  
	  model: function() {
	    return App.Location.find();
	  }
	});

Or you could even do this:

	{{#each location in controller}}
		<tr>
		<td>{{location.latitude}}</td>
		<td>{{location.longitude}}</td>
		<td>{{location.accuracy}}</td>
		</tr>
	{{/each}}

### The master-detail

Now that we are able to display an overview of records, we should also be able to display the details of an individual record.

There are 2 ways to implement a master/detail screen.

#### Master and detail is on the same page.

We can organize our templates in such a way that the locations overview template (locations) is the parent of the detail location template (locations.edit). Again, Ember does this through naming conventions.

"locations" is considered a parent of the "locations.edit" template. This means that the edit template will be shown together with its parent, providing that the parent has an ```{{outlet}}``` defined.

[TODO insert picture]

If you want to seperate master and detail in 2 seperate pages, you need to put the 2 templates on the same level.

#### Master and detail on seperate pages.

In order to have a seperate master and detail we need to re-organize our templates.

Instead of having a "locations" - "locations.edit" template hierarchy, we'll put both templates on the same level by renaming locations to "locations.index".

[TODO insert picture]

Keep in mind that this forces us to rename our Router as well :

	App.LocationsIndexRoute = Ember.Route.extend({
	  
	  model: function() {
	    return App.Location.find();
	  }

	});"

However, when loading up the detail screen we get the following error:

	WARNING: The immediate parent route ('a') did not render into the main outlet and the default 'into' option ('p') may not be expected

In order to get rid of the warning we need to override the LocationsEditRoute's renderTemplate method so that we can force the rendering of the locatons.edit template into the application template.  

	App.LocationsEditRoute = Ember.Route.extend({

	  renderTemplate: function() {
	    this.render('locations.edit',{into:'application'});
	  }

	});

**Note:** Take into account that when there is an error in your template it's possible that Ember.JS will simply refuse to render it without any error or warning.

For example if you have an invalid route in your linkTo helper, the template will simply not render.

	<td>{{#linkTo locations.edit_invalid location}}Edit{{/linkTo}}</td>	


## Adding records

In this section we'll add the possibility to add a record.	

We'll start by adding a link to go to the new record screen

	<p>{{#linkTo "locations.new"}}New location{{/linkTo}}</p>

We need a route to support the transition:

	this.resource("locations", function(){
	  this.route("new", {path:"/new"});
	  this.route("edit", {path: "/:location_id" });
	});

And a template as well to allow the user to enter data:

	<script type="text/x-handlebars" data-template-name="locations/new" >
	<form class="form-horizontal">
	  <div class="control-group">
	    <label class="control-label" for="latitude">Latitude</label>
	    <div class="controls">
	      {{view Ember.TextField valueBinding="latitude"}}
	    </div>
	  </div>
	  <div class="control-group">
	    <label class="control-label" for="latitude">Longitude</label>
	    <div class="controls">
	      {{view Ember.TextField valueBinding="longitude"}}
	    </div>
	  </div>
	  <div class="control-group">
	    <label class="control-label" for="accuracy">Accuracy</label>
	    <div class="controls">
	      {{view Ember.TextField valueBinding="accuracy"}}
	    </div>
	  </div>
	</form>

	<p>
	  <button {{action addItem this}}>Add record</button>
	</p>

	</script>

Notice how we add a button to screen to perform the addItem button.

	<p>
	  <button {{action addItem this}}>Add record</button>
	</p>

When clicking on the button, we see the following message:

	Uncaught Error: Nothing handled the event 'addItem'. 

Actions are defined on Controllers, so we'll create a controller for the new location route and implement a addItem funciton.

	App.LocationsNewController = Ember.ObjectController.extend({
	  addItem: function(location) {
	    location.transaction.commit();
	  }
	});	

Although we got rid of the error, it is still not working. As soon as we start typing in the input fields we see the following errors popping up :

	Uncaught Error: assertion failed: Cannot delegate set('accuracy', ewe) to the 'content' property of object proxy <App.LocationsNewController:ember272>: its 'content' is undefined. 

On top of that, when we try to save the locstion it fails because the addItem doesn't pass the location properly.

In order to fix this, we need to prepare a new record before we tranition to the new location screen.

	App.LocationsNewRoute = Ember.Route.extend({
	  model: function() {
	    return App.Location.createRecord();
	  }
	});

The LocationsNewRout now provides an empty model that is bound to the "new location" page, ready for the user to start populating, and saving it as a new location.

## Deleting records

Now that we are able to add records we can start implementing the delete. Deleting items doesn't require a template as it is simply an action that is performed on the location overview. 

We'll add a cell to our table to remove a row item.

	<td><button {{action removeItem location}}>Delete</button></td>

This link will not work as we need to implement the removeItem method on our controller.

	Uncaught Error: Nothing handled the event 'removeItem'. 


The action will be implemented on the controller. As the action is triggered from the LocationIndex, and we haven't defined a controller for it (but relied on Ember auto-generating a controller), we're going to create it now and expose the ```removeItem``` method on it.

	App.LocationsIndexController = Ember.ArrayController.extend({
	  removeItem: function(location) {
	    location.on("didDelete", this, function() {
			console.log("record deleted");
	    });

	    location.deleteRecord();
	    location.transaction.commit();
	  }
	});

We're passing the location as an argument to the removeItem method and call the deleteRecord on it.

**Note:** Keep in mind that the actual delete is done in an asynchronous way. You can use the **didDelete** callback to be notified when the record was deleted succesfully. This is useful if you want to display a notiication to the user that the record was in fact deleted. There's no guarantee that the record is deleted immediately, so waiting for the callback is always a good idea. In this sample we're simply writing a message to the console when the delete was executed.

## Updating records

For the update scenario we're going to re-use much of the templating we already have in place from the create scenario.
After all, the form to create or update a record is almost identical.

We could simply copy-paste our ```locations/new``` template into a ```locations/edit``` template, but that would introduce a lot of code duplication. Instead, we're going to use ```partials``` to move the common part out of the template (the form elements).

In order to do that, replace the following form element code from the ```locations/new``` template into a new template called ```_locationForm```. The fact that it starts with an underscore means that it is considered a partial.

	<script type="text/x-handlebars" data-template-name="_locationForm" >
	  <form class="form-horizontal">
	  <div class="control-group">
	    <label class="control-label" for="latitude">Latitude</label>
	    <div class="controls">
	      {{view Ember.TextField valueBinding="latitude"}}
	    </div>
	  </div>
	  <div class="control-group">
	    <label class="control-label" for="latitude">Longitude</label>
	    <div class="controls">
	      {{view Ember.TextField valueBinding="longitude"}}
	    </div>
	  </div>
	  <div class="control-group">
	    <label class="control-label" for="accuracy">Accuracy</label>
	    <div class="controls">
	      {{view Ember.TextField valueBinding="accuracy"}}
	    </div>
	  </div>
	</form>
	</script>

In our ```locations/new``` template, add a reference to the partial like this :

	<script type="text/x-handlebars" data-template-name="locations/new" >
	  <h1>New location</h1>

	{{partial "locationForm"}}

	<p>
	  <button {{action addItem this}}>Add record</button>
	</p>

	</script>

Our "create" use-case should still work, and now we can create a new template for editing a location

	<script type="text/x-handlebars" data-template-name="locations/edit" >
	  <h1>Edit location</h1>
	  {{partial "locationForm"}}

	  <p>
	    <button {{action updateItem this}}>Update record</button>
	  </p>
	</script>

As you can see, the title and the save button differ, so these remain in their corresponding template. The form elements that are identical for both templates have been put in a partial to promote re-use.

The last thing we need to do is implement the ```updateItem``` function on our controller.

##Styling

Developers usually aren't the worlds greatest designers. Most projects start out without any kind of effort on styling or applying css on the pages, resulting in pre-century-looking webpages. Luckily a designer is called into the rescue before the product is shipped.

For our styling exercise I'm going to use Twitter Bootstrap. A nice CSS / JS combo to get us up and running quickly.

We're going to replace the navigation links on top of the page :

    {{#linkTo "index"}}Home{{/linkTo}} |
    {{#linkTo "locations"}}Locations{{/linkTo}} |
    {{#linkTo "about"}}About{{/linkTo}} |


We're going to be using the Twitter bootstrap navbar instead.

In an ideal world we could have simplty rewritten the navigation like this :

        <div class="navbar">
          <div class="navbar-inner">
            <ul class="nav">
              <li>{{#linkTo "index"}}Home{{/linkTo}}</li>
              <li>{{#linkTo "locations"}}Locations{{/linkTo}}</li>
              <li>{{#linkTo "about"}}About{{/linkTo}}</li>
            </ul>
          </div>
        </div>

But unfortunately, the Twitter BootStrap navbar doesn't play nice with our linkTo helper. Although the transitions into the routes work, the tabs aren't getting highlighted at all. 

Twitter Bootstraps highlights the tab by putting an active class on the LI element, where-as Ember.JS puts on the anchor element.

<ul class="nav">
  <li><a id="ember312" class="ember-view" href="#/">Home</a></li>
  <li class="active"><a id="ember316" class="ember-view" href="#/locations">Locations</a></li>
  <li><a id="ember317" class="ember-view" href="#/about">About</a></li>
</ul>


In order to fix that, we'll create a new View.

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

With this view in place, we can rewrite our navigation bar like this :



        <div class="navbar">
          <div class="navbar-inner">
            <ul class="nav">
              
				{{#view App.NavView}}
                {{#linkTo "index"}}Home{{/linkTo}}
              {{/view}}
              
			  {{#view App.NavView}}
                {{#linkTo "locations"}}Locations{{/linkTo}}
              {{/view}}
              

 			  {{#view App.NavView}}
                {{#linkTo "about"}}About{{/linkTo}}
              {{/view}}

            </ul>
          </div>
        </div>
  
  
 If you look at the HTML that is being generated, you'll see that our custom view has now wrapped the anchor element with an LI element, and is also placing the active css class on the selected navigation element.  

	<ul class="nav">
	  <li id="ember278" class="ember-view">
	    <a id="ember281" class="ember-view" href="#/">Home</a>
	  </li>
	  
	  <li id="ember285" class="ember-view active">
	    <a id="ember286" class="ember-view active" href="#/locations">Locations</a>
	  </li>
	  

	  <li id="ember292" class="ember-view">
	    <a id="ember293" class="ember-view" href="#/about">About</a>
	  </li>
	</ul>

## Finishing up

[TODO]

## Conclusions

[TODO]

#References

- [Getting Into Ember.js](http://net.tutsplus.com/tutorials/javascript-ajax/getting-into-ember-js/)
- [Getting into Ember.js: The Next Steps](http://net.tutsplus.com/tutorials/javascript-ajax/getting-into-ember-js-part-2/)
- [Getting Into Ember: Part 3](http://net.tutsplus.com/tutorials/javascript-ajax/getting-into-ember-js-part-3/)
- [Getting Into Ember: Part 4](http://net.tutsplus.com/tutorials/javascript-ajax/getting-into-ember-part-4/)

TO SORT:

- http://tech.pro/tutorial/1166/getting-started-with-emberjs
- http://eviltrout.com/2013/03/17/adding-to-discourse-part-2.html
- https://github.com/cmoel/tom_dale_ember_screencast
- https://github.com/heroku/ruby-rails-unicorn-sample
- https://github.com/emberjs/ember-rails
- http://www.youtube.com/watch?v=aBvOXnTG5Ag
- http://www.youtube.com/watch?v=obaWh8xL2C0
- http://jsfiddle.net/ddewaele/EkU4V/