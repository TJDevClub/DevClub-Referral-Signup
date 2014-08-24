/* ---------------------------------------------------- +/

## Client Router ##

Client-side Router.

/+ ---------------------------------------------------- */

// Config

Router.configure({
    layoutTemplate: 'layout',
});

// Filters

var filters = {

    isLoggedIn: function() {
        if (!(Meteor.loggingIn() || Meteor.user())) {
            alert('Please Log In First.')
            this.stop();
        }
    }

}


// Routes

Router.map(function() {
    // Pages
    this.route('home', {
        path: '/'
    });

    this.route('login');

    this.route('register');
});