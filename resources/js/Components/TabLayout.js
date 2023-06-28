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
* Tab Layout component class 
* @class TabLayout
* @constructor
* @param {String} id 	The id of the tab layout
* @private
* @extends RiaComponent
* @base RiaComponent
*/
SweetDevRia.TabLayout = function(id){
	if(id){
		superClass (this, SweetDevRia.RiaComponent, id, "SweetDevRia.TabLayout");
		this.id = id;
		
		this.activeTab = null;
		this.tabs = [];
		this.tabsOrder = [];
		
		this.isLoadingTab = false;
		
		this.orderTab = true;
		
		// shortHeaderMod display a short version of the header
		this.shortHeaderMod = false;
		// length of tab text headers when short header mod is used
		this.shortHeaderTextLength = 3;
		// postfix after tab text headers when short header mod is used
		this.shortHeaderTextPostfix = ".."
	}
};

extendsClass(SweetDevRia.TabLayout, SweetDevRia.RiaComponent);

/**
 * This method is called before a tab activation
 * To be overridden !!
 * @param {String} tabId tab identifiant
 */
SweetDevRia.TabLayout.prototype.beforeActivateTab = function(tabId){ /* override this */ return true;};

/**
 * This method is called after a tab activation
 * To be overridden !!
 * @param {String} tabId tab identifiant
 */
SweetDevRia.TabLayout.prototype.afterActivateTab = function(tabId){ /* override this */ };


/**
 * This event type is fired when the window is closed
 * @static
 */
SweetDevRia.TabLayout.ACTIVE_EVENT = "active";


SweetDevRia.TabLayout.ORIENTATION_TOP = "top";
SweetDevRia.TabLayout.ORIENTATION_BOTTOM = "bottom";
SweetDevRia.TabLayout.ORIENTATION_LEFT = "left";
SweetDevRia.TabLayout.ORIENTATION_RIGHT = "right";

SweetDevRia.TabLayout.prototype.initialize = function(){

	if(this.selectOnLoadId){
		this.activateTabId(this.selectOnLoadId);
	}
	
	if(this.orderTab){
		new SweetDevRia.DD ("headerMain_dropZone");
		SweetDevRia.$("headerMain_dropZone").setDragId (this.id+"_headers_container");
		SweetDevRia.$("headerMain_dropZone").group = "headers";
		SweetDevRia.$("headerMain_dropZone").canDrag = false;
	}
	
	var tablayout = this;
	
	var menu = new SweetDevRia.ContextMenu(this.id+"_menu");
	menu.targetId = this.id+"_headers_container";
	
	/*var menuAddNode = new SweetDevRia.MenuItem(this.id + "menuAddNode");
	menuAddNode.label = 'addNodeMenu';
	menuAddNode.checkbox = false;
	menuAddNode.checked = false;
	//TODO bmoyet Ajouter la conf can Add
	menuAddNode.disabled = false;
	menuAddNode.image = null ;
	menuAddNode.onclick = function(){grid.addEventAction ();};
	menuAddNode.oncheck = function(){};
	menuAddNode.onuncheck = function(){};

	menu.addItem(menuAddNode);

	var menuModifyNode = new SweetDevRia.MenuItem(this.id + "menuModifyNode");
	menuModifyNode.label = 'editNodeMenu';
	menuModifyNode.checkbox = false;
	menuModifyNode.checked = false;
	menuModifyNode.disabled = false;
	menuModifyNode.image = null ;
	menuModifyNode.onclick = function(){grid.modifyEventAction ();};
	menuModifyNode.oncheck = function(){};
	menuModifyNode.onuncheck = function(){};

	menu.addItem(menuModifyNode);*/
	
	var menuDeleteTab = new SweetDevRia.MenuItem(tablayout.id + "_menuDeleteTab");
	menuDeleteTab.label = 'Delete this tab';
	menuDeleteTab.checkbox = false;
	menuDeleteTab.checked = false;
	menuDeleteTab.disabled = false;
	menuDeleteTab.image = null ;
	menuDeleteTab.onclick = function(){tablayout.removeTabId(menu.tabId);};
	menuDeleteTab.oncheck = function(){};
	menuDeleteTab.onuncheck = function(){};

	menu.addItem(menuDeleteTab);

	var style = "ideo-tbl-tabHeader-"+this.orientation;
	
	menu.beforeShow = function (e){
		e = SweetDevRia.EventHelper.getEvent (e);

		var src = e.src;
		while (! SweetDevRia.DomHelper.hasClassName(src, style) && src != document.body) {
			src = src.parentNode;
		}

		if (SweetDevRia.DomHelper.hasClassName(src, style)) {
			var srcId = src.id;
			
			menu.tabId = src.id.split("_headerMain")[0];
		}
		else{
			menu.tabId = null;
		}
		
		SweetDevRia.EventHelper.stopPropagation(e);

		return true;  
	};	
	
	menu.afterShow = function(e){
		if(menu.tabId){
			SweetDevRia.$(tablayout.id+"_menuDeleteTab").setDisabled(false);
		}
		else{
			SweetDevRia.$(tablayout.id+"_menuDeleteTab").setDisabled(true);
		}
	};
	
	// create menu !
	menu.render ();
	
	SweetDevRia.init();	
};

