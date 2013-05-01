App = Ember.Application.create({ LOG_TRANSITIONS: true});

App.Router.map(function() {
    this.route("index", { path: "/" });
    this.route("about", { path: "/about" });
});
