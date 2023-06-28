/** ------------------------------------
 * SweetDEV RIA library
 * Copyright [2006] [Ideo Technologies]
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
 *         USA & Canada Phone : (201) 984-7514
 *
 *        web : http://www.ideotechnologies.com
 *        email : SweetDEV-RIA@ideotechnologies.com
 *
 *
 * @version 3.5.2.1
 * @author Ideo Technologies
 */
 
 /********************************************************************************************************************************************
 * 									Menu
********************************************************************************************************************************************/

/**
 * This is the Menu component class 
 * @param {String} id Identifiant of this Menu 
 * @constructor
 * @extends RiaComponent
 * @base RiaComponent
 */
SweetDevRia.Menu = function(id){
	if (id) {
		superClass (this, SweetDevRia.RiaComponent, id, "SweetDevRia.Menu");	
		this.items = [];
		this.itemsMap = {};
		
		this.parentItem = null; 
		this.parentMenu = this; 
		
		//SweetDevRia.EventHelper.addListener(document, "click", SweetDevRia.Menu.hideAll, this);
	}
};

extendsClass(SweetDevRia.Menu, SweetDevRia.RiaComponent);


SweetDevRia.Menu.DELAY = 500;

/**
 * This method is called before showing an item of the menu
 * To be overriden !!
 * @param String itemId The id of the menu item 
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Menu.prototype.beforeShowItem = function (itemId){  /* override this */ return true;  };


/**
 * This method is called after showing an item of the menu
 * To be overriden !!
 * @param String itemId The id of the menu item
 */
SweetDevRia.Menu.prototype.afterShowItem = function (itemId){  /* override this */ };

/**
 * This method is called before Hide the context menu
 * To be overriden !!
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Menu.prototype.beforeHide = function (){  /* override this */ return true;  };


/**
 * This method is called after Hide the context menu
 * To be overriden !!
 */
SweetDevRia.Menu.prototype.afterHide = function (){  /* override this */ };

/**
 * This method is called before hiding an item of the menu
 * To be overriden !!
 * @param String itemId The id of the menu item
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Menu.prototype.beforeHideItem = function (itemId){  /* override this */ return true;  };


/**
 * This method is called after hiding an item of the menu
 * To be overriden !!
 * @param String itemId The id of the menu item
 */
SweetDevRia.Menu.prototype.afterHideItem = function (itemId){  /* override this */ };


/**
 * This event type is fired when the item menu is showed
 */
SweetDevRia.Menu.SHOW_ITEM_EVENT = "showItem";


/**
 * This event type is fired when the item menu is hided
 */
SweetDevRia.Menu.HIDE_ITEM_EVENT = "hideItem";

/**
 * This event type is fired when hide the context menu
 */
SweetDevRia.Menu.HIDE_EVENT = "hide";


/**
 * This method is called automatically by the framework at the page load.
 */
SweetDevRia.Menu.prototype.initialize = function(){

	this.init ();
};

SweetDevRia.Menu.prototype.init = function(){
	if (document.getElementById (this.id)) {
		this.initItemsWithChildren ();	

		//2 required instead of 1 : in case of a nude page , the max is 0. 0+1-1 = 0 for the iframe under ie6 -> not displayed.
		//JIRA SWTRIA-526
		var maxZindex = SweetDevRia.DisplayManager.getInstance().topZIndex +2;
		this.initZIndexes(this.items, maxZindex);
	}
};

SweetDevRia.Menu.prototype.initZIndexes = function(items, zIndex){
	for (var i = 0; i < items.length; i++) {
		var item = SweetDevRia.DomHelper.get (items[i].id);
		if (item) {
			item.style.zIndex = zIndex; 
			var subItems = SweetDevRia.DomHelper.get (items[i].id+"_subItems");
			if(subItems){
				subItems.style.zIndex = zIndex;
			}
			if(items[i].items){
				this.initZIndexes(items[i].items, zIndex);
			}
		}
	}
};

