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
* This is the Event stack component class
* A simple stack. It stores some events, defined by their types and flush return them on demand. 
* @constructor
* @extends RiaComponent
* @base RiaComponent
* @private
*/
SweetDevRia.Stack = function(){
	this.events = [];
};

/**
* Adds and event.
* @param {Object} type the key to define and recognize this event
* @param {Map} values the values associated and mandatories to process this event 
* @private
*/
SweetDevRia.Stack.prototype.addEvent = function(type, values){
	this.events.push({"type":type, "params":values});
};

/**
* Returns the events stacked into this object, without clearing them.
* @private
*/
SweetDevRia.Stack.prototype.getEvents = function(){
	return this.events;
};

/**
* Returns the events stacked into this object, and clear the list.
* @private
*/
SweetDevRia.Stack.prototype.getEventsAndClear = function(){
	var oldEvents = this.events;
	this.events = []; 
	return oldEvents;
};