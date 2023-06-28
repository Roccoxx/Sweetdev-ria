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
 
/*******************************************************************************
 * MenuItem
 ******************************************************************************/

/**
 * This is the MenuItem component class
 * 
 * @param {String}
 *            id Identifiant of this MenuItem
 * @constructor
 * @extends Menu
 * @base Menu
 */
SweetDevRia.MenuItem = function(id){
	superClass (this, SweetDevRia.RiaComponent, id, "SweetDevRia.MenuItem");

	this.id = id;
	this.items = [];	
	this.label = "";
	
	this.typeMenu = "MenuItem";
};

extendsClass (SweetDevRia.MenuItem, SweetDevRia.Menu);

SweetDevRia.MenuItem.prototype.checkbox = false;
SweetDevRia.MenuItem.prototype.checked = false;
SweetDevRia.MenuItem.prototype.disabled = false;
SweetDevRia.MenuItem.prototype.image = null;
SweetDevRia.MenuItem.prototype.onclick = function(){};
SweetDevRia.MenuItem.prototype.oncheck = function(){};
SweetDevRia.MenuItem.prototype.onuncheck = function(){};
SweetDevRia.MenuItem.prototype.onkeydown = function(){};

/**
 * This method is called before Action execute when the user click on an item To
 * be overriden !!
 * 
 * @param {Event}
 *            e mouse left click event
 * @private
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.MenuItem.prototype.beforeClick = function (e){  /* override this */ return true;  };

/**
 * This method is called after Action execute when the user click on an item To
 * be overriden !!
 */
SweetDevRia.MenuItem.prototype.afterClick = function (){  /* override this */ };

/**
 * This method is called before Action execute when the user press a key down on
 * an item To be overriden !!
 * 
 * @param {Event}
 *            e press a key down event
 * @private
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.MenuItem.prototype.beforeKeyDown = function (e){  /* override this */ return true;  };

/**
 * This method is called after Action execute when the user press a key down on
 * an item To be overriden !!
 */
SweetDevRia.MenuItem.prototype.afterKeyDown = function (){  /* override this */ };

/**
 * This method is called before Set the MenuItem disabled property To be
 * overriden !!
 * 
 * @param {boolean}
 *            disabled the new disabled property value
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.MenuItem.prototype.beforeSetDisabled = function (disabled){  /* override this */ return true;  };

/**
 * This method is called after Set the MenuItem disabled property To be
 * overriden !!
 */
SweetDevRia.MenuItem.prototype.afterSetDisabled = function (){  /* override this */ };
	
/**
 * This method is called before Set the MenuItem visible property To be
 * overriden !!
 * 
 * @param {boolean}
 *            visible the new visible property value
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.MenuItem.prototype.beforeSetVisible = function (visible){  /* override this */ return true;  };

/**
 * This method is called after Set the MenuItem visible property To be overriden !!
 */
SweetDevRia.MenuItem.prototype.afterSetVisible = function (){  /* override this */ };
	
/**
 * This method is called before Set the MenuItem checked property To be
 * overriden !!
 * 
 * @param {boolean}
 *            checked the new checked property value
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.MenuItem.prototype.beforeSetChecked = function (checked){  /* override this */ return true;  };

/**
 * This method is called after Set the MenuItem checked property To be overriden !!
 */
SweetDevRia.MenuItem.prototype.afterSetChecked = function (){  /* override this */ };	
		
/**
 * This method is called before Set the MenuItem image property To be overriden !!
 * 
 * @param {boolean}
 *            bool the new image property value
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.MenuItem.prototype.beforeSetImage = function (image){ /* override this */ return true;  };

/**
 * This method is called after Set the MenuItem image property To be overriden !!
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
 * This event type is fired when press key down on menu item
 */
SweetDevRia.MenuItem.KEYDOWN_EVENT = "keyDown";

	
/**
 * Action execute when the user click on an item
 * 
 * @param {Event}
 *            e mouse left click event
 * @private
 */