/**
* Activates a tab id for this tab layout
* @param {String} tabId the tab id to activate
*/
SweetDevRia.TabLayout.prototype.activateTabId = function(tabId){

	if(this.activeTabId == tabId){
		return;
	}
	
	if(this.beforeActivateTab(tabId)){
	
		var activateTab = this.getTab(tabId);
		
		if(!this.isTabActivable(activateTab)){
			return;
		}

		if(!activateTab.loaded){
			this.loadTab(activateTab);
		}else{
			this.showHide(tabId, this.activeTabId);
		}
		
		var riaEvent = new SweetDevRia.RiaEvent ("selectTab", this.id, {"id":tabId});
		SweetDevRia.ComHelper.fireEvent (riaEvent, true); // Appel synchrone 
		
		this.fireEventListener (SweetDevRia.TabLayout.ACTIVE_EVENT, tabId);

		this.afterActivateTab(tabId);
	}
};

/**
* Adds a tab to this tab layout
* @param {TabContent} tab the tab content, previsouly created to add
* @throw exception if the tab can't be added
*/
SweetDevRia.TabLayout.prototype.addTab = function(tab){
	if(!tab.url && !tab.asIframe){
		SweetDevRia.log.error('The dynamic add of a tab is only provided for iframe urls');
		throw('The dynamic add of a tab is only provided for iframe urls');
	}
	this.registerTab(tab);
	try {
		this.addHeaderView(tab);
	}
	catch (error) {
		this.unregisterTab(tab);
		// SWTRIA-1291
		if (error=="TooMuchTabs") {
			SweetDevRia.log.error('Tab width is greater than layout width');
			throw('Tab width is greater than layout width');
		}
	}
	this.addDynamicView(tab);
	
	if(tab.selected){
		this.activateTabId(tab.id);
	}
	
	var params = {"id":tab.id, 
				"enabled":tab.enabled,
				"url":tab.url,
				"asIframe":tab.asIframe,
				"selected":tab.selected,
				"removable":tab.removable,
				"label":tab.label,
				"preloaded":tab.preloaded,
				"visible":tab.visible,
				"iconClass":tab.iconClass
				};
	var riaEvent = new SweetDevRia.RiaEvent ("addTab", this.id, params);
	
	SweetDevRia.ComHelper.stackEvent(riaEvent);
};

/**
* Removes a tab id from this tab layout
* @param {String} tabId the tab id to remove
*/
SweetDevRia.TabLayout.prototype.removeTabId = function(tabId){
	var tab = this.getTab(tabId);
	if(!tab){
		SweetDevRia.log.warn("Cannot remove the unknown tab id:"+tabId);
		return;
	}
	
	if(!tab.enabled){
		SweetDevRia.log.debug("Remove cancelled due to disabled tab:"+tab.id);
		return;
	}
	
	if(this.getVisibleTabNumber()<=1){
		SweetDevRia.log.debug("Remove cancelled due to last tab present:"+tab.id);
		return;
	}
	
	if(tab.selected){
		this.activateBetterTab(tab);
	}
	
	var params = {"id":tab.id};
	var riaEvent = new SweetDevRia.RiaEvent ("removeTab", this.id, params);
	
	SweetDevRia.ComHelper.stackEvent(riaEvent);

	this.removeHeaderView(tab);
	this.removeContentView(tab);
	this.unregisterTab(tab);
};

