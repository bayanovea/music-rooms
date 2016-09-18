// On created
Template.roomSubmit.onCreated(function() {
    Session.set('roomSubmitErrors', {});
});

// Helpers
Template.roomSubmit.helpers({
    errorMessage: function(field) {
        return Session.get('roomSubmitErrors')[field];
    },
    errorClass: function (field) {
        return !!Session.get('roomSubmitErrors')[field] ? 'has-error' : '';
    }
});

// Events
Template.roomSubmit.events({
    'submit form': function(e) {
        e.preventDefault();

        var room = {
            name: $(e.target).find('[name=name]').val(),
            password: $(e.target).find('[name=password]').val() || ''
        };

        var errors = validateRoom(room);
        if (errors.name) {
            return Session.set('roomSubmitErrors', errors);
        }

        Meteor.call('roomInsert', room, function(error, result) {
            if (error)
                return throwError(error.reason);

            Router.go('roomsList');
        });
    }
});