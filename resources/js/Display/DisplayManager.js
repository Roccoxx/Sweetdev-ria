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
 * @class Display manager class of SweetDevRia
 * @constructor
 * @private
 */ 
SweetDevRia.DisplayManager = function() {
	/**
	 * Top ZIndex.
	 * @type int
	 */
	this.topZIndex = 0;
    SweetDevRia.EventHelper.addListener(window, "load", function(){
    		SweetDevRia.startLog ("Log.Onload",null, RiaTimer.SUM);
    		SweetDevRia.DisplayManager.getInstance()._getMaxZindex();
    		SweetDevRia.endLog ("Log.Onload");
    	});
};

/**
 * Singleton.
 */
SweetDevRia.DisplayManager._instance = new SweetDevRia.DisplayManager();

/**
 * get the Instance of DisplayManager.
 * @return Instance of DisplayManager.
 * @type DisplayManager object.
 */
SweetDevRia.DisplayManager.getInstance = function() {
	return SweetDevRia.DisplayManager._instance;
};

/**
 * Get the biggest ZIndex to be sure to be on top.
 * @return Biggest ZIndex.
 * @type int
 */
SweetDevRia.DisplayManager.prototype.getTopZIndex = function(refresh) {
	if (refresh) {
		this._getMaxZindex ();
	}

	this.topZIndex = this.topZIndex + 1;
	
	return this.topZIndex;
};

/**
 * Get the biggest ZIndex of the page.
 * @return Biggest ZIndex.
 * @type int
 */
SweetDevRia.DisplayManager.prototype.getMaxZindex = function(){
	return this.topZIndex;
};


SweetDevRia.DisplayManager.prototype.getParentZIndex = function(elem){
	if(!elem){
		SweetDevRia.log.error("Trying to get the zIndex of a null element.");
		return 0;
	}
	
	var parent = SweetDevRia.DomHelper.getParent(elem);
	if(parent == document.body || parent.style.zIndex){
		return parent.style.zIndex;
	}
	return this.getParentZIndex(parent);
};

SweetDevRia.DisplayManager.prototype._getMaxZindex = function(parent){
	var maxZIndex = 0;

	if (parent == null) {
		parent = document.body;
	}

	// srevel, le 5/15/7, probleme avec le dv englobant de la charte graphique SIG (absolute, zindex=1)
	var bodyChildren = parent.childNodes;
	var zindex = null;
	for (var i = 0; i < bodyChildren.length; i++) {
		var child = bodyChildren[i];
		if (child.nodeType == 1) { //SWTRIA-974
			zindex = YAHOO.util.Dom.getStyle(child, "zIndex");
		}

		if (zindex == null || zindex == "auto") {
			zindex = this._getMaxZindex (child);
		}
		
		if (zindex != null) {
			zindex = parseInt(zindex, 10);

			if (zindex > maxZIndex) {
				maxZIndex = zindex;
			}
		}
	}

	this.topZIndex = maxZIndex;

	return this.topZIndex;

};

/**
* @private
*/
SweetDevRia.DisplayManager.prototype.getBlankPage = function(){
	if(SweetDevRIAHttpsMode){
		return SweetDevRIAJSPPath +"/blank.html";
	}
	else{
		return "about:blank";
	}
};