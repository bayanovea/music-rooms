Rooms = new Mongo.Collection('rooms');
helloStream = new Meteor.Stream('hello');

helloStream.permissions.write(function(eventName) {
  var userId = this.userId;
  var subscriptionId = this.subscriptionId;
  //return true to accept and false to deny
  return true;
});

/*if (Meteor.isClient) {
    stream.on("channelName", function(message) {
      console.log("message:"+message);
    });
}*/

/*if (Meteor.isServer) {
    setInterval(function() {
      stream.emit("channelName", 'This is my message!');
    }, 1000);
}*/

var curTrackId;
var curTrackTime;
var curTrackTimer;

validateRoom = function (room) {
    var errors = {};

    if (!room.name) {
        errors.name = "Пожалуйста заполните поле";
    }

    return errors;
};

initTrackTimer = function () {
    this.curTrackTimer = setInterval(function() {
        curTrackTime = curTrackTime + 0.1;
    }, 100);
};

Meteor.methods({
    // Добавление комнаты
    roomInsert: function(roomAttributes) {
        check(roomAttributes, {
            name: String,
            password: String
        });

        var errors = validateRoom(roomAttributes);
        if (errors.name) {
            throw new Meteor.Error('invalid-room', "Некорректно заполнены поля");
        }

        var room = _.extend(roomAttributes, {
            id: incrementCounter('Room', 'id'),
            created: new Date(),
        });

        var roomId = Rooms.insert(room);

        return {
            _id: roomId
        };
    },

    // Пользователь зашел в комнату
    roomEnterUser: function(data) {
        if (curTrackId !== undefined && curTrackTime !== undefined) {
            return {
                "curTrackId": curTrackId,
                "curTrackTime": curTrackTime
            }; 
        }
    },

    // Играть песню
    roomPlayTrack: function(data) {
        var room = Rooms.findOne(data.roomId),
            tracks = room.tracks
            activeTrack = tracks.filter(function(o) {return o._id == data.trackId})[0];

        // Прошлой активной статус "new"
        Rooms.update( 
            {"_id": data.roomId, "tracks.status": "active"}, 
            {$set: {"tracks.$.status": "new"}}
        );

        // Новой активной статус "active"
        Rooms.update( 
            {"_id": data.roomId, "tracks._id": data.trackId}, 
            {$set: {"tracks.$.status": "active"}}
        );

        // Передаем информацию о новом активном трэке выше
        curTrackId = data.trackId;
        curTrackTime = (activeTrack.status === 'paused') ? activeTrack.curTime : 0

        // Инициализируем таймер
        initTrackTimer();
    },

    // Поставить песню на паузу
    roomPauseTrack: function(data) {
        // Текущему трэку статус "paused"
        Rooms.update( 
            {"_id": data.roomId, "tracks._id": data.trackId}, 
            {$set: {"tracks.$.status": "paused"}}
        );

        // Останавливаем таймер
        clearInterval(curTrackTimer);

        return 'paaaause';
    }
});
