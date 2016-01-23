'use strict';

//module dependencies

exports.singleMessage = function (req, name, object) {
    var socketio = req.app.get('socketio');
    socketio.sockets.emit(name, object);
};