Students = new Meteor.Collection('students');
Alerts = new Meteor.Collection(null);
Confirmation = new Meteor.Collection('confirmation');

studentsSub = Meteor.subscribe('students');
confirmationSub = Meteor.subscribe('confirmation');

var emailReg = /.*\@tjhsst\.edu$/i;

Template.register.events = {
	'click input[type=submit]': function(event) {
		event.preventDefault();

		var length = 6;

		var result = '';
		
		while(result === '' || Students.findOne({inviteCode:result}) !== undefined){
			result = Math.random().toString(36).substring(2,2+length).toUpperCase();
		}
		
		
		var firstName =  $('#first_name').val();
		var lastName =  $('#last_name').val();
		var email =  $('#email').val().trim();
		var referralCode =  $('#referralCode').val() || null;
		var inviteCode =  result;

		if(!emailReg.test(email) || Students.findOne({email:email}) !== undefined || Confirmation.findOne({email:email}) !== undefined/*So someone being confirmed doesn't get more emails*/)
			alert("Please use a valid, unused email (use your TJ email)")
		else if (!firstName || !lastName) {
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

			Accounts.createUser({
				username: template.find("#signup-username").value,
				password: template.find("#signup-password").value,
				profile: {
					name: template.find("#signup-name").value
					// Other required field values can go here
				}
			}, function(error) {
				if (error) {
					// Display the user creation error to the user however you want
				}
			});

		}
	}
};



Template.login.events = {
	'click input[type=submit]': function(event) {
		event.preventDefault();
		var username = $('#username').val();
		var password = $('#password').val();
		Meteor.loginWithPassword(username, password, function(error) {
			if (error) {
				alert(error.reason + 'error');
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


