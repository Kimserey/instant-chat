/*
 * webchat.shell.js
*/

/*jslint        browser   : true, continue : true,
 devel  : true, indent    : 2,    maxerr   : 50,
 newcap : true, nomen     : true, plusplus : true,
 regexp : true, sloppy    : true, vars     : false,
 white  : true, todo      : true
*/

/*global $, webchat */

webchat.shell = (function () {
	// ----- BEGIN MODULE SCOPE VARIABLES -----
	'use strict';
	var
	 main_html = String()
	 	+ '<div class="webchat-logs">'
	 		+ '<ul id="messages" class="webchat-messages"></ul>'
	 	+ '<div>'
		+ '<form action="">'
			+ '<input id="m" autocomplete="off" /><button>Send</button>'
 		+ '</form>',
	 stateMap = {},
	 jqueryMap = {},

	onFormSubmitted, onMessageReceived, 
	onNotificationReceived, onListchateeReceived,

	sio, setJqueryMap, clearMessages, initModule;
	 
	// ----- END MODULE SCOPE VARIABLES -----
	
	// ----- BEGIN DOM METhODS -----
	// Begin DOM method /setJqueryMap/
	setJqueryMap = function () {
		var $container = stateMap.$container;

		jqueryMap = {
			$container 		: $container,
			$messagelist 	: $( '#messages' ),
			$input 			: $( '#m' ),
			$form 			: $( 'form' ),
			$messagelogs 	: $( '.webchat-logs' )
		};
	};
	// End DOM method /setJqueryMap/

	// Begin DOM method /clearMessages/
	clearMessages = function () {
		var $message_list = jqueryMap.$messagelist;
		$message_list.empty();
	};
	// End DOM method /clearMessages/
	// ----- END DOM METHODS -----

	// ----- BEGIN EVENT HANDLERS METHODS -----
	onFormSubmitted = function () {
		var 
		 new_name,
		 $input = jqueryMap.$input,
		 sio    = webchat.data.getSio(),
		 msg 	= $input.val();

		if ( msg.length > 0 ) {
			if ( msg.indexOf( '/user' ) === 0 ) {
				new_name = msg.split(' ')[1];
				sio.emit( 'changeusername', new_name );
			}
			else if ( msg.indexOf( '/list' ) === 0 ) {
				sio.emit( 'listchatee', {} );
			}
			else if ( msg.indexOf( '/clear' ) === 0) {
				clearMessages();
			}
			else {
				sio.emit( 'chatmessage', msg );
			}
			$input.val( '' );
			$input.focus();
		}
		
		return false;
	};

	// Begin /onMessageReceived/ event handler
	// Summary : 
	//  Handle <chatmessage> emitted from the server and 
	//  display message to all chatees.
	// Arguments : 
	//  arg_list:array
	//   - [0] chat_message { user_name:string, message:string }
	// Action :
	//  Append new message to chat
	// Throw : none
	// Return : none
	//
	onMessageReceived = function ( arg_list ) {
		var 
		 chat_message 	= arg_list[0],
		 user_name 		= chat_message.user_name,
		 message 		= chat_message.message,
		 $message_list  = jqueryMap.$messagelist,
		 $message_logs  = jqueryMap.$messagelogs;

		$message_list
		 .append( $( '<li>' ).html( 
		 	'<span class="webchat-messages-username">' 
		 	 + user_name 
		 	+ ' said : </span>'  
		 	+ message ) );

		// TODO : Bug - After message received set
		//               the scroll bar position to
		//               the last message received
		//
		// $message_logs.animate(
		// 	{ scrollTop : $message_logs.prop( 'scrollHeight' )
		// 		- $message_logs.height()
		// 	},
		// 	150
		// );
	};
	// End /onMessageReceived/ event handler

	// Begin /onNotificationReceived/ event handler
	// Summary : 
	//  Handle <notificationmessage> emitted by the server and 
	//  display notification message to all chatees.
	// Argument :
	//  arg_list:array
	//   - [0] notification_message { message:string }
	// Action :
	//  Append new notification to chat
	// Throw : none
	// Return : none
	//
	onNotificationReceived = function ( arg_list ) {
		var
		 notification_message = arg_list[0],
		 message = notification_message.message;

		jqueryMap
		 .$messagelist
		 .append( $( '<li>' ).addClass( 'webchat-messages-notification' ).text( message ) );
	};
	// End /onNotificationReceived/ event handler

	// Begin /onListchateeReceived/ event handler
	// Summary :
	//  Handle <listchatee> emitted by the server and
	//  display all chatee names.
	// Argument :
	//  arg_list:array
	//   - [0] chatee_list { chateeList:array }
	// Action :
	//  Display all chatee names on the chat
	// Throw : none
	// Return : none
	//
	onListchateeReceived = function ( arg_list ) {
		var
		 chatee_list =  arg_list[0].chateeList;

		jqueryMap
		 .$messagelist
		 .append( $( '<li>' )
		 			.addClass( 'webchat-messages-notification' )
		 			.text( 'List : ' + chatee_list.join( ' ~ ' ) )
		 		);
	};
	// End /onListChateeReceived/ event handler
	// ----- END EVENT HANDLERS METHODS -----
	
	// ----- BEGIN MODULE INITIALIZATION -----
	initModule = function ( $container ) {
		stateMap.$container = $container;
		$container.html( main_html );
		setJqueryMap();

		webchat.data.initModule();
		sio = webchat.data.getSio();
		jqueryMap.$input.focus();
		
		// Show command list on first load
		onNotificationReceived( [
			{ message : 'Welcome to my webchat ! (/user xx : change username ~ /list : show online users  ~ /clear : clear tchat)' }
		]);

		// Register UI events
		jqueryMap.$form.submit( onFormSubmitted );

		// Register socket handlers
		sio.on( 'chatmessage', onMessageReceived );
		sio.on( 'notificationmessage', onNotificationReceived );
		sio.on( 'listchatee', onListchateeReceived );
	};
	// ----- END MODULE INITIALIZATION -----

	return {
		initModule : initModule
	};
}());