/**
* Activates the better tab around the one given in parameter
* @param {TabContent} tab the tab active currently
*/
SweetDevRia.TabLayout.prototype.activateBetterTab = function(tab){
	if(this.getTabIndexForId(tab.id) == (this.getTabNumber()-1)){
		this.activatePreviousTab();
	}else{
		this.activateNextTab();
	}
};

/**
* Activates the tab on the left side of the one currently active
*/
SweetDevRia.TabLayout.prototype.activatePreviousTab = function(){
	this.activateTabId(this.getPreviousActivableTabId(this.activeTabId));	
};

/**
* Activates the tab on the right side of the one currently active
*/
SweetDevRia.TabLayout.prototype.activateNextTab = function(){
	this.activateTabId(this.getNextActivableTabId(this.activeTabId));	
};

/**
* Return the total number of tabs of this layout, independently from the tab status
* @type int
* @return the total number of tabs of this layout
*/
SweetDevRia.TabLayout.prototype.getTabNumber = function(){
	return this.tabs.length;
};


/**
* Return the total number of visible tabs of this layout
* @type int
* @return the total number of visible tabs of this layout
*/
SweetDevRia.TabLayout.prototype.getVisibleTabNumber = function(){
//TODO optimize by keeping a counter up to date
	var count=0;
	for(var i=0;i<this.tabs.length;++i){
		if(this.tabs[i].visible){
			count++;
		}
	}
	return count;
};

/**
* Return the next activable tab id, from the one given in parameter
* @param {String} tabId the tab id which the research start from 
* @type String
* @return the next activable tab id
*/
SweetDevRia.TabLayout.prototype.getNextActivableTabId = function(tabId){
	if(this.getVisibleTabNumber()==0){
		return null;
	}	
		
	var startIndex = this.getTabIndexForId(tabId)+1;
	var iterator; 
	for(var i=0;i<this.tabsOrder.length;++i){
		iterator = (i+startIndex)%this.tabsOrder.length;
		if( this.isTabActivable(this.tabsOrder[iterator]) ){
			return this.tabsOrder[iterator].id;
		}
	}
	return tabId;
};

/**
* Return the previous activable tab id, from the one given in parameter
* @param {String} tabId the tab id which the research start from 
* @type String
* @return the previous activable tab id
*/
SweetDevRia.TabLayout.prototype.getPreviousActivableTabId = function(tabId){
	if(this.getVisibleTabNumber()==0){
		return null;
	}	
		
	var startIndex = this.getTabIndexForId(tabId)-1;
	var iterator; 

	for(var i=0;i<this.tabsOrder.length;++i){
		iterator = (startIndex-i+this.tabsOrder.length)%this.tabsOrder.length;
		if( this.isTabActivable(this.tabsOrder[iterator]) ){
			return this.tabsOrder[iterator].id;
		}
	}
	return tabId;
};

/**
* Enable a tab id
* @param {String} tabId the tab id to enable 
*/
SweetDevRia.TabLayout.prototype.enable = function(tabId){
	var tab = this.getTab(tabId);
	
	if(!tab){
		SweetDevRia.log.warn("Cannot remove the unknown tab id:"+tabId);
		return;
	}
	
	if(!tab.enabled){
		tab.enable();
		var params = {"id":tabId, "enabled":tab.enabled};
		var riaEvent = new SweetDevRia.RiaEvent ("enableTab", this.id, params);
		
		SweetDevRia.ComHelper.stackEvent(riaEvent);
	}
};

/**
* Disable a tab id
* @param {String} tabId the tab id to disable 
*/
SweetDevRia.TabLayout.prototype.disable = function(tabId){
	var tab = this.getTab(tabId);
	
	if(!tab){
		SweetDevRia.log.warn("Cannot remove the unknown tab id:"+tabId);
		return;
	}
	
	if(tab.enabled){
		tab.disable();
		if(tab.selected){
			this.activateBetterTab(tab);
		}
		var params = {"id":tabId, "enabled":tab.enabled};
		var riaEvent = new SweetDevRia.RiaEvent ("enableTab", this.id, params);
		
		SweetDevRia.ComHelper.stackEvent(riaEvent);
	}
};

