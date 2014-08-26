// Students = new Meteor.Collection('students');
Alerts = new Meteor.Collection(null);
// Confirmation = new Meteor.Collection('confirmation');

// studentsSub = Meteor.subscribe('students');
// confirmationSub = Meteor.subscribe('confirmation');
Meteor.subscribe('userData');
// if(Meteor.user())
//     return Meteor.subscribe('singleUser', Meteor.user()._id)
var emailReg = /.*\@tjhsst\.edu$/i;
Session.set('code', "Loading...");

Deps.autorun(function() {
    if (Meteor.user())
        Meteor.call('getCode', function(e, r) {
            Session.set('code', r);
        }); //have to keep stuff like this secret so people without ref codes can't steal ref codes by db.finding    
});

Template.alerts.alerts = function(){
    return Alerts.find();
}

function addAlert(message, time){
    time = time || 2000;
    var id = Alerts.insert({message:message});
    setTimeout(function(){
        Alerts.remove({_id:id});
    }, time)
}


Template.register.events = {
    'click input[type=submit]': function(event) {
        event.preventDefault();

        var length = 6;

        var result = '';

        while (result === '' || Meteor.users.findOne({
            hashedInvite: SHA1(result)
        }) !== undefined) {
            result = Math.random().toString(36).substring(2, 2 + length).toUpperCase();
        }

        var score = 0;

        var firstName = $('#first_name').val().trim();
        var lastName = $('#last_name').val().trim();
        var email = $('#email').val().trim();
        var pass = $('#password').val();
        var referralCode = $('#referralCode').val().trim().toUpperCase() || null;
        var inviteCode = result;
        var hashedInvite = SHA1(inviteCode);

        if (!emailReg.test(email) || Meteor.users.findOne({
            "emails.address": email
        }) !== undefined)
            addAlert("Please use a valid, unused email (use your TJ email)")
        else if (!firstName || !lastName || !pass)
            addAlert('Please fill in all fields'); //we need a prettier way to send alerts
        else if (referralCode !== null && !Meteor.users.findOne({
            "profile.hashedInvite": SHA1(referralCode)
        }))
            addAlert("Invalid referral!");
        else {
            addAlert("You've successfully registered. Go to your email to verify your account to start getting points!");
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
            if (referralCode !== null) //we've checked if it's a real code already
                score = 5;

            Meteor.call('register', email, pass, {
                    created_at: new Date(),
                    firstName: firstName,
                    lastName: lastName,
                    referralCode: referralCode,
                    inviteCode: inviteCode,
                    hashedInvite: hashedInvite,
                    score: score
                },
                function(err, data) {
                    if (err) {
                        addAlert(err, 2000);
                    }


            });

            Router.go('home');

        }
    }
};

Template.header.email = function() {
    return Meteor.user().emails[0].address;
}

Template.header.code = function() {
    return Session.get('code') || "Loading...";
}
Template.share.link = functio(){
    var link = "http://devclub-referral-signup-c9-mjkaufer.c9.io/register/"+Session.get("code")
    return link;
}

Template.header.score = function() {
    return Meteor.user().profile.score;
}

Template.login.events = {
    'click input[type=submit]': function(event) {
        event.preventDefault();
        var email = $('#email').val();
        var password = $('#password').val();
        Meteor.loginWithPassword(email, password, function(error) {
            if (error) {
                addAlert(error.reason + ' error');
            } else {
                Router.go('/');
                addAlert('You are now logged in.');
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

UI.registerHelper('users', function() {
    return Meteor.users.find({"emails.0.verified":true}, {
        sort: {
            "profile.score": -1
        }
    });
});

UI.registerHelper('usersWithIndexAndEmail', function() {
    var users = Meteor.users.find({"emails.0.verified":true}, {
        sort: {
            "profile.score": -1
        }
    }).fetch();

    for (var i = 0; i < users.length; i++) {
        users[i].index = (i + 1);
        users[i].email = users[i].emails[0].address;
    }

    return users;
});

function SHA1(a){function b(a,b){var c=a<<b|a>>>32-b;return c}function d(a){var c,d,b="";for(c=7;c>=0;c--)d=15&a>>>4*c,b+=d.toString(16);return b}function e(a){a=a.replace(/\r\n/g,"\n");for(var b="",c=0;c<a.length;c++){var d=a.charCodeAt(c);128>d?b+=String.fromCharCode(d):d>127&&2048>d?(b+=String.fromCharCode(192|d>>6),b+=String.fromCharCode(128|63&d)):(b+=String.fromCharCode(224|d>>12),b+=String.fromCharCode(128|63&d>>6),b+=String.fromCharCode(128|63&d))}return b}var f,g,h,o,p,q,r,s,t,i=new Array(80),j=1732584193,k=4023233417,l=2562383102,m=271733878,n=3285377520;a=e(a);var u=a.length,v=new Array;for(g=0;u-3>g;g+=4)h=a.charCodeAt(g)<<24|a.charCodeAt(g+1)<<16|a.charCodeAt(g+2)<<8|a.charCodeAt(g+3),v.push(h);switch(u%4){case 0:g=2147483648;break;case 1:g=8388608|a.charCodeAt(u-1)<<24;break;case 2:g=32768|(a.charCodeAt(u-2)<<24|a.charCodeAt(u-1)<<16);break;case 3:g=128|(a.charCodeAt(u-3)<<24|a.charCodeAt(u-2)<<16|a.charCodeAt(u-1)<<8)}for(v.push(g);14!=v.length%16;)v.push(0);for(v.push(u>>>29),v.push(4294967295&u<<3),f=0;f<v.length;f+=16){for(g=0;16>g;g++)i[g]=v[f+g];for(g=16;79>=g;g++)i[g]=b(i[g-3]^i[g-8]^i[g-14]^i[g-16],1);for(o=j,p=k,q=l,r=m,s=n,g=0;19>=g;g++)t=4294967295&b(o,5)+(p&q|~p&r)+s+i[g]+1518500249,s=r,r=q,q=b(p,30),p=o,o=t;for(g=20;39>=g;g++)t=4294967295&b(o,5)+(p^q^r)+s+i[g]+1859775393,s=r,r=q,q=b(p,30),p=o,o=t;for(g=40;59>=g;g++)t=4294967295&b(o,5)+(p&q|p&r|q&r)+s+i[g]+2400959708,s=r,r=q,q=b(p,30),p=o,o=t;for(g=60;79>=g;g++)t=4294967295&b(o,5)+(p^q^r)+s+i[g]+3395469782,s=r,r=q,q=b(p,30),p=o,o=t;j=4294967295&j+o,k=4294967295&k+p,l=4294967295&l+q,m=4294967295&m+r,n=4294967295&n+s}var t=d(j)+d(k)+d(l)+d(m)+d(n);return t.toLowerCase()}