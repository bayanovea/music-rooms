Router.configure({
    layoutTemplate: 'layout'
});

Router.map(function() {
    this.route('roomsList', {
        path: '/',
        waitOn: function () {                                                
            return Meteor.subscribe('rooms');             
        }
    });

    /*this.route(function() {
        path: '/rooms/:_id',
        data: Rooms.findOne(this.params._id)
    });*/

    this.route('roomSubmit', {
        path: '/rooms/add'
    });
});

Router.route('/room/:_id', {
    name: 'roomPage',
    waitOn: function () {                                                
        return Meteor.subscribe('rooms');             
    },
    data: function() {
        return Rooms.findOne(this.params._id);
    }
});