/**
* Return true if tab can be activated, false otherwise
* @param {TabContent} tab the tab content that may be activable 
* @return true if tab can be activated, false otherwise
* @type boolean
*/
SweetDevRia.TabLayout.prototype.isTabActivable = function(tab){
	return tab && tab.visible && tab.enabled;
};

/**
* Get the index in the view of a tab
* @param {String} tabId the tab id to return the index 
* @return the tab index in the view
* @type int
*/
SweetDevRia.TabLayout.prototype.getTabIndexForId = function(tabId){
	for(var i=0;i<this.tabsOrder.length;++i){
		if(this.tabsOrder[i].id == tabId){
			return i;
		}
	}
	SweetDevRia.log.error("Tab id not found:"+tabId);
	throw("Tab id not found:"+tabId);
	//return -1;
};

/**
* Get the tab id at a specific index
* @param {int} index the index to search 
* @return the tab id at a specific index
* @type String
*/
SweetDevRia.TabLayout.prototype.getTabIdForIndex = function(index){
	return this.tabsOrder[index];
};

/**
* Get the tab id at a specific index, disregard for invisible one.
* @param {int} index the index to search 
* @return the tab id at a specific index
* @type String
*/
SweetDevRia.TabLayout.prototype.getVisibleTabIdForIndex = function(index){
	var count = 0;
	
	for(var i=0;i<this.tabsOrder.length;++i){
		if(this.tabsOrder[i].visible){
			if(count==index){
				return this.tabsOrder[i];
			}else{
				count++;
			}
		}
	}
	SweetDevRia.log.error("Not enough tab found to return the :"+index+"e visible");
	return null;
};

/**
* Adds a view for a dynamically created tab.
* @param {TabContent} tab the tab to add
* @private
*/
SweetDevRia.TabLayout.prototype.addDynamicView = function(tab){
	var div = document.createElement("div");
	div.setAttribute("id", tab.id+"_container");
	div.style.display = 'none';
	div.style.height = "100%";
	
	div.innerHTML = TrimPath.processDOMTemplate(tab.templateDynamicContent, tab);

	document.getElementById(this.id+"_contents_container").appendChild(div);
};

/**
* Register a tab in this layout
* @param {TabContent} tab the tab to register
* @private
*/
SweetDevRia.TabLayout.prototype.registerTab = function(tab){
	this.tabs.add(tab);
	this.tabsOrder.add(tab);
};

/**
* Unregister a tab in this layout
* @param {TabContent} tab the tab to unregister
* @private
*/
SweetDevRia.TabLayout.prototype.unregisterTab = function(tab){
	this.tabs.remove(tab);
	this.tabsOrder.remove(tab);
};

/**
* Create a TabContent object from the properties coming from a Java object, as a JSON object
* @param {Map} properties the properties loaded by JSON from the server
* @return the tab created 
* @type TabContent
* @private
*/
SweetDevRia.TabLayout.prototype.createTabContent = function(properties){
	return new SweetDevRia.TabContent(
		properties.id,
		this,
		properties.url, 
		properties.removable, 
		properties.selected, 
		properties.asIframe, 
		properties.preloaded, 
		properties.label, 
		properties.enabled,
		properties.visible,
		properties.iconClass,
		properties.tabSize);
};

/**
* Build and registers a tab from server data
* @param {Map} properties the properties loaded by JSON from the server
* @private
*/
SweetDevRia.TabLayout.prototype.buildAndRegisterTab = function(properties){
	this.registerTab(this.createTabContent(properties));
};

/**
* Return the tab corresponding an id
* @param {String} tabId the tab id to get
* @return the tab corresponding to this id
* @type TabContent
*/
SweetDevRia.TabLayout.prototype.getTab = function(tabId){
	for(var i=0;i<this.tabs.length;++i){
		if(this.tabs[i].id == tabId){
			return this.tabs[i];
		}
	}
	return null;
};

/**
* Load an ajax tab (either iframe of div)
* @param {TabContent} tab the tab to load
* @private
*/
SweetDevRia.TabLayout.prototype.loadTab = function(tab){
	if(!tab.url || (tab.url!=undefined && !tab.asIframe)){
		this.loadDivTab(tab);
	}else{
		this.loadIframeTab(tab);
	}
};