SweetDevRia.Menu.prototype.closePopup = function(originalTarget){
	if (this.parentItem == null && !SweetDevRia.DomHelper.hasAncestor(originalTarget,this.id+"_container")) {
		this.hide ();
	}
};

SweetDevRia.Menu.hideAll = function(){
	var menus = SweetDevRia.getInstances ("SweetDevRia.Menu");

	if (menus) {
		for (var j = 0; j < menus.length; j++) {
			var menu = SweetDevRia.$(menus [j]);
			if (menu && menu.parentItem == null) {
				menu.hide ();
			}
		}
	}
};

SweetDevRia.Menu.prototype.showSubItems = function (itemId) {
	if (this.beforeShowItem (itemId)) {
		var item = this.itemsMap [itemId];
	
		if(item.disabled){
			return;
		}
	
		var subItems = SweetDevRia.DomHelper.get (itemId+"_subItems"); 
		if (subItems) {
			subItems.style.display = "inline";
	
			if (document.all && SweetDevRia.DomHelper.hasClassName (subItems, "ideo-mnb-firstLevel")) {
				var parent = subItems.parentNode;
				subItems.style.top=  SweetDevRia.DomHelper.getHeight (parent) + "px";
			}
		
		   	var children = item.items;
		    for (var j=0; j<children.length;j++) {
				var item = SweetDevRia.DomHelper.get (children [j].id); 
				item.style.display = "block";
			}
			SweetDevRia.LayoutManager.addMaskIFrame(subItems.id, subItems);
		}
		
		this.fireEventListener (SweetDevRia.Menu.SHOW_ITEM_EVENT, itemId);

		this.afterShowItem (itemId);
	}
};

SweetDevRia.Menu.prototype.hideSubItems = function (itemId) {
	if (this.beforeHideItem (itemId)) {
		var item = this.itemsMap [itemId];
	
		var itemElem = SweetDevRia.DomHelper.get (itemId); 
		var subItems = SweetDevRia.DomHelper.get (itemId+"_subItems"); 
		if (subItems) {
			SweetDevRia.LayoutManager.removeTransparentIFrame(subItems.id, subItems);
		   	var children = item.items;
		    for (var j=0; j<children.length;j++) {
				
				var item = SweetDevRia.DomHelper.get (children [j].id); 
				this.hideSubItems (children [j].id);
	
				item.style.display = "none";
			}
	
			subItems.style.display = "none";
	
		}
		
		this.fireEventListener (SweetDevRia.Menu.HIDE_ITEM_EVENT, itemId);

		this.afterHideItem (itemId);
	}
};

SweetDevRia.Menu.prototype.showSubItemsAction = function (item, delay) {
	var itemId = item.id;
	if (this.hoverId == itemId) {
		return;
	}
	if (this.hasHover == true) {
		return;
	}
	
	if (this.hideTimer != null && this.hideId == itemId) {
		window.clearTimeout(this.hideTimer);
	}
	this.hideTimer = null;
	this.hideId = null;
	
	if (this.hoverTimer != null) {
		window.clearTimeout(this.hoverTimer);
		this.hoverTimer = null;
	}
	
	this.outId = null;
	this.hasHover = true;
			
	for (var i = 0; i < item.parentItem.items.length; i++) {
		var itemChild = item.parentItem.items [i];
		if (itemChild != item && itemChild.hasItems () && itemChild.isOpen ()) {
			if (delay) {
				this.hideTimer = window.setTimeout("SweetDevRia.$('"+this.parentMenu.id+"').hideSubItems('"+itemChild.id+"');", delay);
				this.hideId = itemChild.id;
			}
			else {
				this.hideSubItems(itemChild.id);
			}
			
			break; // il ne peuit y en avoir qu un seul d ouvert
		}
	}

	if (delay) {
		this.hoverTimer = window.setTimeout("SweetDevRia.$('"+this.parentMenu.id+"').showSubItems('"+itemId+"');", delay);
	}
	else {
		this.showSubItems(itemId);
	}
	

	this.hoverId = itemId;
};

