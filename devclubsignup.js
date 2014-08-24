Students = new Meteor.Collection('students');


if (Meteor.isClient) {

    studentsSub = Meteor.subscribe('students');



    Template.register.events = {
        'click input[type=submit]': function(event) {
            event.preventDefault();

            alert("hi");

            length = 6;
            chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

            result = '';
            for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];

            var firstName =  $('#first_name').val();
            var lastName =  $('#last_name').val();
            var email =  $('#email').val()
            var referralCode =  $('#referralCode').val();
            var inviteCode =  result;
          

            if (!firstName || !lastName|| !email || !referralCode) {
                alert('Please fill in all fields');
            } else {
                alert('Your invite code is' + inviteCode);
                Students.insert({
                  created_at: new Date,
                  firstName: firstName,
                  lastName: lastName,
                  email: email,
                  referralCode: referralCode,
                  inviteCode: inviteCode
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
                    Router.go('/mynotes');
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

    
}

if (Meteor.isServer) {

    Meteor.startup(function() {


    });

    Meteor.publish('students', function() {
        return Students.find({}, {
            sort: {
                created_at: 1
            }
        });
    });


    Accounts.onCreateUser(function(options, user) {
        return user;
    })

    Meteor.methods({

    })

}