/**
* Load an ajax tab as a div
* @param {TabContent} tab the tab to load
* @private
*/
SweetDevRia.TabLayout.prototype.loadDivTab = function(tab){
	if(this.isLoadingTab == true){
		SweetDevRia.log.debug("Loading canceled because an other one is in progress.");
		return;
	}
	this.isLoadingTab = true;
	var tabLayout = this;
	
	var zone = SweetDevRia.$(tab.id+"_zone");
	
	/*
	SweetDevRia.addListener (zone, SweetDevRia.Zone.REFRESH_EVENT, function(){//TODO factorize : single creation of this
		tabLayout.endTabLoading(tab);
		tabLayout.isLoadingTab = false;
	}, null);
	*/
	 // SWTRIA-955
	zone.callServer();
	tabLayout.endTabLoading(tab);
	tabLayout.isLoadingTab = false;
	
};

/**
* Load an ajax tab as an iframe
* @param {TabContent} tab the tab to load
* @private
*/
SweetDevRia.TabLayout.prototype.loadIframeTab = function(tab){
	document.getElementById(tab.id+"_content").src = tab.url;
	this.endTabLoading(tab);
};

/**
* Called on a load complete, meaning the tab activation switching can finally occur.
* @param {TabContent} tab the tab finally loaded
* @private
*/
SweetDevRia.TabLayout.prototype.endTabLoading = function(tab){
	this.showHide(tab.id, this.activeTabId);
	tab.loaded = true;
};

/**
* Switch two tabs visibility
* @param {String} tabShowId the tab to show
* @param {String} tabHideId the tab to hide
* @private
*/
SweetDevRia.TabLayout.prototype.showHide = function(tabShowId, tabHideId){
	if(this.getTab(tabHideId)){//maybe non existing because of a remove action 
		this.getTab(tabHideId).hide();
	}
	this.getTab(tabShowId).show();
	
	var params = {"id":tabShowId};
	var riaEvent = new SweetDevRia.RiaEvent ("selectTab", this.id, params);
	
	SweetDevRia.ComHelper.stackEvent(riaEvent);
};

/**
* Set a shortest text content for a tab header if possible
* @param {TabContent} tab the tab content to change
* @private
*/
SweetDevRia.TabLayout.prototype.toShortHeader = function(tab) {
	var elem = SweetDevRia.DomHelper.get(tab.id+"_header");
	var a = SweetDevRia.DomHelper.getFirstChild(elem, "a");
	var span = SweetDevRia.DomHelper.getFirstChild(a, "span");
	
	var str = "" + tab.label;
	var shortStr = str.substring(0, this.shortHeaderTextLength) + this.shortHeaderTextPostfix;
	
	// set a shortest text content
	if (str != shortStr) {
		tab.label = shortStr;
		span.innerText = shortStr;
		span.textContent = shortStr;
		span.title = str;
		
		this.shortHeaderMod = true;
	}
};

/**
* Render the tabs headers. Called on startup
* @private
*/
SweetDevRia.TabLayout.prototype.renderHeaders = function(){
	this.toInit = true;
	
	try {
		for(var i=0;i<this.tabs.length;++i) {
			this.addHeaderView(this.tabs[i]);
		}
	}
	catch (error) {
		if(error=="TooMuchTabs") {
			SweetDevRia.log.error('Tab width is greater than layout width');
		}
	}
	
	this.toInit = false;
};