SweetDevRia.MenuItem.prototype._onclick = function(e){
	if (this.beforeClick (e))  {

		if(this.disabled) {
			SweetDevRia.EventHelper.stopPropagation(e);
			return false;	
		}
		this.valideItem(e);

		SweetDevRia.EventHelper.stopPropagation(e);

		this.fireEventListener (SweetDevRia.MenuItem.CLICK_EVENT, e);

		this.afterClick ();

		return false;	
	}
};


/**
 * Action execute when the user press a key down and the item is selected
 * 
 * @param {Event}
 *            e key down event
 * @private
 */
SweetDevRia.MenuItem.prototype._onkeydown = function(e){
	if (this.beforeKeyDown (e))  {
		switch(e.keyCode) {
			case SweetDevRia.KeyListener.ENTER_KEY:
				// validate item
				SweetDevRia.EventHelper.stopPropagation(e);
				this.valideItem(e);
				break;
			case SweetDevRia.KeyListener.ARROW_UP_KEY:
				this.selectPreviousItem();
				break;
			case SweetDevRia.KeyListener.ARROW_RIGHT_KEY:
				if((this.parentMenu.typeMenu == "MenuBar") && !this.hasItems() && this.parentItem && this.parentItem.parentItem && this.parentItem.parentItem.id == this.parentMenu.id){
					//If this item is the first child of a menu bar and has no sub menu then go to next menu item bar.
					this.parentItem.selectNextItem();
				} else {
					if (this.hasItems()) {
						// open submenu and select first item
						this.parentMenu.hasHover = false;
						this.parentMenu.hoverId = null;
						this.parentMenu.showSubItemsAction (this);
						this.items[0].selectItem(true);
					}
				}
				break;
			case SweetDevRia.KeyListener.ARROW_DOWN_KEY:
				this.selectNextItem();
				break;
			case SweetDevRia.KeyListener.ARROW_LEFT_KEY:
				if((this.parentMenu.typeMenu == "MenuBar") && !this.hasItems() && this.parentItem && this.parentItem.parentItem && this.parentItem.parentItem.id == this.parentMenu.id){
					//If this item is the first child of a menu bar and has no sub menu then go to previous menu item bar.
					this.parentItem.selectPreviousItem();
					break;
				} else {
					//If the parent item is the parent menu, we close the menu and execute the next case to do it
					if(this.parentMenu.id != this.parentItem.id){
						// Close the sub menu
						if ((!this.hasItems() || !this.isOpen ())) {
							this.parentMenu.hideSubItems (this.parentItem.id);
							this.parentItem.selectItem(true);
							this.parentMenu.hasHover = false;
						}				
						break;
					}
				}
			case SweetDevRia.KeyListener.TABULATION_KEY:
			case SweetDevRia.KeyListener.ESCAPE_KEY:
				 // Close de menu 
				if (this.parentMenu){
					if(this.parentMenu.hide){ 
						this.parentMenu.hide ();
					}
					this.parentMenu.hasHover = false;
					if(this.parentMenu.targetId){
						// If it is a context menu, give the focus to the target zone
						document.getElementById(this.parentMenu.targetId).focus();
					}
				} 
				break;
			default:
				break;
		}
		
		this.onkeydown();
	
		SweetDevRia.EventHelper.stopPropagation(e);

		//this.fireEventListener (SweetDevRia.MenuItem.KEYDOWN_EVENT, e);

		this.afterKeyDown ();

		return false;	
	}
};

SweetDevRia.MenuItem.prototype._onkeydownMenuBar = function(e){
	if (this.beforeKeyDown (e))  {
		switch(e.keyCode) {
			case SweetDevRia.KeyListener.ARROW_LEFT_KEY:
				this.selectPreviousItem();
				break;
			case SweetDevRia.KeyListener.ARROW_RIGHT_KEY:
				this.selectNextItem();
				break;
			case SweetDevRia.KeyListener.ARROW_UP_KEY:
			case SweetDevRia.KeyListener.ARROW_DOWN_KEY:
				this.parentMenu.isOpened = true;
				this.parentMenu.hasHover = true;
				this.parentMenu.hoverId = this.id;
			case SweetDevRia.KeyListener.ENTER_KEY:
				// validate item
				this.valideItem(e);
				if (this.hasItems()){
					this.items[0].selectItem(true);
				}
				break;
			default:
				break;
		}
		
		this.onkeydown();
	
		SweetDevRia.EventHelper.stopPropagation(e);

		//this.fireEventListener (SweetDevRia.MenuItem.KEYDOWN_EVENT, e);

		this.afterKeyDown ();

		return false;	
	}
};

