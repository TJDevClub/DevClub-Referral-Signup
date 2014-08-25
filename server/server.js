// Students = new Meteor.Collection('students');
// Confirmation = new Meteor.Collection('confirmation');//we'll secure it after everything's working


Meteor.startup(function() {

  //process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
	process.env.MAIL_URL = 'smtp://tjdev%40sandbox32437.mailgun.org:tjdev123@smtp.mailgun.org:587';
    //process.env.ROOT_URL = ROOT_URL = 'spell-dallas.codio.io:3000';
    //Meteor.absoluteUrl("",{rootUrl:"http://spell-dallas.codio.io:3000"});
    //console.log(Accounts.emailTemplates)
});

// Confirmation.allow({
//     insert: function(){return true;},
//     update: function(){return false;},
//     remove: function(){return false;}
// });

// Meteor.publish('students', function() {//for the record, I wouldn't bother doing a subscribe for this if you're returning everything anyways
//     return Students.find({}, {
//         sort: {
//             created_at: 1
//         }
//     });
// });

function confirmationMessage(id, code){
    return "Hello!\n"
    + "Please visit "
    + process.env.ROOT_URL
    + "verify/"
    + id
    + " to confirm your account and be able to log in.\n"
    + "Also, your referral code, which you can only use once your account has been confirmed, is "
    + code
    + "\nThanks!";
}

Meteor.publish('singleUser', function(id){
    return Meteor.users.find(id);
})

Meteor.publish('userData', function(){
    return Meteor.users.find({"emails.verified":true/*so people can't fake verify*/},{fields:{"profile.hashedInvite":true,"profile.lastName":true,"profile.firstName":true,"profile.score":true,"emails":true}});
})


Accounts.onCreateUser(function(options, user) {
    if(!options.profile){
       options.profile = {}
    }
    if (options.profile)
        user.profile = options.profile;
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

Accounts.validateLoginAttempt(function(type, user){
	if((type.user && type.user.emails && !type.user.emails[0].verified) || (user && user.emails && !user.emails[0].verified))
		throw new Meteor.Error(100002, "email not verified" );
	return true;
}); 

Meteor.methods({
    register: function(email, pass, options) {
        
        var id = Accounts.createUser({email:email, password:pass, profile:options});
        
        console.log(options);
        if(id===undefined)
            throw new Meteor.Error(100001, "Email in use");
        console.log(id);
        Email.send({from:"tjdev@sandbox32437.mailgun.org",to:email,subject:"Dev Club Email Confirmation",text:confirmationMessage(id, options.referralCode),html:confirmationMessage(id, options.referralCode).replace("\n","<br>")});
        
        return id;
    },
    test: function(subj,text){
        Email.send({from:"tjdev@sandbox32437.mailgun.org",to:"mjkaufer@gmail.com",subject:subj,text:text});
        return "Winner";
    },
    update: function(uid){
        if(Meteor.users.findOne({_id:uid}).emails[0].verified === true)
            return false;
        Meteor.users.update({_id:uid}, {$set:{"emails.0.verified":true}});
        var referral = Meteor.users.findOne({_id:uid}).profile.referralCode;
        Meteor.users.update({"profile.inviteCode": referral}, {$inc:{"profile.score":1}});
        return true;
    },
    getCode: function(){
        return Meteor.users.findOne(this.userId).profile.inviteCode;
    }
});