/**
* Adds a header view for a tab.
* @param {TabContent} tab the tab to add the header for.
* @exception TooMuchTabs Tab width is greater than layout width
* @private
*/
SweetDevRia.TabLayout.prototype.addHeaderView = function(tab){
	var mainDiv = document.createElement("div");
	mainDiv.setAttribute("id", tab.id+"_headerMain");
	SweetDevRia.DomHelper.addClassName(mainDiv,"ideo-tbl-tabHeader-"+this.orientation);
	if(tab.selected){
		SweetDevRia.DomHelper.addClassName(mainDiv,"ideo-tbl-tabHeaderActive-"+this.orientation);
	}
	if(tab.tabSize){
		if(this.orientation==SweetDevRia.TabLayout.ORIENTATION_TOP || this.orientation==SweetDevRia.TabLayout.ORIENTATION_BOTTOM){
			// SWTRIA-1291
			mainDiv.style.width = "auto";
		}
		else{
			mainDiv.style.height = tab.tabSize;
		}
	}
	var layoutId = this.id;
	mainDiv.onclick = function(){
		SweetDevRia.$(layoutId).onTabHeaderClick(tab.id);return false;
	};
	
	var div = document.createElement("div");
	div.setAttribute("id", tab.id+"_header");
	SweetDevRia.DomHelper.addClassName(div,"ideo-tbl-tabHeaderCenter");
	SweetDevRia.DomHelper.addClassName(div,"ideo-tbl-tabHeaderCenter-"+this.orientation);
	
	if(!tab.enabled){
		SweetDevRia.DomHelper.addClassName(div,"ideo-tbl-disabled");
	}
	if(tab.selected){
		SweetDevRia.DomHelper.addClassName(div,"ideo-tbl-tabHeaderCenterActive-"+this.orientation);
	}
	div.innerHTML = TrimPath.processDOMTemplate(tab.templateHeader, tab);

	var divBefore = document.createElement("div");
	divBefore.setAttribute("id", tab.id+"_headerBefore");
	SweetDevRia.DomHelper.addClassName(divBefore,"ideo-tbl-tabHeaderBefore");
	SweetDevRia.DomHelper.addClassName(divBefore,"ideo-tbl-tabHeaderBefore-"+this.orientation);
	if(tab.selected){
		SweetDevRia.DomHelper.addClassName(divBefore,"ideo-tbl-tabHeaderBeforeActive-"+this.orientation);
	}
	divBefore.innerHTML = "&nbsp;";
	
	var divAfter = document.createElement("div");
	divAfter.setAttribute("id", tab.id+"_headerAfter");
	SweetDevRia.DomHelper.addClassName(divAfter,"ideo-tbl-tabHeaderAfter");
	SweetDevRia.DomHelper.addClassName(divAfter,"ideo-tbl-tabHeaderAfter-"+this.orientation);
	if(tab.selected){
		SweetDevRia.DomHelper.addClassName(divAfter,"ideo-tbl-tabHeaderAfterActive-"+this.orientation);
	}
	divAfter.innerHTML = "&nbsp;";
	
	mainDiv.appendChild(divBefore);
	mainDiv.appendChild(div);
	mainDiv.appendChild(divAfter);
	
	document.getElementById(this.id+"_headers_container").appendChild(mainDiv);
	
	var border = 0;
	if(this.orientation==SweetDevRia.TabLayout.ORIENTATION_TOP || this.orientation==SweetDevRia.TabLayout.ORIENTATION_BOTTOM){
		border = SweetDevRia.DomHelper.getWidth(divBefore)+SweetDevRia.DomHelper.getWidth(divAfter);
	}
	else{
		border = SweetDevRia.DomHelper.getHeight(divBefore)+SweetDevRia.DomHelper.getHeight(divAfter);
	}
	
	if(this.orientation==SweetDevRia.TabLayout.ORIENTATION_TOP || this.orientation==SweetDevRia.TabLayout.ORIENTATION_BOTTOM){
		// SWTRIA-1291
		div.style.width = "auto";
	}
	else{
		div.style.height = (SweetDevRia.DomHelper.getHeight(mainDiv)-border)+"px";
	}
	
	if (this.tabs && this.tabs.length > 0 && this.tabs[0].id != tab.id) {
		// SWTRIA-1291 : less text if it exceeds width of the component
		var headerContainer = SweetDevRia.DomHelper.get(this.id+'_headers_container');
		var firstDiv = SweetDevRia.DomHelper.getFirstChild (headerContainer, "div");
		var firstTabY = SweetDevRia.DomHelper.getY(firstDiv) + SweetDevRia.DomHelper.getHeight(firstDiv) / 2;
		var tabHeaderMain = SweetDevRia.DomHelper.get(tab.id+"_headerMain");
		
		if (this.shortHeaderMod) {
			// set a shortest text content for the new tab
			this.toShortHeader(tab);
		}
		else if (SweetDevRia.DomHelper.getY(tabHeaderMain) > firstTabY) {
			if (!this.shortHeaderMod) {
				// set a shortest text content for all tabs
				for(var i=0; i<this.tabs.length; i++) {
					this.toShortHeader(this.tabs [i]);
				}
			}
		}
		// too much tabs in the component
		if (SweetDevRia.DomHelper.getY(tabHeaderMain) > firstTabY) {
			SweetDevRia.DomHelper.removeChildren(mainDiv);
			SweetDevRia.DomHelper.removeNode(mainDiv);
			throw ("TooMuchTabs");
		}
	}
	
	/**
	 * Creation du drag&drop 
	 */
	if(this.orderTab){
		new SweetDevRia.DD (tab.id+"_headerMain_drag");
		SweetDevRia.$(tab.id+"_headerMain_drag").setDragId (tab.id+"_headerMain");
		SweetDevRia.$(tab.id+"_headerMain_drag").group = "headers";
		SweetDevRia.$(tab.id+"_headerMain_drag").constraintId = "lay_headers_container";
		SweetDevRia.$(tab.id+"_headerMain_drag").setFakeMode (SweetDevRia.DD.CLONE);
		SweetDevRia.$(tab.id+"_headerMain_drag").delta = false;
		SweetDevRia.$(tab.id+"_headerMain_drag").displayIcon = false;
	
		SweetDevRia.$(tab.id+"_headerMain_drag").insertMode = SweetDevRia.DD.HORIZONTAL_INSERT;
		
		if(this.orientation==SweetDevRia.TabLayout.ORIENTATION_TOP || this.orientation==SweetDevRia.TabLayout.ORIENTATION_BOTTOM){
			SweetDevRia.$(tab.id+"_headerMain_drag").constraintType = SweetDevRia.DD.HORIZONTAL;
		}
		else{
			SweetDevRia.$(tab.id+"_headerMain_drag").constraintType = SweetDevRia.DD.VERTICAL;
		}
					
		/*SweetDevRia.$(tab.id+"_headerMain_drag").dragObjectClass = "selected";
		SweetDevRia.$(tab.id+"_headerMain_drag").overBeforeClass = "left";
		SweetDevRia.$(tab.id+"_headerMain_drag").overAfterClass = "right";*/
		
		if(!this.toInit){
			SweetDevRia.init();
		}
	}
	
};