SweetDevRia.Menu.prototype.initItemsWithChildren = function (item) {

	var menu = this;

	if (item == null) {
		item = menu;
	}
	else {
		var elem = document.getElementById(item.id);

		if (SweetDevRia.DomHelper.hasClassName (elem, "ideo-mnb-barLevel")) {
		    elem.onclick = function(e) {
				menu.isOpened = ! menu.isOpened;

				if (menu.isOpened) {
					menu.hasHover = true;
					menu.showSubItems(item.id);
					menu.hoverId = item.id;
				}
				else {
					menu.hideSubItems(item.id);
				}
				
				SweetDevRia.EventHelper.stopPropagation(e);
				return false;	
			};
		}
		
	    elem.onmouseover = function(e) {
			if (! SweetDevRia.DomHelper.hasClassName (this, "ideo-mnb-barLevel") || menu.isOpened) {
				SweetDevRia.DomHelper.addClassName (this, "iehover");
	           	if(SweetDevRia.DomHelper.hasClassName (this, "ideo-mnu-check")){
					SweetDevRia.DomHelper.addClassName (this, "ideo-mnu-checkover");	
				}
	            for (var j=0; j<this.childNodes.length;j++) {
					if (this.childNodes[j].nodeType != 3) {
						SweetDevRia.DomHelper.addClassName (this.childNodes[j], "iehover");
					}
				}

				var delay = SweetDevRia.Menu.DELAY;
				if (SweetDevRia.DomHelper.hasClassName (this, "ideo-mnb-barLevel")) {
					delay = 0;
				}

				if (! SweetDevRia.DomHelper.hasClassName (this, "ideo-mnb-barLevel") || menu.isOpened ) {
					menu.showSubItemsAction (item, delay);
				}
			}
	    };

	    elem.onmouseout = function(e) {
			if (! SweetDevRia.DomHelper.hasClassName (this, "ideo-mnb-barLevel") || menu.isOpened) {
				SweetDevRia.DomHelper.removeClassName (this, "iehover");
				SweetDevRia.DomHelper.removeClassName (this, "ideo-mnu-checkover");
	            for (var j=0; j<this.childNodes.length;j++) {
					if (this.childNodes[j].nodeType != 3) {
						SweetDevRia.DomHelper.removeClassName (this.childNodes[j], "iehover");
					}
				}
				
				if (!menu.hasHover) {
					return;
				}
	
				menu.hasHover = false;
			}
		};
	}

	for (var i = 0; i < item.items.length; i++) {
		var child = item.items[i];
		this.initItemsWithChildren (child);
	}
};


/**
 * Hide the menu
 */
SweetDevRia.Menu.prototype.hide = function(){

	if (this.beforeHide ())  {

		var view = this.view();

		if (view) {

			var lis = view.getElementsByTagName ("LI");
			for (var i = 0; i < lis.length; i++) {
				if (lis [i].parentNode == view) {
					this.hideSubItems (lis [i].id);
				}
			}
		}

		this.fireEventListener (SweetDevRia.Menu.HIDE_EVENT);

		this.afterHide();
	}
};

/**
 * Return the associated html element
 * @return the html element view associated wit this menu
 * @type HtmlElement
 * @private
 */
SweetDevRia.Menu.prototype.view = function(){
	return document.getElementById(this.id);
};

/**
 * Return the associated html element which contains the image
 * @return the associated html element which contains the image
 * @type HtmlElement
 * @private
 */
SweetDevRia.Menu.prototype.iconView = function(){
	return document.getElementById(this.id+"_icon");
};

/**
 * Return the rendering string of subitems
 * @return  rendering string of subitems
 * @type String
 * @private
 */