/**
 * Give the focus to the menuItem
 */
SweetDevRia.MenuItem.prototype.focus = function(){
	var menuItem = document.getElementById(this.id);
	// focus on html element
	menuItem.focus();
};

/**
 * Give the focus to the menuItem
 */
SweetDevRia.MenuItem.prototype.valideItem = function(e){
	if(this.disabled) {
		return;	
	}

	if (! this.hasItems()) {
		if(this.checkbox){
			this.setChecked (!this.checked);
			SweetDevRia.EventHelper.stopPropagation(e);
			return false;
		}
		//Action a executer sur l'item.
		this.onclick();
		// If it's an item inside a contextmenu, we close the contextmenu
		//if (this.parentMenu && this.parentMenu.hide) {
		if (this.parentMenu.typeMenu == "ContextMenu") {
			this.parentMenu.hide ();
		}
	}
	else {
		this.parentMenu.hasHover = false;
		this.parentMenu.hoverId = null;
		this.parentMenu.showSubItemsAction (this);
	}
};


/**
 * Set the MenuItem disabled property
 * 
 * @param {boolean}
 *            disabled the new disabled property value
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
 * 
 * @param {boolean}
 *            checked the new checked property value
 */
SweetDevRia.MenuItem.prototype.setChecked = function(checked){

	if (this.beforeSetChecked (checked))  {

		this.checked = checked;

	    if(this.checked) {
			SweetDevRia.DomHelper.addClassName(this.iconView(),"ideo-mnu-check");
	        /*
			 * @cc_on
			 * SweetDevRia.DomHelper.addClassName(this.iconView(),"ideo-mnu-checkover"); @
			 */
			this.oncheck();
	    }
	    else{
			SweetDevRia.DomHelper.removeClassName(this.iconView(),"ideo-mnu-check");
	        /*
			 * @cc_on
			 * SweetDevRia.DomHelper.removeClassName(this.iconView(),"ideo-mnu-checkover"); @
			 */
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
 * 
 * @param {boolean}
 *            bool the new image property value
 */
SweetDevRia.MenuItem.prototype.setImage = function(image){
	if (this.beforeSetImage (image))  {
				
		this.image = image;
		this.iconView().style.backgroundImage = "url(" + this.image + ")";
		// SweetDevRia.DomHelper.addClassName(this.iconView(),image);
		
		this.fireEventListener (SweetDevRia.MenuItem.IMAGE_EVENT, image);
		
		this.afterSetImage ();
	}
};

SweetDevRia.MenuItem.prototype.initialize = function(){
	if(this.image){
		if (this.iconView()){
			this.iconView().style.backgroundImage = "url(" + this.image + ")";
		}
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
	// nothing
	// overrides Menu.destroy
};

SweetDevRia.MenuItem.prototype.template = "\
<li id=\"${id}\" tabindex=\"0\" onclick=\"return SweetDevRia.$('${id}')._onclick(event)\" onkeydown=\"SweetDevRia.EventHelper.stopPropagation(event); return SweetDevRia.$('${id}')._onkeydown(event)\" onkeypress=\"SweetDevRia.EventHelper.stopPropagation(event); return false;\" onkeyup=\"SweetDevRia.EventHelper.stopPropagation(event); return false;\" style=\"{if disabled == true}color:gray{/if} \">\
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


/*******************************************************************************
 * Internet Explorer hover hack
 ******************************************************************************/

SweetDevRia.MenuItem.updateZindex = function (id) {
	var menu = SweetDevRia.$ (id);
	/*
	 * if (menu) { }
	 */
};