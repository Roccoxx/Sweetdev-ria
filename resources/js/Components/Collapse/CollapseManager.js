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
* This is the Collapse Manager component class 
* @param {String} id Id of this collapse manager
* @constructor
* @extends RiaComponent
* @base RiaComponent
*/
SweetDevRia.CollapseManager = function(id){
	superClass (this, SweetDevRia.RiaComponent, id, "CollapseManager");

	this.collapseIds = [];

};

extendsClass(SweetDevRia.CollapseManager, SweetDevRia.RiaComponent);

/**
 * This method is called automatically at the page load
 * @private
 */
SweetDevRia.CollapseManager.prototype.initialize = function () {
	for (var i = 0; i < this.collapseIds.length; i++) {
		var collapse = SweetDevRia.$ (this.collapseIds [i]);
		if (collapse && (! collapse.collapseManager || collapse.collapseManager.id != this.id)) {
			collapse.collapseManager = this;

			SweetDevRia.addListener (collapse, SweetDevRia.Collapse.EXPAND_EVENT, SweetDevRia.Collapse.prototype.collapseAllOthers, collapse);
		}
	}
};

/**
 * Close all others collapses managed by this manager !
 * @private
 */
SweetDevRia.Collapse.prototype.collapseAllOthers = function () {
	if(this.collapseManager){
		for (var i = 0; i < this.collapseManager.collapseIds.length; i++) {
			var collapseId = this.collapseManager.collapseIds [i];
			if (collapseId != this.id) {
			var collapse = SweetDevRia.$ (collapseId);
				if (collapse) {
					collapse.collapse ();
				}
			}
		}
	}
};

/**
 * Add a collapse to this manager 
 * @param {String} collapseId The identifiant of the new collapse to manage
 */
SweetDevRia.CollapseManager.prototype.addCollapse = function (collapseId) {
	this.collapseIds.add (collapseId);
	
	var collapse = SweetDevRia.$ (collapseId);
	if (collapse) {
		collapse.collapseManager = this;

		SweetDevRia.addListener (collapse, SweetDevRia.Collapse.EXPAND_EVENT, SweetDevRia.Collapse.prototype.collapseAllOthers, collapse);
	}

	
	
};

