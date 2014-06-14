/*
 * index.js
*/

/*jslint        node   : true, continue : true,
 devel  : true, indent : 2,    maxerr   : 50,
 newcap : true, nomen  : true, plusplus : true,
 regexp : true, sloppy : true, vars     : false,
 white  : true
*/

/*global */

// ----- BEGIN MODULE SCOPE VARIABLES -----
'use strict';
var
 express  	= require( 'express' ),
 app		= express(),
 http 		= require( 'http' ),
 server 	= http.createServer( app ),
 io			= require( 'socket.io' ).listen( server ),
 port 		= Number( process.env.PORT || 3000 ),
 emitNotification,
 chateeList = [],
 userCpt = 0;

// ----- END MODULE SCOPE VARIABLES -----

// ----- BEGIN UTILITY METHODS -----
emitNotification = function ( msg ) {
	io.emit( 'notificationmessage', { message : msg } );
};
// ----- END UTILITY METHODS -----

// ----- BEGIN SERVER CONFIGURATION -----
app.use( express.static( __dirname + '/public' ) );

app.get( '/', function( req, res ) {
	res.sendfile( 'webchat.html' );
});

io.on( 'connection', function ( socket ) {
	socket.user_name = 'user' + userCpt++;
	chateeList.push( socket.user_name );
	emitNotification( socket.user_name + ' has joined the chat.' );

	socket.on( 'disconnect', function () {
		var idx = chateeList.indexOf( socket.user_name );
		chateeList.splice(idx, 1);
	});

	socket.on( 'chatmessage', function ( msg ) {
		console.log( '%s sent : %s', socket.user_name, msg);
		io.emit( 'chatmessage', { user_name : socket.user_name,  message : msg } );
	});

	socket.on( 'changeusername', function ( user_name ) {
		var 
		 old_name = socket.user_name,
		 new_name = user_name,
		 idx;

		socket.user_name = user_name;
		idx = chateeList.indexOf( old_name );
		chateeList.splice( idx, 1 );
		chateeList.push( new_name );
		emitNotification( old_name + ' change to ' + new_name );
	});

	socket.on( 'listchatee', function () {
		io.emit( 'listchatee', { chateeList : chateeList });
	});
});

server.listen( port, function () {
	console.log( 'listening on : %s', server.address().port );
});
// ----- END SERVER CONFIGURATION -----