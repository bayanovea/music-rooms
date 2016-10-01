// 
Template.roomPage.onRendered(function() {
    var callData = {
        "roomId": Router.current().params._id
    };

    Meteor.call('roomEnterUser', callData, function(error, data) {
        if (error) {
            throwError(error.reason);
            return false;
        }


        if (data !== undefined) {
            var curTrackItem = $('.track-item[data-id="' + data.curTrackId + '"]');
            var curTrackName = curTrackItem.find('.track-item__name').text();
            var curTrackPlayButton = curTrackItem.find('.track-item__play-button');
            var sound = new buzz.sound("/sounds/" + curTrackName);

            sound.setTime(data.curTrackTime + 1);
            sound.play();
            curTrackPlayButton.addClass('track-item__play-button--pause');
        }
    });
});

// Events
Template.roomPage.events({
    // Клик на трэк
    'click .track-item': function(e) {
        e.preventDefault();

        var callData = {
            "trackId": $(e.currentTarget).attr('data-id'),
            "roomId": Router.current().params._id
        };

        var trackName = $(e.currentTarget).find('.track-item__name').text();

        // Поставить на паузу трэк
        if ($(e.currentTarget).find('.track-item__play-button').hasClass('track-item__play-button--pause')) {
            console.log('roomPauseTrack');

            Meteor.call('roomPauseTrack', callData, function(error, data) {
                var trackPlayButton = $(e.currentTarget).find('.track-item__play-button');

                trackPlayButton.removeClass('track-item__play-button--pause');
                buzz.all().stop();

                console.log(data);
            });
        }
        // Играть трэк
        else {
            Meteor.call('roomPlayTrack', callData, function(error, data) {
                if (error) {
                    throwError(error.reason);
                    return false;
                }

                var trackPlayButton = $(e.currentTarget).find('.track-item__play-button');
                var trackPlayButtons = $(e.currentTarget).siblings('.track-item').find('.track-item__play-button');
                var sound = new buzz.sound("/sounds/" + trackName);

                // Переключаем кнопки "играть"
                trackPlayButtons.removeClass('track-item__play-button--pause');
                trackPlayButton.addClass('track-item__play-button--pause');

                // Запускаем нужную песню
                buzz.all().stop();
                sound.play();

            });
        }
    }
});