/**
* Remove a header view for a tab.
* @param {TabContent} tab the tab to remove the header for.
* @private
*/
SweetDevRia.TabLayout.prototype.removeHeaderView = function(tab){
	var span = document.getElementById(tab.id+"_headerMain");
	SweetDevRia.DomHelper.removeNode(span);
};

/**
* Remove a content view for a tab.
* @param {TabContent} tab the tab to remove the content for.
* @private
*/
SweetDevRia.TabLayout.prototype.removeContentView = function(tab){
	var div = document.getElementById(tab.id+"_container");
	SweetDevRia.DomHelper.removeNode(div);
};

/**
* Action triggered on tab header click : activation
* @param {String} tabId the tab id clicked
* @private
*/
SweetDevRia.TabLayout.prototype.onTabHeaderClick = function(tabId){
	this.activateTabId(tabId);
};


/**
* Tab Content component class 
* @class TabContent
* @constructor
* @param {String} id 	The id of the tab content
*/
SweetDevRia.TabContent = function(id, tabLayout, url, removable, selected, asIframe, preloaded, label, enabled, visible, iconClass, tabSize){
	this.id = id;
	this.url = url;
	this.removable = removable;
	this.selected = selected;
	this.asIframe = asIframe;
	this.preloaded = preloaded;
	this.label = label;
	this.enabled = enabled;
	this.visible = visible;
	this.iconClass = iconClass;
	this.tabSize = tabSize;
	
	this.loaded = this.selected || this.preloaded;
	this.tabLayout = tabLayout;
	
	if(selected && this.tabLayout.activeTabId == null){//==null -> dynamic
		this.tabLayout.activeTabId = this.id;
	}
};

SweetDevRia.TabContent.prototype.enable = function(){
	this.enabled = true;
	SweetDevRia.DomHelper.removeClassName(SweetDevRia.DomHelper.get(this.id+"_header"), "ideo-tbl-disabled");
};

SweetDevRia.TabContent.prototype.disable = function(){
	this.enabled = false;
	SweetDevRia.DomHelper.addClassName(SweetDevRia.DomHelper.get(this.id+"_header"),"ideo-tbl-disabled");
};

