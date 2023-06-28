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
 * @class Popup manager class of SweetDevRia
 * @constructor
 * @private
 */ 
SweetDevRia.PopupManager = function() {
	this.registeredComp = [	"SweetDevRia.Menu",
							"SweetDevRia.Suggest",
							"SweetDevRia.Editable",
							"SweetDevRia.ClickToOpen",
							"SweetDevRia.Tooltip"];

	SweetDevRia.EventHelper.addListener(document, "click", SweetDevRia.PopupManager.hideAllComponents, this, true);
};

/**
 * get the Instance of DisplayManager.
 * @return Instance of DisplayManager.
 * @type DisplayManager object.
 */
SweetDevRia.PopupManager.getInstance = function() {
	return SweetDevRia.PopupManager._instance;
};

/**
 * Register a component which will be closed if a clic happened on the page
 */
SweetDevRia.PopupManager.prototype.registerPopupComponent = function(componentId){
	this.registeredComp[this.registeredComp.length] = componentId;
};

/**
 * Call a generic method to hide the components
 */
SweetDevRia.PopupManager.hideAllComponents = function(e){
	e = SweetDevRia.EventHelper.getEvent (e);

	for(var i in this.registeredComp){
		var comps = SweetDevRia.getInstances(this.registeredComp[i]);
		for(var j in comps){
			if( SweetDevRia.$(comps[j]) ){
				SweetDevRia.$(comps[j]).closePopup(e.src);
			}
		}
	}
};

/**
 * Singleton.
 */
SweetDevRia.PopupManager._instance = new SweetDevRia.PopupManager();