/** ------------------------------------
 * SweetDEV RIA library
 * Copyright [2006 - 2010] [Ideo Technologies]
 * ------------------------------------
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 * For more information, please contact us at:
 * Ideo Technologies S.A
 * 124 rue de Verdun
 * 92800 Puteaux - France
 *
 * France & Europe Phone : +33 1.46.25.09.60
 * 
 *
 * web : http://www.ideotechnologies.com
 * email : Sweetdev_ria_sales@ideotechnologies.com
 *
 *
 * @version 3.5.2.1
 * @author Ideo Technologies
 */

/**
 * This is the rss reader component class
 * @param {String} id Id of this list
 * @constructor
 * @extends RiaComponent
 * @base RiaComponent
 */
SweetDevRia.Reader = function(id){
	superClass (this, SweetDevRia.RiaComponent, id, "Reader");

	//this.cssClassBase = "ideo-bdr-extraFine";
	this.groupIndex = 0;
	
	this.exclusive = false;
	
	this.managerIds = {};
	
};

extendsClass(SweetDevRia.Reader, SweetDevRia.RiaComponent);



/**
 * This method is automatically called at the page load
 * @private
 */
SweetDevRia.Reader.prototype.initialize = function () {

	if (this.pageNumber > 1) {
		this.createPageBar ();
	}

};

SweetDevRia.Reader.prototype.setData = function (data) {
	this.data = data;
};

SweetDevRia.Reader.prototype.goToPage = function (pageNumber) {	
	this.actualPage = pageNumber;
	
	var params = {};
	params ["actualPage"] = this.actualPage;
	
	SweetDevRia.ComHelper.fireEvent (new SweetDevRia.RiaEvent ("pagin", this.id, params));
};



	
SweetDevRia.Reader.prototype.createPageBar = function (){
	var pagebar = new SweetDevRia.PageBar ("pagebar_"+this.id); 
	pagebar.setPageNumber (this.pageNumber);
	pagebar.actualPage = 1;
	pagebar.linkedId = this.id;
	pagebar.showFirstLast = false;
	pagebar.renderFrame = false;
	pagebar.displayPageMode = SweetDevRia.PageBar.RESUME_MODE;
	// Debut SWTRIA-987
	pagebar.i18n["firstTitle"] 		= this.i18n["firstTitle"];
	pagebar.i18n["prevTitle"] 		= this.i18n["prevTitle"];
	pagebar.i18n["nextTitle"] 		= this.i18n["nextTitle"];
	pagebar.i18n["lastTitle"] 		= this.i18n["lastTitle"];
	pagebar.i18n["noFirstTitle"]	= this.i18n["noFirstTitle"];
	pagebar.i18n["noPrevTitle"] 	= this.i18n["noPrevTitle"];
	pagebar.i18n["noNextTitle"] 	= this.i18n["noNextTitle"];
	pagebar.i18n["noLastTitle"] 	= this.i18n["noLastTitle"];
	// Fin SWTRIA-987
	pagebar.render ();
};

SweetDevRia.Reader.prototype.onPagin = function (evt){
	if(this.exclusive) {
		// on supprime tous les anciens collapseManager qui vont etre recree.
		for (var id in this.managerIds) {	// SWTRIA-985 SWTRIA-986		
			SweetDevRia.unregister (this.managerIds [id]); // SWTRIA-985 SWTRIA-986
		}
	}

	this.data = JSON.parse(evt.data);
	this.render ();
	
	SweetDevRia.Frame.reloadAllFrames ();
};

SweetDevRia.Reader.prototype.getItemRender = function(itemData, groupIndex){
	var res = "";
	
	var itemId = itemData.id;
	var header = itemData.label;
	var tooltip = itemData.tooltip; // SWTRIA-935
	var content = itemData.content?itemData.content:itemData.children;
	var nbChildren = itemData.nbChildren; // SWTRIA-942

	// creer le collapse
	var collapse = new SweetDevRia.Collapse (this.id+"_"+itemId);
	collapse.groupIndex = groupIndex; // SWTRIA-985
	
	// SWTRIA-935
	collapse.header = (tooltip)?"<span title=\"" + tooltip.replace(/"/g,"&quot;") + "\">" + header + "</span>":header;

	collapse.renderFrame = false;
	collapse.canBeExpanded = nbChildren != 0 || content != null;
	
	if(this.exclusive) {
		var collapseManager = SweetDevRia.$ (this.id+"_manager_"+groupIndex);
		if (collapseManager == null) {
			collapseManager = new SweetDevRia.CollapseManager (this.id+"_manager_"+groupIndex);
			this.managerIds [collapseManager.id] = collapseManager;
		}

		collapseManager.addCollapse(collapse.id);
	}
	
	var reader = this;
	
	SweetDevRia.addListener (collapse, SweetDevRia.Collapse.SWAP_EVENT, SweetDevRia.Frame.reloadAllFrames, this);

	if (content == null) {
		collapse.beforeExpand = function () {
			var params = {};
			params ["itemId"] = itemId;
			
			SweetDevRia.ComHelper.fireEvent (new SweetDevRia.RiaEvent ("getItem", reader.id, params));
		};
		
		if (nbChildren > 0) { //SWTRIA-942
			collapse.bodyContent = "";
		}
	}
	else {
		if (typeof (content) == "string") {
			// final
			collapse.bodyContent = content;
		}
		else {
			var bodyContent = "";
			// appel recursif
			for (var i = 0; i < content.length; i++) {
				bodyContent += this.getItemRender (content [i], groupIndex+1);
			}

			collapse.bodyContent = bodyContent;
		}
	}

	return collapse.getRenderString (collapse.template);
};

SweetDevRia.Reader.prototype.onGetItem = function (evt){
	var itemId = evt.itemId;
	var collapse = SweetDevRia.$(this.id+"_"+itemId);
	if (evt.data) {
		var data = JSON.parse(evt.data);
		if (data.result) {
			collapse.setBodyContent (data.result);
		}
		else if (data.length) {
			var res = "";
			for (var i = 0; i < data.length; i++) {
				res += this.getItemRender (data [i], collapse.groupIndex + 1); // SWTRIA-985
			}
	
			collapse.setBodyContent (res);
		}
		
		//this.groupIndex ++; // SWTRIA-985
	
		collapse.beforeExpand  = function () { return true;};
		collapse.expand ();
		
		SweetDevRia.Frame.reloadAllFrames ();
		
		return true;
	}
};

SweetDevRia.Reader.prototype.render = function(){
	SweetDevRia.startLog ("Log.Render_"+this.id, this);

	if (this.beforeRender ()) {
		var container = this.getContainer ();
		var render = "";
		
		for(var i=0;i<this.data.length;i++){
			render += this.getItemRender (this.data[i],this.groupIndex);
		}
		
		// ajouter la barre de pagination
		
		container.innerHTML = render;
		
		this.fireEventListener (SweetDevRia.RiaComponent.RENDER_EVENT);

		this.afterRender ();
	}

	SweetDevRia.endLog ("Log.Render_"+this.id, this, 1);

};