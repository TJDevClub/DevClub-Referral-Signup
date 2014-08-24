Students = new Meteor.Collection('students');
Confirmation = new Meteor.Collection('confirmation');//we'll secure it after everything's working


Meteor.startup(function() {
  smtp ={
    username: 'tjdev',
    password: '2secret',//I acknowledge that this is a security flaw but I'm rather fine with it. I don't think anybody is reading this and, if someone is, props to you
    server: 'sandbox32437.mailgun.org',
    port: 25
  }

 
  process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
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
   }
}

Meteor.methods({

});