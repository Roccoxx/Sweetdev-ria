/** ------------------------------------
 * SweetDEV RIA library
 * Copyright [2006 - 2010] [Ideo Technologies]
 * ------------------------------------
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * 		http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 * For more information, please contact us at:
 *         Ideo Technologies S.A
 *        124 rue de Verdun
 *        92800 Puteaux - France
 *
 *      France & Europe Phone : +33 1.46.25.09.60
 *
 *
 *        web : http://www.ideotechnologies.com
 *        email : SweetDEV-RIA@ideotechnologies.com
 *
 *
 * @version 3.5.2.1
 * @author Ideo Technologies
 */

/**
 * @class key listener of SweetDevRia
 * @constructor
 * @private
 */ 
SweetDevRia.KeyListener = function(id) {
	if (id) {
		this.base = SweetDevRia.EventManager;
		this.base (id);
	
		SweetDevRia.EventHelper.addListener (document, "keydown", KeyListener_handleEvent);
	}
};

SweetDevRia.KeyListener.KEY_LISTENER_ID = "__SweetDEV_RIA_KeyListener";

/**
 * Key constants
 */
SweetDevRia.KeyListener.ESCAPE_KEY 			= 27;
SweetDevRia.KeyListener.TABULATION_KEY		= 9;
SweetDevRia.KeyListener.ENTER_KEY			= 13;
SweetDevRia.KeyListener.SPACE_KEY 			= 32;
SweetDevRia.KeyListener.ARROW_LEFT_KEY		= 37;
SweetDevRia.KeyListener.ARROW_UP_KEY		= 38;
SweetDevRia.KeyListener.ARROW_RIGHT_KEY		= 39;
SweetDevRia.KeyListener.ARROW_DOWN_KEY		= 40;

SweetDevRia.KeyListener.ARROW_HOME_KEY		= 36;
SweetDevRia.KeyListener.ARROW_END_KEY		= 35;
SweetDevRia.KeyListener.PGUP_KEY 			= 33;
SweetDevRia.KeyListener.PGDOWN_KEY			= 34;

SweetDevRia.KeyListener.STAR_KEY 			= 106;
SweetDevRia.KeyListener.STAR_KEY_SHIFT 		= 220;
SweetDevRia.KeyListener.MINUS_KEY 			= 109;
SweetDevRia.KeyListener.PLUS_KEY 			= 107;
SweetDevRia.KeyListener.X_KEY 				= 88;
SweetDevRia.KeyListener.C_KEY 				= 67;
SweetDevRia.KeyListener.V_KEY 				= 86;
SweetDevRia.KeyListener.INSERT_KEY 			= 45;
SweetDevRia.KeyListener.DELETE_KEY 			= 46;
SweetDevRia.KeyListener.F2_KEY 				= 113;
SweetDevRia.KeyListener.F4_KEY 				= 115;
SweetDevRia.KeyListener.F5_KEY 				= 116;
SweetDevRia.KeyListener.F6_KEY 				= 117;
SweetDevRia.KeyListener.F7_KEY 				= 118;

SweetDevRia.KeyListener.SHIFT_KEY 			= 16;
SweetDevRia.KeyListener.CTRL_KEY 			= 17;
SweetDevRia.KeyListener.ALT_KEY 			= 18;
SweetDevRia.KeyListener.VMAJ_KEY 			= 20;

SweetDevRia.KeyListener.A_KEY 				= 65;
SweetDevRia.KeyListener.N_KEY 				= 78;


SweetDevRia.KeyListener.prototype = new SweetDevRia.EventManager;
SweetDevRia.KeyListener._instance = new SweetDevRia.KeyListener (SweetDevRia.KeyListener.KEY_LISTENER_ID);
SweetDevRia.KeyListener.getInstance = function () {
	return SweetDevRia.KeyListener._instance;
};

