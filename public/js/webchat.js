/*
 * webchat.js
*/

/*jslint        node   : true, continue : true,
 devel  : true, indent : 2,    maxerr   : 50,
 newcap : true, nomen  : true, plusplus : true,
 regexp : true, sloppy : true, vars     : false,
 white  : true
*/

/*global */
var webchat = (function () {
	'use strict';
	var initModule = function ( $container ) {
		webchat.data.initModule();
		webchat.shell.initModule( $container );
	};

	return { initModule : initModule };
}());