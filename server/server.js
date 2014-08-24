Students = new Meteor.Collection('students');
Confirmation = new Meteor.Collection('confirmation');//we'll secure it after everything's working


Meteor.startup(function() {


});

Meteor.publish('students', function() {//for the record, I wouldn't bother doing a subscribe for this if you're returning everything anyways
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