SweetDevRia.Menu.prototype.getItems = function () {
	var str = "";
	for (var i = 0; i < this.items.length; i++) {
		str += TrimPath.processDOMTemplate(this.items[i].template, this.items[i]);
	}
	
	return str;
};

/**
 * Add an menuitem to this menu
 * @param {MenuItem} item MenuItem to add
 */
SweetDevRia.Menu.prototype.addItem = function (item) {
	item.parentMenu = this.parentMenu;
	item.parentItem = this;
	
	this.items.push (item);
	this.parentMenu.itemsMap [item.id] = item;
	
};

/**
 * Test if this menu has sub items
 * @return  true if this menu has sub items, else false
 * @type boolean
 * @private
 */
SweetDevRia.Menu.prototype.hasItems = function () {
	return this.items.length > 0;
};

SweetDevRia.Menu.prototype.isOpen = function () {
	var subItems = SweetDevRia.DomHelper.get (this.id+"_subItems"); 
	return this.hasItems () && subItems && subItems.style.display == "inline";
};


SweetDevRia.Menu.prototype.destroy = function(){
	if(this.view()){
		SweetDevRia.DomHelper.removeChild(this.view().parentNode, this.view().id);
	}
};


SweetDevRia.Menu.prototype.template = "\
<ul id=\"${id}\" class=\"ideo-mnu-main\">\
${getItems()}\
</ul>\
";

/********************************************************************************************************************************************
 * 									MenuBar
********************************************************************************************************************************************/


/**
 * This is the MenuBar component class 
 * @param {String} id Identifiant of this MenuBar 
 * @constructor
 * @extends Menu
 * @base Menu
 */
SweetDevRia.MenuBar = function(id){
	superClass (this, SweetDevRia.RiaComponent, id, "SweetDevRia.MenuBar");	
	superClass (this, SweetDevRia.Menu, id);	
	
	this.isOpened = false;
};

extendsClass (SweetDevRia.MenuBar, SweetDevRia.RiaComponent, SweetDevRia.Menu);

/**
 * This method is called automatically by the framework at the page load.
 */
SweetDevRia.MenuBar.prototype.initialize = function(){
//	menubar_ieHover(this.id);

	//SweetDevRia.EventHelper.addListener(document, "click", SweetDevRia.Menu.hideAll, this);

	this.init ();
};


/**
 * Return the rendering string of subitems
 * @return  rendering string of subitems
 * @type String
 * @private
 */
SweetDevRia.MenuBar.prototype.getItems = function () {
	var str = "";
	for (var i = 0; i < this.items.length; i++) {
		var item = this.items [i];

		str += TrimPath.processDOMTemplate(this.itemTemplate, item);
	}

	return str;
};

/**
 * Hide the MenuBar
 */
SweetDevRia.MenuBar.prototype.hide = function(){

	if (this.beforeHide ())  {
		var view = this.view();

		if (view) {
			var uls = view.getElementsByTagName ("LI");
			for (var i = 0; i < uls.length; i++) {
				if (uls [i].parentNode == view) {
					this.hideSubItems (uls [i].id);
				}
			}
			
			this.isOpened = false;

		}

		this.fireEventListener (SweetDevRia.Menu.HIDE_EVENT);

		this.afterHide();
	}
};

SweetDevRia.MenuBar.prototype.itemTemplate = "\
<li id=\"${id}\" class=\"ideo-mnb-main ideo-mnb-barLevel {if disabled == false && checked == true}ideo-mnu-check{/if}\"  style=\"{if disabled == true}color:gray{/if} {if image !== null}background-image : url(${image});background-repeat : no-repeat;{/if}\">\
	<span onclick=\"return SweetDevRia.$('${id}')._onclick(event)\">${label}</span>\
	{if hasItems() == true}\
	<ul id=\"${id}_subItems\" class=\"ideo-mnu-main ideo-mnb-firstLevel\" >\
	${getItems()}\
	</ul>\
	{/if}\
</li>\
";


