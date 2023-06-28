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
 
 /********************************************************************************************************************************************
 * 									Menu
********************************************************************************************************************************************/

/**
 * This is the Menu component class
 * 
 * @param {String}
 *            id Identifiant of this Menu
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
		
		this.isSelected = false;
		this.selectedItem = null;
		this.selectedItems = [];
		
		this.isRefreshed = true; 
		
		this.typeMenu = "Menu";
		// SweetDevRia.EventHelper.addListener(document, "click",
		// SweetDevRia.Menu.hideAll, this);
	}
};

extendsClass(SweetDevRia.Menu, SweetDevRia.RiaComponent);


SweetDevRia.Menu.DELAY = 500;

/**
 * This method is called before showing an item of the menu To be overriden !!
 * 
 * @param String
 *            itemId The id of the menu item
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Menu.prototype.beforeShowItem = function (itemId){  /* override this */ return true;  };


/**
 * This method is called after showing an item of the menu To be overriden !!
 * 
 * @param String
 *            itemId The id of the menu item
 */
SweetDevRia.Menu.prototype.afterShowItem = function (itemId){  /* override this */ };

/**
 * This method is called before Hide the context menu To be overriden !!
 * 
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Menu.prototype.beforeHide = function (){  /* override this */ return true;  };


/**
 * This method is called after Hide the context menu To be overriden !!
 */
SweetDevRia.Menu.prototype.afterHide = function (){  /* override this */ };

/**
 * This method is called before hiding an item of the menu To be overriden !!
 * 
 * @param String
 *            itemId The id of the menu item
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Menu.prototype.beforeHideItem = function (itemId){  /* override this */ return true;  };


/**
 * This method is called after hiding an item of the menu To be overriden !!
 * 
 * @param String
 *            itemId The id of the menu item
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

		// 2 required instead of 1 : in case of a nude page , the max is 0.
		// 0+1-1 = 0 for the iframe under ie6 -> not displayed.
		// JIRA SWTRIA-526
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
                    SweetDevRia.$(item.id)._onclick(e);
                }
                else {
                    menu.hideSubItems(item.id);
                }
               
                SweetDevRia.EventHelper.stopPropagation(e);
                return false;   
            };
        }
		
		elem.onmouseover = function(e) {
			// The onmouseover est declenche sur tous les parents egalement or le focus ne doit se faire que sur le dernier fils
			var doFocus = false;
			if(item.selectedItem == null){
				doFocus = true;
			}
			item.selectItem(doFocus,false);
			if (! SweetDevRia.DomHelper.hasClassName (this, "ideo-mnb-barLevel") || menu.isOpened) {
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
	    	item.unselectItem(false);
			if (! SweetDevRia.DomHelper.hasClassName (this, "ideo-mnb-barLevel") || menu.isOpened) {
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
 * Select a item menu 
 * BE CARREFULL: Here select an item does not valid it. To valid it, you have to click on it or press Enter
 */
SweetDevRia.Menu.prototype.selectItem = function(doFocus,doUnselectSonAndBrother){
	var elem = document.getElementById(this.id);
	if (! SweetDevRia.DomHelper.hasClassName (elem, "ideo-mnb-barLevel") || this.parentMenu.isOpened) {
		// We do not add iehover and ideo-mnu-checkover class if the element has already it
		SweetDevRia.DomHelper.addClassName(elem, "iehover");
       	if(SweetDevRia.DomHelper.hasClassName (elem, "ideo-mnu-check") && !SweetDevRia.DomHelper.hasClassName (elem, "ideo-mnu-checkover")){
			SweetDevRia.DomHelper.addClassName (elem, "ideo-mnu-checkover");	
		}
        for (var j=0; j<elem.childNodes.length;j++) {
			if ((elem.childNodes[j].nodeType != 3)) {
				SweetDevRia.DomHelper.addClassName (elem.childNodes[j], "iehover");
			}
		}
		this.isSelected = true;
		if (doUnselectSonAndBrother == null){doUnselectSonAndBrother = true;}
		//On deselectionne son fils
		if(doUnselectSonAndBrother && this.selectedItem != null){
			this.getItem(this.selectedItem).unselectItem();
		}
		if(this.parentItem != null){
			//On deselectionne son frere
			var currentSelectedItem = this.parentItem.selectedItem;
			if (doUnselectSonAndBrother && currentSelectedItem != null && currentSelectedItem != this.id){
				this.parentItem.getItem(currentSelectedItem).unselectItem();
			}
		
			this.parentItem.selectedItem = this.id;
		}
		if(doFocus){this.focus();}

	}else{
		if (SweetDevRia.DomHelper.hasClassName (elem, "ideo-mnb-barLevel")){
			SweetDevRia.DomHelper.addClassName(elem, "iehovermenubar");
			this.focus();
		}
	}
};

/**
 * Unselect a item menu 
 */