/**
* Do NOT modify or events wont be triggered
* @private KeyListener
*/
function KeyListener_handleEvent(evt) {
	if (!evt || !evt.keyCode) {
		SweetDevRia.log.warn("Event or keyCode is null");
		return;
	}

	switch(evt.keyCode) {
		case SweetDevRia.KeyListener.ESCAPE_KEY: 
		case SweetDevRia.KeyListener.SPACE_KEY:
		case SweetDevRia.KeyListener.ARROW_LEFT_KEY:
		case SweetDevRia.KeyListener.ARROW_UP_KEY:
		case SweetDevRia.KeyListener.ARROW_RIGHT_KEY:
		case SweetDevRia.KeyListener.ARROW_DOWN_KEY:
		case SweetDevRia.KeyListener.STAR_KEY:
		case SweetDevRia.KeyListener.STAR_KEY_SHIFT:
		case SweetDevRia.KeyListener.MINUS_KEY:
		case SweetDevRia.KeyListener.PLUS_KEY:
		case SweetDevRia.KeyListener.ENTER_KEY:
		case SweetDevRia.KeyListener.INSERT_KEY:
		case SweetDevRia.KeyListener.DELETE_KEY:
		case SweetDevRia.KeyListener.F2_KEY:
			SweetDevRia.KeyListener.getInstance().fireEvent(new SweetDevRia.RiaEvent(SweetDevRia.RiaEvent.KEYBOARD_TYPE, this.id, {"srcEvent" : evt, "keyCode": evt.keyCode, "alt": evt.altKey, "ctrl": evt.ctrlKey, "shift": evt.shiftKey}));
			break;
		default :
			break;
	}
	if ((evt.keyCode == SweetDevRia.KeyListener.X_KEY && evt.ctrlKey) || (evt.keyCode == SweetDevRia.KeyListener.DELETE_KEY && evt.shiftKey)) {
		SweetDevRia.KeyListener.getInstance().fireEvent(new SweetDevRia.RiaEvent(SweetDevRia.RiaEvent.CUT_TYPE, this.id, {"srcEvent" : evt}));
	} else if ((evt.keyCode == SweetDevRia.KeyListener.C_KEY && evt.ctrlKey) || (evt.keyCode == SweetDevRia.KeyListener.INSERT_KEY && evt.ctrlKey)) {
		SweetDevRia.KeyListener.getInstance().fireEvent(new SweetDevRia.RiaEvent(SweetDevRia.RiaEvent.COPY_TYPE, this.id, {"srcEvent" : evt}));
	} else if ((evt.keyCode == SweetDevRia.KeyListener.V_KEY && evt.ctrlKey) || (evt.keyCode == SweetDevRia.KeyListener.INSERT_KEY && evt.shiftKey)) {
		SweetDevRia.KeyListener.getInstance().fireEvent(new SweetDevRia.RiaEvent(SweetDevRia.RiaEvent.PASTE_TYPE, this.id, {"srcEvent" : evt}));
	} else if (evt.keyCode == SweetDevRia.KeyListener.F4_KEY && evt.ctrlKey && evt.shiftKey) {
		SweetDevRia.KeyListener.getInstance().fireEvent(new SweetDevRia.RiaEvent(SweetDevRia.RiaEvent.CLOSE_WINDOW_TYPE, this.id, {"srcEvent" : evt}));
	} else if (evt.keyCode == SweetDevRia.KeyListener.F5_KEY && evt.ctrlKey && evt.shiftKey) {
		SweetDevRia.KeyListener.getInstance().fireEvent(new SweetDevRia.RiaEvent(SweetDevRia.RiaEvent.MAXIMIZE_WINDOW_TYPE, this.id, {"srcEvent" : evt}));
	} else if (evt.keyCode == SweetDevRia.KeyListener.F6_KEY && evt.ctrlKey && evt.shiftKey) {
		SweetDevRia.KeyListener.getInstance().fireEvent(new SweetDevRia.RiaEvent(SweetDevRia.RiaEvent.MINIMIZE_WINDOW_TYPE, this.id, {"srcEvent" : evt}));
	} else if (evt.keyCode == SweetDevRia.KeyListener.F7_KEY && evt.ctrlKey && evt.shiftKey) {
		SweetDevRia.KeyListener.getInstance().fireEvent(new SweetDevRia.RiaEvent(SweetDevRia.RiaEvent.RESTORE_WINDOW_TYPE, this.id, {"srcEvent" : evt}));
	} else if (evt.keyCode == SweetDevRia.KeyListener.A_KEY && evt.ctrlKey) {
		SweetDevRia.KeyListener.getInstance().fireEvent(new SweetDevRia.RiaEvent(SweetDevRia.RiaEvent.SELECT_ALL, this.id, {"srcEvent" : evt}));
	}

}