/**
* @private
*/
SweetDevRia.TabContent.prototype.show = function(){
	SweetDevRia.DomHelper.get(this.id+"_container").style.display = '';
	SweetDevRia.DomHelper.get(this.id+"_container").style.height = '100%';
	SweetDevRia.DomHelper.addClassName(SweetDevRia.DomHelper.get(this.id+"_headerMain"),"ideo-tbl-tabHeaderActive-"+this.tabLayout.orientation);
	SweetDevRia.DomHelper.addClassName(SweetDevRia.DomHelper.get(this.id+"_header"),"ideo-tbl-tabHeaderCenterActive-"+this.tabLayout.orientation);
	SweetDevRia.DomHelper.addClassName(SweetDevRia.DomHelper.get(this.id+"_headerBefore"),"ideo-tbl-tabHeaderBeforeActive-"+this.tabLayout.orientation);
	SweetDevRia.DomHelper.addClassName(SweetDevRia.DomHelper.get(this.id+"_headerAfter"),"ideo-tbl-tabHeaderAfterActive-"+this.tabLayout.orientation);
	this.selected = true;
	this.tabLayout.activeTabId = this.id;
};

/**
* @private
*/
SweetDevRia.TabContent.prototype.hide = function(){
	SweetDevRia.DomHelper.get(this.id+"_container").style.display = 'none';
	SweetDevRia.DomHelper.removeClassName(SweetDevRia.DomHelper.get(this.id+"_headerMain"),"ideo-tbl-tabHeaderActive-"+this.tabLayout.orientation);
	SweetDevRia.DomHelper.removeClassName(SweetDevRia.DomHelper.get(this.id+"_header"),"ideo-tbl-tabHeaderCenterActive-"+this.tabLayout.orientation);
	SweetDevRia.DomHelper.removeClassName(SweetDevRia.DomHelper.get(this.id+"_headerBefore"),"ideo-tbl-tabHeaderBeforeActive-"+this.tabLayout.orientation);
	SweetDevRia.DomHelper.removeClassName(SweetDevRia.DomHelper.get(this.id+"_headerAfter"),"ideo-tbl-tabHeaderAfterActive-"+this.tabLayout.orientation);
	this.selected = false;
};

SweetDevRia.TabContent.prototype.onButtonOver = function(over){
	if(this.enabled && !this.selected){
		if(over){
			SweetDevRia.DomHelper.addClassName(SweetDevRia.DomHelper.get(this.id+"_header"),"ideo-tbl-activeButton");
		}
	}
	if(!over){
		SweetDevRia.DomHelper.removeClassName(SweetDevRia.DomHelper.get(this.id+"_header"),"ideo-tbl-activeButton");
	}
};



SweetDevRia.TabContent.prototype.templateHeader = "\
	<a href=\"#\" onclick=\"SweetDevRia.$('${tabLayout.id}').onTabHeaderClick('${id}');return false;\" style=\"text-decoration:none\" title=\"${tabLayout.i18n.headerTooltip}\" class=\"ideo-tbl-headerLink\">\
		{if iconClass}<img src=\"" + SweetDevRIAImagesPath + "/pix.gif\" class=\"${iconClass}\"></img>{/if}\
		<span> ${label} </span>\
		{if removable}<img src=\"" + SweetDevRIAImagesPath + "/pix.gif\" class=\"ideo-tbl-removable\" onclick=\"SweetDevRia.$('${tabLayout.id}').removeTabId('${id}');return false;\" alt=\"${tabLayout.i18n.remove}\" title=\"${tabLayout.i18n.remove}\"\
		onmouseover=\"SweetDevRia.$('${tabLayout.id}').getTab('${id}').onButtonOver(true);\"\
		onmouseout=\"SweetDevRia.$('${tabLayout.id}').getTab('${id}').onButtonOver(false);\"></img>{/if}\
	</a>\
";

SweetDevRia.TabContent.prototype.templateDynamicContent = "\
	<iframe style=\"border:0px;width:100%;\" height=\"100%\" src=\"{if preloaded}${url}{else}"+SweetDevRIAJSPPath +"/blank.html{/if}\" name=\"${id}_content\" id=\"${id}_content\" frameborder=\"no\"></iframe>\
";