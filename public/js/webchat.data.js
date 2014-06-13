/*
 * webchat.data.js
*/

/*jslint        node   : true, continue : true,
 devel  : true, indent : 2,    maxerr   : 50,
 newcap : true, nomen  : true, plusplus : true,
 regexp : true, sloppy : true, vars     : false,
 white  : true
*/

/*global io, webchat */

webchat.data = (function () {
	// ----- BEGIN MODULE SCOPE VARIABLES -----
	'use strict';
	var
	 stateMap = { sio : null },
	 getSio, makeSio, initModule; 
	// ----- END MODULE SCOPE VARIABLES -----
	
	// ----- BEGIN PUBLIC METHODS -----
	makeSio = function () {
		var socket = io();

		return {
			emit : function ( message_name, data ) {
				socket.emit( message_name, data );
			},
			on : function ( message_name, callback ) {
				socket.on( message_name, function () {
					callback( arguments );
				});
			}
		};
	};

	getSio = function () {
		if ( ! stateMap.sio ) { stateMap.sio = makeSio(); }

		 return stateMap.sio;
	};
	// ----- END PUBLIC METHODS -----
	
	// ----- BEGIN MODULE INITIALIZATION -----
	initModule = function () {};

	return {
		getSio : getSio,
		initModule : initModule
	};
	// ----- END MODULE INITIALIZATION -----
}());