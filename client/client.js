// Students = new Meteor.Collection('students');
Alerts = new Meteor.Collection(null);
// Confirmation = new Meteor.Collection('confirmation');

// studentsSub = Meteor.subscribe('students');
// confirmationSub = Meteor.subscribe('confirmation');
Meteor.subscribe('userData');
var emailReg = /.*\@tjhsst\.edu$/i;

Template.register.events = {
	'click input[type=submit]': function(event) {
		event.preventDefault();

		var length = 6;

		var result = '';
		
		while(result === '' || Meteor.users.findOne({inviteCode:result}) !== undefined){
			result = Math.random().toString(36).substring(2,2+length).toUpperCase();
		}
		
		
		var firstName =  $('#first_name').val().trim();
		var lastName =  $('#last_name').val().trim();
		var email =  $('#email').val().trim();
        var pass = $('#password').val();
		var referralCode =  $('#referralCode').val().trim().toUpperCase() || null;
		var inviteCode =  result;

		if(/*!emailReg.test(email) || */Meteor.users.findOne({"email.address":email}) !== undefined)
			alert("Please use a valid, unused email (use your TJ email)")
		else if (!firstName || !lastName || !pass) {
			alert('Please fill in all fields');//we need a prettier way to send alerts
		} else {
			alert('Your invite code is ' + inviteCode);
//			 Confirmation.insert({
//				 created_at: new Date,
//				 firstName: firstName,
//				 lastName: lastName,
//				 email: email,
//				 referralCode: referralCode,
//				 inviteCode: inviteCode
//			 }, function(){
//				 console.log('done');
//				 Router.go('home');
//			 });

            
            
			Meteor.call('register', email, pass,
				{
                    created_at: new Date(),
                    firstName: firstName,
                    lastName: lastName,
                    referralCode: referralCode,
                    inviteCode: inviteCode
				},
                function(err, data){
                if(err){
                    alert(err)
                }
                
                
            });

		}
	}
};



Template.login.events = {
	'click input[type=submit]': function(event) {
		event.preventDefault();
		var email = $('#email').val();
		var password = $('#password').val();
		Meteor.loginWithPassword(email, password, function(error) {
			if (error) {
				alert(error.reason + ' error');
			} else {
				Router.go('/');
				alert('You are now logged in.');
			}
		});
	}
};

Template.header.user = function() {
	return Meteor.user();
}

Template.header.events({
	'click .log-out': function() {
		Meteor.logout();
	}
});

Template.header.helpers({
	isLoggedIn: function() {
		return !!Meteor.user();
	}

});