SweetDevRia.Menu.prototype.unselectItem = function(doUnselectSonAndBrother){
	var elem = document.getElementById(this.id);
	if (! SweetDevRia.DomHelper.hasClassName (elem, "ideo-mnb-barLevel") || this.parentMenu.isOpened) {
		SweetDevRia.DomHelper.removeClassName (elem, "iehover");
		SweetDevRia.DomHelper.removeClassName (elem, "ideo-mnu-checkover");
		if (SweetDevRia.DomHelper.hasClassName (elem, "ideo-mnb-barLevel")){
			SweetDevRia.DomHelper.removeClassName(elem, "iehovermenubar");
		}
        for (var j=0; j<elem.childNodes.length;j++) {
			if (elem.childNodes[j].nodeType != 3) {
				SweetDevRia.DomHelper.removeClassName (elem.childNodes[j], "iehover");
			}
		}
		this.isSelected = false;
		if (this.parentItem.selectedItem == this.id){
			this.parentItem.selectedItem = null;
		}
		if (doUnselectSonAndBrother == null){ doUnselectSonAndBrother = true;}
		if (doUnselectSonAndBrother){
			//S'il a des fils selectionne, on le deselectionne
			for (var i = 0; i< this.items.length; i++){
				if (this.items[0].isSelected){
					this.items[0].unselectItem();
				}
			}
		}
	}else{
		if (SweetDevRia.DomHelper.hasClassName (elem, "ideo-mnb-barLevel")){
			SweetDevRia.DomHelper.removeClassName(elem, "iehovermenubar");
		}
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
 * @return rendering string of subitems
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
	
	this.isRefreshed = false; 
};

/**
 * Test if this menu has sub items
 * @return true if this menu has sub items, else false
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

/**
 * return the index of the item (witch id is itemId) in the menu items array.
 * @param itemId the item id
 */
SweetDevRia.Menu.prototype.getIndex = function(itemId){
	for (var i=0; i < this.items.length; i++ ) {
		if(this.items[i].id == itemId){ return i;}
	}
	return null;
};

/**
 * return the next item of the one witch id is itemId, in the menu items array.
 * @param itemId the item id
 */
SweetDevRia.Menu.prototype.nextItem = function(itemId){
	if (this.hasItems()){
		var currentIndex = this.getIndex(itemId);
		var nextIndex;
		if (currentIndex == this.items.length-1){
			nextIndex = 0;
		} else {
			nextIndex = currentIndex + 1;
		}
		return this.items[nextIndex];
	}
	return null;
};

/**
 * return the previous item of the one witch id is itemId, in the menu items array.
 * @param itemId the item id
 */
SweetDevRia.Menu.prototype.previousItem = function(itemId){
	if (this.hasItems()){
		var currentIndex = this.getIndex(itemId);
		var previousIndex;
		if (currentIndex == 0){
			previousIndex = this.items.length-1;
		} else {
			previousIndex = currentIndex - 1;
		}
		return this.items[previousIndex];
	}
	return null;
};

/**
 * return the item witch id is itemId, in the menu itemsarray.
 * @param itemId the item id
 */
SweetDevRia.Menu.prototype.getItem = function(itemId){
	if (this.hasItems()){
		for (var i = 0; i < this.items.length; i++){
			if(this.items[i].id == itemId){
				return this.items[i];
			} else {
				var item = this.items[i].getItem(itemId);
				if (item != null) {return item;}
			}
		}
	}
	return null;
};

/**
 * Select next item in the parent menu items array.
 * @param itemId the item id
 */
SweetDevRia.Menu.prototype.selectNextItem = function(){
	if (!this.hasItems() || !this.isOpen () || this.selectedItem == null){
		if (this.parentItem){
			var nextItem = this.parentItem.nextItem(this.id);
			if (nextItem) {
				nextItem.selectItem(true);
			}
		}
		this.parentMenu.hasHover = false;
	}
};

/**
 * Select previous item in the parent menu items array.
 * @param itemId the item id
 */
SweetDevRia.Menu.prototype.selectPreviousItem = function(){
	if (!this.hasItems() || !this.isOpen () || this.selectedItem == null){
		if (this.parentItem){
			var previousItem = this.parentItem.previousItem(this.id);
			if (previousItem){
				previousItem.selectItem(true);
			}
		}
		this.parentMenu.hasHover = false;
	}

};

SweetDevRia.Menu.prototype.refresh = function(){
	this.strWrited = false;
	var container = document.getElementById (this.containerId);
	var view = this.view();
	if (container == null){
		container = document.createElement ("div");
		container.id = this.containerId;
		document.body.appendChild (container);
		if (view != null){
			document.body.removeChild(view);
		}
	}else{
		if (view != null){
			container.removeChild(view);
		}
	}
	this.render();
	this.initialize();
	this.isRefreshed = true;
};

SweetDevRia.Menu.prototype.template = "\
<ul id=\"${id}\" class=\"ideo-mnu-main\">\
${getItems()}\
</ul>\
";

