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
	this.route('complete');
    
    this.route('login');
    
    this.route('loading');

    this.route('register');
    
    this.route('verify', {
        path: '/verify/:verif',
        waitOn: function(){
          return Meteor.subscribe('singleUser', this.params.verif);
        },
        action: function(){
            var router = this;
			Meteor.call('update', this.params.verif, function(e,r){
            	if(r === false)
                    router.redirect('/');
                else
                    router.redirect('/complete')
                
            });
            this.render('loading');
            
            
        }
    });
});