SweetDevRia.MenuBar.prototype.template = "\
<ul id=\"${id}\" class=\"ideo-mnb-main\" >\
	${getItems()}\
</ul>\
";


/********************************************************************************************************************************************
 * 									ContextMenu
********************************************************************************************************************************************/

/**
 * This is the ContextMenu component class 
 * @param {String} id Identifiant of this ContextMenu 
 * @constructor
 * @extends Menu
 * @base Menu
 */
SweetDevRia.ContextMenu = function(id){
	//avoid double inheritance
//	superClass (this, SweetDevRia.RiaComponent, id, "SweetDevRia.ContextMenu");	
	superClass (this, SweetDevRia.Menu, id);	

	this.containerId = this.id + "_container"; 
	this.str = null;

	this.targetId = null;
};

extendsClass (SweetDevRia.ContextMenu, SweetDevRia.RiaComponent, SweetDevRia.Menu);

/**
 * This method is called before Show the context menu
 * To be overriden !!
 * @param {Event} e ContextMenu event (mouse right click)
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.ContextMenu.prototype.beforeShow = function (e){  /* override this */ return true;  };

/**
 * This method is called after Show the context menu
 * To be overriden !!
 */
SweetDevRia.ContextMenu.prototype.afterShow = function (){  /* override this */ };


SweetDevRia.ContextMenu.prototype.initFrame = function(){
	this.createFrame();
	if(!this.getFrame().isNude()){
		this.getFrame().contentId = this.id;
		this.getFrame().resizeMode = SweetDevRia.Frame.RESIZE_MODE_NONE;
		this.getFrame().borderMode = SweetDevRia.Frame.BORDER_MODE_ALL;
		this.getFrame().canDrag = false;
		this.getFrame().showBorderOnOver = false;
		SweetDevRia.init();
	}
};


/**
 * This event type is fired when hide the context menu
 */
SweetDevRia.ContextMenu.HIDE_EVENT = "hide";

/**
 * This event type is fired when show the context menu
 */
SweetDevRia.ContextMenu.SHOW_EVENT = "show";


/**
 * This method is called automatically by the framework at the page load.
 */
SweetDevRia.ContextMenu.prototype.initialize = function(){
	var menu = this;

	var target = document.getElementById(this.targetId);
	if (target) {
		target.oncontextmenu = function(e){return menu.show(e); };
	}

	//SweetDevRia.EventHelper.addListener(document, "click", SweetDevRia.Menu.hideAll, this);
	 
	 this.init ();
};

/**
 * Return the associated html element
 * @return the html element view associated wit this menu
 * @type HtmlElement
 * @private
 */
 /*
SweetDevRia.ContextMenu.prototype.view = function(){
	return document.getElementById(this.id+"_border");
};
*/

/**
 * Hide the context menu
 */
SweetDevRia.ContextMenu.prototype.hide = function(){

	if (this.beforeHide ())  {

		var view = this.view();

		if (view) {
			var lis = view.getElementsByTagName ("LI");
			for (var i = 0; i < lis.length; i++) {
				if (lis [i].parentNode == view) {
					this.hideSubItems (lis [i].id);
				}
			}

			view.style.display = "none";
			SweetDevRia.LayoutManager.removeTransparentIFrame(this.view().id, this.view());
		}

		this.fireEventListener (SweetDevRia.ContextMenu.HIDE_EVENT);

		this.afterHide();
	}
};

/**
 * Show the context menu
 * @param {Event} e ContextMenu event (mouse right click)
 */