/**
* Return the event type corresponding to the current event, of -1 if none are register for this key combinaison, or null if the event parameter is null
* @param {HTMLEvent} evt the event to analyze
* @return the event type for this event
* @type 
* @private
*/
SweetDevRia.KeyListener.getEventType = function(evt) {
	if (!evt || !evt.keyCode) {
		SweetDevRia.log.warn("Event or keyCode is null");
		return null;
	}	

	switch(evt.keyCode) {
		case SweetDevRia.KeyListener.ESCAPE_KEY: 
		case SweetDevRia.KeyListener.SPACE_KEY:
		case SweetDevRia.KeyListener.ARROW_LEFT_KEY:
		case SweetDevRia.KeyListener.ARROW_UP_KEY:
		case SweetDevRia.KeyListener.ARROW_RIGHT_KEY:
		case SweetDevRia.KeyListener.ARROW_DOWN_KEY:
		case SweetDevRia.KeyListener.STAR_KEY:
		case SweetDevRia.KeyListener.STAR_KEY_SHIFT:
		case SweetDevRia.KeyListener.MINUS_KEY:
		case SweetDevRia.KeyListener.PLUS_KEY:
		case SweetDevRia.KeyListener.ENTER_KEY:
		case SweetDevRia.KeyListener.INSERT_KEY:
		case SweetDevRia.KeyListener.DELETE_KEY:
		case SweetDevRia.KeyListener.F2_KEY:
			return SweetDevRia.RiaEvent.KEYBOARD_TYPE;
		default :
			break;
	}
	if ((evt.keyCode == SweetDevRia.KeyListener.X_KEY && evt.ctrlKey) || (evt.keyCode == SweetDevRia.KeyListener.DELETE_KEY && evt.shiftKey)) {
		return SweetDevRia.RiaEvent.CUT_TYPE;
	} else if ((evt.keyCode == SweetDevRia.KeyListener.C_KEY && evt.ctrlKey) || (evt.keyCode == SweetDevRia.KeyListener.INSERT_KEY && evt.ctrlKey)) {
		return SweetDevRia.RiaEvent.COPY_TYPE;
	} else if ((evt.keyCode == SweetDevRia.KeyListener.V_KEY && evt.ctrlKey) || (evt.keyCode == SweetDevRia.KeyListener.INSERT_KEY && evt.shiftKey)) {
		return SweetDevRia.RiaEvent.PASTE_TYPE;
	} else if (evt.keyCode == SweetDevRia.KeyListener.F4_KEY && evt.ctrlKey && evt.shiftKey) {
		return SweetDevRia.RiaEvent.CLOSE_WINDOW_TYPE;
	} else if (evt.keyCode == SweetDevRia.KeyListener.F5_KEY && evt.ctrlKey && evt.shiftKey) {
		return SweetDevRia.RiaEvent.MAXIMIZE_WINDOW_TYPE;
	} else if (evt.keyCode == SweetDevRia.KeyListener.F6_KEY && evt.ctrlKey && evt.shiftKey) {
		return SweetDevRia.RiaEvent.MINIMIZE_WINDOW_TYPE;
	} else if (evt.keyCode == SweetDevRia.KeyListener.F7_KEY && evt.ctrlKey && evt.shiftKey) {
		return SweetDevRia.RiaEvent.RESTORE_WINDOW_TYPE;
	} else if (evt.keyCode == SweetDevRia.KeyListener.A_KEY && evt.ctrlKey) {
		return SweetDevRia.RiaEvent.SELECT_ALL;
	}
	return -1;
};