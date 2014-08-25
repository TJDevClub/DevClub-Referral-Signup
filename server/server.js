Students = new Meteor.Collection('students');
Confirmation = new Meteor.Collection('confirmation');//we'll secure it after everything's working


Meteor.startup(function() {

  //process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
	process.env.MAIL_URL = 'smtp://tjdev%40sandbox32437.mailgun.org:tjdev123@smtp.mailgun.org:587';
    process.env.ROOT_URL = ROOT_URL = 'spell-dallas.codio.io:3000';
    Meteor.absoluteUrl("",{rootUrl:"http://spell-dallas.codio.io:3000"});
    console.log(Accounts.verifyEmail)
});

Confirmation.allow({
    insert: function(){return true;},
    update: function(){return false;},
    remove: function(){return false;}
});

Meteor.publish('students', function() {//for the record, I wouldn't bother doing a subscribe for this if you're returning everything anyways
    return Students.find({}, {
        sort: {
            created_at: 1
        }
    });
});

Meteor.publish('userData', function(){
    return Meteor.users.find({},{fields:{email: 1, referralCode: 1, inviteCode: 1}});
})

Meteor.publish('confirmation', function(){
    return Confirmation.find({}, {fields: { email: 1}});
});

Accounts.onCreateUser(function(options, user) {
    return user;
});

Accounts.config({sendVerificationEmail:true})

Accounts.emailTemplates.siteName = "Dev Club";

Accounts.emailTemplates.verifyEmail = {
	subject: function(user) {
		return "Email Verification for " + Accounts.emailTemplates.siteName;
	},
		text: function(user, url) {
		var greeting = (user.profile && user.profile.name) ?
		("Hello " + user.profile.name + ",") : "Hello,";
		return greeting + "\n"
				+ "\n"
				+ "To verify your account email, simply click the link below.\n"
				+ "\n"
				+ url + "\n"
				+ "\n"
				+ "Thanks.\n";
		},
    	html: function(user, url) {
		var greeting = (user.profile && user.profile.name) ?
		("Hello " + user.profile.name + ",") : "Hello,";
		return greeting + "<br>"
				+ "<br>"
				+ "To verify your account email, simply click the link below.\n"
				+ "<br><a href='"
				+ url + "'>Link!</a><br>"
				+ "<br>"
        		+ "Or just go here: "
        		+ url
				+ "<br>"
        		+ "Thanks.\n";
        },
    	from: "tjdev@sandbox32437.mailgun.org"
};

Accounts.validateLoginAttempt(function(type){
	if((type.user && type.user.emails && !type.user.emails[0].verified) || (user && user.emails && !user.emails[0].verified))
		throw new Meteor.Error(100002, "email not verified" );
	return true;
}); 

Meteor.methods({
    register: function(userObj) {
        

		var id = Accounts.createUser(userObj);
        if(id===undefined)
            throw new Meteor.Error(100001, "Email in use");
        console.log(id);
        //Accounts.sendVerificationEmail(id);
        
        return id;
    },
    test: function(subj,text){
        Email.send({from:"tjdev@sandbox32437.mailgun.org",to:"mjkaufer@gmail.com",subject:subj,text:text});
        return "Winner";
    }
});