SweetDevRia.ContextMenu.prototype.show = function(e){

	if (this.beforeShow (e))  {
		SweetDevRia.Menu.hideAll ();

		var container = document.getElementById (this.containerId);
		if (container && this.strWrited != true) {
			container.innerHTML = "&nbsp;"+this.str;

			this.strWrited = true;

			this.initialize ();
		}

		var evt = null;
		try{
			evt = event;
		}
		catch(exp){
			evt = e;
		}

		/**
		 * srevel : the ul list must be a body child. If not, we move it
		 */
		if (this.view().parentNode != document.body) {
			document.body.appendChild (this.view());
	
			var zindex = SweetDevRia.DisplayManager.getInstance().getTopZIndex (true);
			this.view().style.zIndex = zindex+2;
		
			// srevel : obligatoire sinon une ligne apparait (le container vide) ds list.jsp lors de l ouverture du menu contextuel)
			if(container) {
				SweetDevRia.DomHelper.removeNode (container);
			}
		}

		this.view().style.display = "block";

	    var scrollX = SweetDevRia.DomHelper.getScrolledLeft();
		var scrollY = SweetDevRia.DomHelper.getScrolledTop();

		YAHOO.util.Dom.setX(this.view(), (evt.clientX-10 + scrollX));
		YAHOO.util.Dom.setY(this.view(), (evt.clientY-10 + scrollY));
		
		SweetDevRia.LayoutManager.addMaskIFrame(this.view().id, this.view());		
		
		/*if(!this.getFrame()){
			this.initFrame();
		}
		this.getFrame().refreshBorders();
		*/

		this.fireEventListener (SweetDevRia.ContextMenu.SHOW_EVENT, e);

		this.afterShow();
		
		return false;
	}
};

/**
 * Render this menu
 */
SweetDevRia.ContextMenu.prototype.render = function() {
	SweetDevRia.startLog ("Log.Render_"+this.id, this);

	if (this.beforeRender ()) {
		var str =  TrimPath.processDOMTemplate(this.template, this);

		this.str = str;
	
		this.fireEventListener (SweetDevRia.RiaComponent.RENDER_EVENT);

		this.afterRender ();
	}

	SweetDevRia.endLog ("Log.Render_"+this.id, this, 1);
};

SweetDevRia.ContextMenu.prototype.template = "\
<ul id=\"${id}\" class=\"ideo-mnu-main\">\
	${getItems()}\
</ul>\
";



/********************************************************************************************************************************************
 * 									MenuItem
********************************************************************************************************************************************/

/**
 * This is the MenuItem component class 
 * @param {String} id Identifiant of this MenuItem 
 * @constructor
 * @extends Menu
 * @base Menu
 */
SweetDevRia.MenuItem = function(id){
	superClass (this, SweetDevRia.RiaComponent, id, "SweetDevRia.MenuItem");

	this.id = id;
	this.items = [];	
	this.label = "";
};

extendsClass (SweetDevRia.MenuItem, SweetDevRia.Menu);

SweetDevRia.MenuItem.prototype.checkbox = false;
SweetDevRia.MenuItem.prototype.checked = false;
SweetDevRia.MenuItem.prototype.disabled = false;
SweetDevRia.MenuItem.prototype.image = null;
SweetDevRia.MenuItem.prototype.onclick = function(){};
SweetDevRia.MenuItem.prototype.oncheck = function(){};
SweetDevRia.MenuItem.prototype.onuncheck = function(){};

/**
 * This method is called before Action execute when the user click on an item
 * To be overriden !!
 * @param {Event} e mouse left click event
 * @private
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.MenuItem.prototype.beforeClick = function (e){  /* override this */ return true;  };

/**
 * This method is called after Action execute when the user click on an item
 * To be overriden !!
 */
SweetDevRia.MenuItem.prototype.afterClick = function (){  /* override this */ };
	
/**
 * This method is called before Set the MenuItem disabled property
 * To be overriden !!
 * @param {boolean} disabled the new disabled property value
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.MenuItem.prototype.beforeSetDisabled = function (disabled){  /* override this */ return true;  };

/**
 * This method is called after Set the MenuItem disabled property
 * To be overriden !!
 */
