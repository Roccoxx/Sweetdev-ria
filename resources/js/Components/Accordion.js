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
* @class
* Accordion
* @constructor
* @extends RiaComponent
* @base RiaComponent
* @param {String} id 	The id of the accordion
*/
SweetDevRia.Accordion = function(id){
	superClass (this, SweetDevRia.RiaComponent, id, "SweetDevRia.Accordion");
	this.id = id;
	this.items = {};
	this.openedItem = undefined;
	this.isOpening = false;
};

extendsClass(SweetDevRia.Accordion, SweetDevRia.RiaComponent);


/**
 * This method is called before opening a section. 
 * To be overridden !!
 * @param {String} accordionItemId The accordion item id to open
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Accordion.prototype.beforeOpen  = function(accordionItemId){  /* override this */ return true;  };

/**
 * This method is called after opening a section. 
 * To be overridden !!
 * @param {String} accordionItemId The accordion item id to open
 */
SweetDevRia.Accordion.prototype.afterOpen = function(accordionItemId){  /* override this */ };


/**
 * This event type is fired when open an accorion item
 * @static
 */
SweetDevRia.Accordion.OPEN_EVENT = "open";


/**
* Onload initialization.
* Open a default item on demand
* @private
*/
SweetDevRia.Accordion.prototype.initialize = function(){
	if(this.openAtStartupId){
		this.open(this.openAtStartupId);
	}
	return true;
};

/**
* Adds an item to the accordion, as hidden.
* @param {AccordionItem} accordionItem	The accordion item to add
* @private
*/
SweetDevRia.Accordion.prototype.addItem = function(accordionItem){
	this.items[accordionItem.id] = accordionItem;
	SweetDevRia.Accordion.hide( accordionItem.id );
};

/**
* Get an accordion item according to its id
* @param {String} id	The accordion item id
* @return the accordion item object
* @type AccordionItem
* @private
*/
SweetDevRia.Accordion.prototype.getItem = function(accordionItemId){
	return this.items[accordionItemId];
};

/**
* Open an accordion item. The actual opened item will be closed.
* @param {String} accordionItemId 	The accordion item id to open
*/
SweetDevRia.Accordion.prototype.open = function(accordionItemId){
	if(this.isOpening){
		return;
	}
	
	if(this.beforeOpen(accordionItemId)){
	
		if(this.getOpenedItem() != undefined){
			if(this.getOpenedItem() == this.items[accordionItemId]){
				this.closeActive();
				return;
			}
			else{
				this.isOpening = true;
				this.closeActive();
			}
		}
		this.isOpening = true;
		this.items[accordionItemId].open(this);
		this.openedItem = this.items[accordionItemId];
		
		this.fireEventListener (SweetDevRia.Accordion.OPEN_EVENT, accordionItemId);

		this.afterOpen(accordionItemId);
	}
};

/**
* Close an accordion item
* @param {AccordionItem} accordionItem 	The accordion item to close
* @private
*/
SweetDevRia.Accordion.prototype.close = function(accordionItem){
	if(this.getOpenedItem() == accordionItem){
		accordionItem.close(this, !this.isOpening);
		this.openedItem = undefined;
	}
};

/**
* Close the active accordion item
*/
SweetDevRia.Accordion.prototype.closeActive = function(){
	this.close(this.getOpenedItem());
};

/**
* Return the current opened accordion item
* @return the current opened accordion item
* @type AccordionItem
* @private
*/
SweetDevRia.Accordion.prototype.getOpenedItem = function(){
	return this.openedItem;
};


/**
* Return whether an item is opened or not.
* @param {String} accordionItemId	The id to check
* @return true if the accordion item is open, false otherwise
* @type boolean
*/
SweetDevRia.Accordion.prototype.isOpen = function(accordionItemId){
	return this.items[accordionItemId].isOpen();
};


/*--------------------- Accordion Item -------------------------*/


/**
* @class
* AccordionItem
* @constructor
* @param {String} id 		the id of the item
* @param {String} title 	the displayed title of the item
* @private
*/
SweetDevRia.AccordionItem = function(id, title){
	this.id = id;
	this.title = title;
	this.isOpen = false;
};

/**
* Return whether this item is opened or not.
* @return true if this item is open, false otherwise
* @type boolean
*/
SweetDevRia.AccordionItem.prototype.isOpen = function(){
	return this.isOpen;
};

/**
* Open this item, using Yahoo animation
* @param {Accordion} acc the accordion item around this one
*/
SweetDevRia.AccordionItem.prototype.open = function(acc){
	var itemContent = SweetDevRia.DomHelper.get(this.id);
	var frame = SweetDevRia.$(acc.id).getFrame();
	SweetDevRia.DomHelper.verticalShow(itemContent, 0.4, function(){itemContent.style.height="";acc.isOpening = false;frame.refreshBorders();}, function(){frame.refreshBorders();});
	SweetDevRia.DomHelper.addClassName(SweetDevRia.DomHelper.get(this.id+"_header"), "ideo-acc-openedHeader");
	SweetDevRia.DomHelper.addClassName(SweetDevRia.DomHelper.get(this.id), "ideo-acc-openedContent");
};

/**
* Close this item, using Yahoo animation
* @param {Accordion} acc the accordion item around this one
* @param {boolean} refresh if the frame must be refreshed during this close (false if an open is processed simultaneously)
*/
SweetDevRia.AccordionItem.prototype.close = function(acc, refresh){
	var frame = SweetDevRia.$(acc.id).getFrame();
	if(refresh){
		SweetDevRia.DomHelper.verticalHide(SweetDevRia.DomHelper.get(this.id), 0.4, function(){frame.refreshBorders();}, function(){frame.refreshBorders();});
	}else{
		SweetDevRia.DomHelper.verticalHide(SweetDevRia.DomHelper.get(this.id), 0.4);
	}
	SweetDevRia.DomHelper.removeClassName(SweetDevRia.DomHelper.get(this.id+"_header"), "ideo-acc-openedHeader");
	SweetDevRia.DomHelper.removeClassName(SweetDevRia.DomHelper.get(this.id), "ideo-acc-openedContent");
};

/**
* Show a DOM component
* @param {String} id Id of component to show
* @private
*/
SweetDevRia.Accordion.show = function (id) {
	var comp = document.getElementById(id);
	if (comp) {
		comp.style.display = "block";
	}
};

/**
* Hide a DOM component
* @param {String} id Id of component to hidde
* @private
*/
SweetDevRia.Accordion.hide = function (id) {
	var comp = document.getElementById(id);
	if (comp) {
		comp.style.display = "none";
	}
};