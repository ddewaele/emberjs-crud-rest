**Note:** Project still in progress ....

##Project folder/file structure

We'll create a project with the following filestructure.

![Project structure](https://dl.dropboxusercontent.com/u/13246619/Blog%20Articles/EmberJS/file_structure.png)

- The CSS folder contains the Twitter Bootstrap stylesheet as well as our own stylesheet.
- The JS folder contains the Javascript files for EmberJS, EmberData, Twitter bootstrap, Handlebars and jQueryy. It also contains our EmberJS application.


##Bootstrap Ember

We'll start our application in Javascript by creating an Ember Application

    App = Ember.Application.create({ LOG_TRANSITIONS: true});

This will bootstrap the Ember application. Just think of this as some internal plumbing that needs to be done before you can start using EmberJS. We've enabled the ```LOG_TRANSITIONS``` option for debugging purposes, as it will print out messages each time we transition from one screen to another.

##Templates


Ember.js uses Handlebars templates to render items on the screen. Each template is embedded in a script tag and can be given a name using the data-template-name attribute. If no data-template-name is provided, Ember.JS will consider this to be the application template, meaning that it will be processed (shown) when the application starts. This is your most top-level template.

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

If you go to another router, for example by going to index.html#/about , you'll see the following error msg :

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

Once we have the store and the model defined, we can start interacting with our model.

In the browser console, typ the following command to create a new record :

	newLocation = App.Location.createRecord({latitude:3.1232, longitude:5.321312, accuracy:6000});

You can access the properties of the record like this:

	newLocation.get('latitude')
	newLocation.get('longitude')
	newLocation.get('accuracy')


IF you want to persist your model you retrieve a reference to the transaction and call commit:

	newLocation.transaction.commit();	


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

And if we want to use a custom URL we need to reopen the adapter with the url property:

	DS.RESTAdapter.reopen({
	  url: 'http://localhost:3000'
	});

## Showing the model on the screen.

In order to show our locations on the screen we need a couple of thing :

### A link to get us there

{{#linkTo "locations"}}Locations{{/linkTo}} |

### A route

We need a route definition that will lead us to the template:

this.route("locations", { path: "/locations" });

And a route object below will set up a Controller to provide the data

App.LocationsRoute = Ember.Route.extend({
  setupController: function(controller) {
    console.log("Returning locations from route...");
    controller.set('content', App.Location.find());
  }
});

### A template

We create a template that loops over the model. (notice how content and model are often used referring to the same thing.)


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

### The master-detail

Now that we are able to display an overview of records, we should also be able to display the details of an individual record.

There are 2 ways to implement a master/detail screen.

#### Master and detail is on the same page.

We can organize our templates in such a way that the locations overview template (locations) is the parent of the detail location template (locations.edit). The way Ember.JS processes templates is 

Because "locations" is a parent for "locations.edit", the edit template will be shown together with its parent.

If you want to seperate master and detail in 2 seperate pages, you need to put the 2 templates on the same level.

#### Master and detail on seperate pages.

In order to have a seperate master and detail we need to re-organize our templates.

Instead of having a "locations" - "locations.edit" template hierarchy, we'll put both templates on the same level by renaming locations to "locations.index".

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