SweetDevRia.MenuItem.prototype.afterSetDisabled = function (){  /* override this */ };
	
/**
 * This method is called before Set the MenuItem visible property
 * To be overriden !!
 * @param {boolean} visible the new visible property value
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.MenuItem.prototype.beforeSetVisible = function (visible){  /* override this */ return true;  };

/**
 * This method is called after Set the MenuItem visible property
 * To be overriden !!
 */
SweetDevRia.MenuItem.prototype.afterSetVisible = function (){  /* override this */ };
	
/**
 * This method is called before Set the MenuItem checked property
 * To be overriden !!
 * @param {boolean} checked the new checked property value
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.MenuItem.prototype.beforeSetChecked = function (checked){  /* override this */ return true;  };

/**
 * This method is called after Set the MenuItem checked property
 * To be overriden !!
 */
SweetDevRia.MenuItem.prototype.afterSetChecked = function (){  /* override this */ };	
		
/**
 * This method is called before Set the MenuItem image property
 * To be overriden !!
 * @param {boolean} bool the new image property value
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.MenuItem.prototype.beforeSetImage = function (image){  /* override this */ return true;  };

/**
 * This method is called after Set the MenuItem image property
 * To be overriden !!
 */
SweetDevRia.MenuItem.prototype.afterSetImage = function (){  /* override this */ };
	
/**
 * This event type is fired when click on menu item 
 */
SweetDevRia.MenuItem.CLICK_EVENT = "click";

/**
 * This event type is fired when disable a menu item 
 */
SweetDevRia.MenuItem.DISABLE_EVENT = "disable";

/**
 * This event type is fired when enalbe a menu item 
 */
SweetDevRia.MenuItem.ENABLE_EVENT = "enable";

/**
 * This event type is fired when show a menu item 
 */
SweetDevRia.MenuItem.SHOW_EVENT = "show";
	
/**
 * This event type is fired when hide a menu item 
 */
SweetDevRia.MenuItem.HIDE_EVENT = "hide";

/**
 * This event type is fired when check a menu item 
 */
SweetDevRia.MenuItem.CHECK_EVENT = "check";

/**
 * This event type is fired when uncheck a menu item 
 */
SweetDevRia.MenuItem.UNCHECK_EVENT = "uncheck";

/**
 * This event type is fired when change menu item image
 */
SweetDevRia.MenuItem.IMAGE_EVENT = "image";

	
/**
 * Action execute when the user click on an item
 * @param {Event} e mouse left click event
 * @private
 */
SweetDevRia.MenuItem.prototype._onclick = function(e){
	if (this.beforeClick (e))  {

		if(this.disabled) {
			SweetDevRia.EventHelper.stopPropagation(e);
			return false;	
		}


		if (! this.hasItems()) {
	
			if(this.checkbox){
				this.setChecked (!this.checked);
				SweetDevRia.EventHelper.stopPropagation(e);
				return false;
			}
			
			this.onclick();
			
			// If it's an item inside a contextmenu, we close the contextmenu
			if (this.parentMenu && this.parentMenu.hide) {
				this.parentMenu.hide ();
			}
		}
		else {
			this.parentMenu.hasHover = false;
			this.parentMenu.hoverId = null;
			this.parentMenu.showSubItemsAction (this);
		}		

		SweetDevRia.EventHelper.stopPropagation(e);

		this.fireEventListener (SweetDevRia.MenuItem.CLICK_EVENT, e);

		this.afterClick ();

		return false;	
	}
};

/**
 * Set the MenuItem disabled property
 * @param {boolean} disabled the new disabled property value
 */
SweetDevRia.MenuItem.prototype.setDisabled = function(disabled){
	if (this.beforeSetDisabled (disabled))  {
		this.disabled = disabled;
		if(this.disabled){
			this.view().style.color = "gray"; 
		}
		else{
			this.view().style.color = ""; 		
		}
		
		if (disabled) {
			this.fireEventListener (SweetDevRia.MenuItem.DISABLE_EVENT);
		}
		else {
			this.fireEventListener (SweetDevRia.MenuItem.ENABLE_EVENT);
		}
		
		this.afterSetDisabled ();
	}
};

/**
 * Set the MenuItem checked property
 * @param {boolean} checked the new checked property value
 */
SweetDevRia.MenuItem.prototype.setChecked = function(checked){

	if (this.beforeSetChecked (checked))  {

		this.checked = checked;

	    if(this.checked) {
			SweetDevRia.DomHelper.addClassName(this.iconView(),"ideo-mnu-check");
	        /*@cc_on
			SweetDevRia.DomHelper.addClassName(this.iconView(),"ideo-mnu-checkover");
	        @*/
			this.oncheck();
	    }
	    else{
			SweetDevRia.DomHelper.removeClassName(this.iconView(),"ideo-mnu-check");
	        /*@cc_on
			SweetDevRia.DomHelper.removeClassName(this.iconView(),"ideo-mnu-checkover");
	        @*/
			this.onuncheck();
	    }

		
		if (checked) {
			this.fireEventListener (SweetDevRia.MenuItem.CHECK_EVENT);
		}
		else {
			this.fireEventListener (SweetDevRia.MenuItem.UNCHECK_EVENT);
		}
		
		this.afterSetChecked ();
	}
};

/**
 * Set the MenuItem image property
 * @param {boolean} bool the new image property value
 */
SweetDevRia.MenuItem.prototype.setImage = function(image){
	if (this.beforeSetImage (image))  {
				
		this.image = image;
		this.iconView().style.backgroundImage = "url(" + this.image + ")";
		//SweetDevRia.DomHelper.addClassName(this.iconView(),image); 
		
		this.fireEventListener (SweetDevRia.MenuItem.IMAGE_EVENT, image);
		
		this.afterSetImage ();
	}
};

SweetDevRia.MenuItem.prototype.initialize = function(){
	if(this.image){
		this.iconView().style.backgroundImage = "url(" + this.image + ")";
	}
};

SweetDevRia.MenuItem.prototype.setVisible = function (visible) {
	if (this.beforeSetVisible (visible))  {
		this.visible = visible;
		if(this.visible){
			this.view().style.display = "inline"; 
		}
		else{
			this.view().style.display = "none"; 
		}
		
		if (visible) {
			this.fireEventListener (SweetDevRia.MenuItem.SHOW_EVENT);
		}
		else {
			this.fireEventListener (SweetDevRia.MenuItem.HIDE_EVENT);
		}
		
		this.afterSetVisible ();
	}

};


SweetDevRia.MenuItem.prototype.destroy = function(){
	//nothing
	//overrides Menu.destroy
};

SweetDevRia.MenuItem.prototype.template = "\
<li id=\"${id}\" onclick=\"return SweetDevRia.$('${id}')._onclick(event)\" style=\"{if disabled == true}color:gray{/if} \">\
	<img id=\"${id}_icon\" src=\"" + SweetDevRIAImagesPath + "/pix.gif\" class=\"ideo-mnu-itemIcon {if image !== null} ${image}{/if} {if disabled == false && checked == true} ideo-mnu-check{/if}\"/>\
	${label}\
	{if hasItems() == true}\
	<div>&nbsp;</div>\
	<ul id=\"${id}_subItems\">\
	${getItems()}\
	</ul>\
	{/if}\
</li>\
";


/********************************************************************************************************************************************
 * 									Internet Explorer hover hack 
********************************************************************************************************************************************/

SweetDevRia.MenuItem.updateZindex = function (id) {
	var menu = SweetDevRia.$ (id);
	/*if (menu) {
	} */
};



function menubar_ieHover(id) {SweetDevRia.MenuItem.updateZindex (id);}
