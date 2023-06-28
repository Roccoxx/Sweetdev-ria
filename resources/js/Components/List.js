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
 * This is the List component class
 * @param {String} id Id of this list
 * @constructor
 * @extends RiaComponent
 * @base RiaComponent
 */
SweetDevRia.List = function(id){
	superClass (this, SweetDevRia.RiaComponent, id, "List");

	this.modifiedItemIndex = null;
	
	this.listItems = [];
	
	this.width = null;
	this.height = null;
	
	this.mapping = null;
	this.itemCount = 0;
	
	this.itemPerPage = 0;
	this.totalItemNumber = 0;
	
	this.pageNumber = 1;
	
	this.hasBeenInitialized = false;
	
	this.deleteConfirmationAlert = null;
	
	this.isStateful = true;
	
	SweetDevRia.addListener (this, SweetDevRia.RiaComponent.RENDER_EVENT, SweetDevRia.List.prototype.listAfterRender, null);
};

extendsClass(SweetDevRia.List, SweetDevRia.RiaComponent);


/**
 * This method is called before set size. 
 * To be overridden !!
 * @param {int} width The new list width
 * @param {int} height The new list height
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.List.prototype.beforeSetSize  = function(width, height){  /* override this */ return true;  };

/**
 * This method is called after set size. 
 * To be overridden !!
 * @param {int} width The new list width
 * @param {int} height The new list height
 */
SweetDevRia.List.prototype.afterSetSize = function(width, height){  /* override this */ };

/**
 * This method is called before Insert a new list item. 
 * To be overridden !!
 * @param {Object} data The new data value
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.List.prototype.beforeInsertData  = function (data, index){  /* override this */ return true;  };

/**
 * This method is called after Insert a new list item. 
 * To be overridden !!
 * @param {Object} data The new data value
 */
SweetDevRia.List.prototype.afterInsertData = function(data, index){  /* override this */ };

/**
 * This method is called before Modify a list item value. 
 * To be overridden !!
 * @param {int} index Index of item to modify
 * @param {Object} data The new data value
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.List.prototype.beforeModifyData  = function(index, data){  /* override this */ return true;  };

/**
 * This method is called after Modify a list item value. 
 * To be overridden !!
 * @param {int} index Index of item to modify
 * @param {Object} data The new data value
 */
SweetDevRia.List.prototype.afterModifyData = function(index, data){  /* override this */ };

/**
 * This method is called before Delete a data. 
 * To be overridden !!
 * @param {int} index Data index to delete
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.List.prototype.beforeDeleteData  = function(index){  /* override this */ return true;  };

/**
 * This method is called after Delete a data. 
 * To be overridden !!
 * @param {int} index Data index to delete
 */
SweetDevRia.List.prototype.afterDeleteData = function(index){  /* override this */ };

/**
 * This event type is fired when resize the list component
 */
SweetDevRia.List.RESIZE_EVENT = "resize";

/**
 * This event type is fired when  add a list item
 */
SweetDevRia.List.ADD_EVENT = "add";

/**
 * This event type is fired when  insert a list item
 */
SweetDevRia.List.INSERT_EVENT = "insert";

/**
 * This event type is fired when modify a list item
 */
SweetDevRia.List.MODIFY_EVENT = "modify";

/**
 * This event type is fired when delete a list item
 */
SweetDevRia.List.DELETE_EVENT = "delete";

/**
 * This event type is fired when move a list item
 */
SweetDevRia.List.MOVE_EVENT = "move";


/**
 * Set the data into the list component
 * @param {Array} data the array of bean to set.
 * @private
 */
SweetDevRia.List.prototype.setList = function(data){
	this.listItems = new Array();
	for(var i=0;i<data.length;++i){
		this.listItems.push( this.createItem(data[i]) );
	}
};

/**
 * Set the data into the list component
 * @param {Array} data the array of bean to set.
 * @private
 */
SweetDevRia.List.prototype.addItems = function(data){
	for(var i=0;i<data.length;++i){
		this.listItems.push( this.createItem(data[i]) );
	}
};

/**
 * This method is automatically called at the page load
 * @private
 */
SweetDevRia.List.prototype.initialize = function () {
	this.generateWindow (this.windowWidth, this.windowHeight);

	this.generateMenu();
	
	this.itemCount = this.listItems.length;
	
	if(this.itemPerPage==0){
		this.pageNumber = 0;
	}
	else{
		this.pageNumber = Math.ceil (this.totalItemNumber / this.itemPerPage);
	}
	
	if (this.pageNumber > 1) {
		this.createPageBar ();
	}
	
	if(browser.isIE && browser.version<7){
		SweetDevRia.EventHelper.addListener(document.getElementById(this.id+'_container'),'mouseover',this.onMouseover,this,true);
		SweetDevRia.EventHelper.addListener(document.getElementById(this.id+'_container'),'mouseout',this.onMouseout,this,true);
	}
};

SweetDevRia.List.prototype.onMouseover = function(e){	
	var li = SweetDevRia.DomHelper.getAncestorByType(e.toElement,'LI');
	if(li){
		li.firstChild.style.backgroundColor = 'buttonface';
	}
};

SweetDevRia.List.prototype.onMouseout = function(e){
	var li = SweetDevRia.DomHelper.getAncestorByType(e.fromElement,'LI');
	if(li){
		li.firstChild.style.backgroundColor = 'white';
	}
};

SweetDevRia.List.prototype.listAfterRender = function () {
	if(this.canOrder){
		for (var i = 0; i <  this.listItems.length; i++) {
			this.addItemDD (this.listItems[i]);
		}

		this.addContainerDrop ();
		
		this.hasBeenInitialized = true;
	}
};

/**
 * This method is called at the list resizer drop
 * @param {list} list list component associated wit this resizer
 * @private
 */
SweetDevRia.List.prototype.resizerOnMouseUp = function(list){
	return function(e){
        var node = this.getEl();

		var listElem = document.getElementById (list.id+"_list");

        var listHeight = listElem.offsetHeight;
        var listWidth = listElem.offsetWidth;
		var listCoord = SweetDevRia.DomHelper.getXY (listElem);

		var nodeCoord = SweetDevRia.DomHelper.getXY (node);
		
		var top = parseInt(node.style.top,10);
		var left = parseInt(node.style.left,10);

		list.setSize (left, top);

	};
};

/**
 * Return the render of the list
 * @param {int} width The new list width
 * @return the DOM String representing the list
 * @type String
 * @private
 */
SweetDevRia.List.prototype.getListRender = function(){
	var str = "";
	for(var i=0;i<this.listItems.length;++i){
		str+=this.listItems[i].render();
	}
	return str;
};

/**
 * Modify the list size
 * @param {int} width The new list width (null to keep the previous value)
 * @param {int} height The new list height (null to keep the previous value)
 */
SweetDevRia.List.prototype.setSize= function(width, height){
	if (this.beforeSetSize (width, height)) {
		if (this.canResize) {
			var container = document.getElementById (this.id+"_container");
			var listElem = document.getElementById (this.id+"_list");

			if (width) {
				container.style.width = width+"px";
				listElem.style.width = width+"px";
			}
		
			if (height) {
				container.style.height = height+"px";
				listElem.style.height = height+"px";
			}
		}
		
		this.fireEventListener (SweetDevRia.List.RESIZE_EVENT, [width, height]);

		this.afterSetSize (width, height);
	}
};


/**
 * This method is called before the list resizer drag
 * @param {list} list list component associated wit this resizer
 * @private
 */
SweetDevRia.List.prototype.resizerOnMouseDown = function(list){
	return function(e){
		list.resizer.resetConstraints ();
	};
};

//Adapt the container width
SweetDevRia.List.prototype.adaptWidth = function(){
	var ul = SweetDevRia.DomHelper.get(this.id+"_ul");
	var max = 0;
	
	for(var i=0;i<ul.childNodes.length;i++){
		if(ul.childNodes[i].tagName == 'LI'){
			if(ul.childNodes[i].offsetWidth>max){
				max = ul.childNodes[i].offsetWidth;
			}
		}
	}
	var list = SweetDevRia.DomHelper.get(this.id+"_list");
	list.style.width = max+"px";
};

// SWTRIA-1323 : Adapt container width if a vertical scrollbar appears
SweetDevRia.List.prototype.adaptWidthWithScrollBar = function(){
	var container = document.getElementById (this.id+"_container");
	var list = SweetDevRia.DomHelper.get(this.id+"_list");
	var verticalScrollWidth = (list.offsetWidth + list.scrollWidth) - (2 * SweetDevRia.DomHelper.getWidth(list));
	if (verticalScrollWidth > 0) {
		var canResize = this.canResize;
		this.canResize = true;
		this.setSize (SweetDevRia.DomHelper.getWidth(list) + verticalScrollWidth, null);
		this.canResize = canResize;
	}
};

/**
 * Generate the list context menu that allow to the user to add, delete or modify items.
 * @private
 */
SweetDevRia.List.prototype.generateMenu = function () {
	if (! this.canAdd && ! this.canModify && ! this.canDelete) {
		return;
	}

	var menu = new SweetDevRia.ContextMenu (this.id + "Menu");
	menu.targetId = this.id+"_ul";

	var list = this;

	menu.beforeShow = function (e){
		e = SweetDevRia.EventHelper.getEvent (e);

		var src = e.src;
		
		while (! SweetDevRia.DomHelper.hasClassName(src, "ideo-lst-item") && src != document.body) {
			src = src.parentNode;
		}
		

		menu.clickedItem = SweetDevRia.DomHelper.getDomPos(list.getListUL(), src.parentNode.id, false); 

		SweetDevRia.EventHelper.stopPropagation(e);
		
		return true;  
	};
	
	if (this.canAdd) {
		var menuAddItem = new SweetDevRia.MenuItem(this.id + "menuAddItem");
		menuAddItem.label = this.getMessage ("addItem");
		menuAddItem.checkbox = false;
		menuAddItem.checked = false;
		menuAddItem.disabled = false;
		menuAddItem.image = null ;
		menuAddItem.onclick = function(){list.addItem();};
		menuAddItem.oncheck = function(){};
		menuAddItem.onuncheck = function(){};

		menu.addItem(menuAddItem);
	}

	if (this.canModify) {
		var menuModifyItem = new SweetDevRia.MenuItem(this.id + "menuModifyItem");
		menuModifyItem.label = this.getMessage ("modifyItem");
		menuModifyItem.checkbox = false;
		menuModifyItem.checked = false;
		menuModifyItem.disabled = false;
		menuModifyItem.image = null ;
		menuModifyItem.onclick = function(){list.modifyItem(menu.clickedItem);};
		menuModifyItem.oncheck = function(){};
		menuModifyItem.onuncheck = function(){};
	
		menu.addItem(menuModifyItem);
	}

	if (this.canDelete) {
		var menuDeleteItem = new SweetDevRia.MenuItem(this.id + "menuDeleteItem");
		menuDeleteItem.label = this.getMessage ("deleteItem");
		menuDeleteItem.checkbox = false;
		menuDeleteItem.checked = false;
		menuDeleteItem.disabled = false;
		menuDeleteItem.image = null ;
		menuDeleteItem.onclick = function(){
			if(!list.deleteConfirmationAlert){
				var myalert = new SweetDevRia.Alert(list.id + "_delete_confirm_alert");
				myalert.setModal(true);
				myalert.setType(SweetDevRia.Alert.PLAIN);
				myalert.setActionType(SweetDevRia.Alert.YES_NO);
				myalert.i18n={};
				
				myalert.i18n["buttonYes"] = list.i18n["yesConfirmation"];
				myalert.i18n["buttonNo"] = list.i18n["noConfirmation"];
				myalert.onYes = function(){
					list.deleteItem(menu.clickedItem);
				};
				myalert.onNo = function(){};
				list.deleteConfirmationAlert = myalert;
			}
			list.deleteConfirmationAlert.show();
		};

		menuDeleteItem.oncheck = function(){};
		menuDeleteItem.onuncheck = function(){};
	
		menu.addItem(menuDeleteItem);
	}

	// create menu !
	menu.render ();

	menu.initialize ();

	//Context menu triggered on blank panel
	if (this.canAdd) {
		var menu = new SweetDevRia.ContextMenu (this.id + "AddMenu");
		menu.targetId = this.id+"_list";

		var list = this;
	
		var menuAddItem = new SweetDevRia.MenuItem(this.id + "menuAddItem_only");
		menuAddItem.label = this.getMessage ("addItem");
		menuAddItem.checkbox = false;
		menuAddItem.checked = false;
		menuAddItem.disabled = false;
		menuAddItem.image = null ;
		menuAddItem.onclick = function(){list.addItem();};
		menuAddItem.oncheck = function(){};
		menuAddItem.onuncheck = function(){};
	
		menu.addItem(menuAddItem);

		// create menu !
		menu.render ();
	
		menu.initialize ();
	}

};

/**
 * Default format method
 * To be overridden !!
 * @param {Object} data Data to format for list display
 * @return the formatted data to display in the list
 * @type String
 */
SweetDevRia.List.prototype.formatData = function (data) {
	return data;
};

/**
 * @private
 */
SweetDevRia.List.prototype.createItem = function (data) {
	var itemId = null;
	if (data && data.id) {
		itemId = data.id;
	}
	else {
		var itemId = this.itemCount;
		
		while (this.existItemId (itemId)) {
			itemId = itemId + 1;
		}
	}

	var item = new SweetDevRia.ListItem(itemId, this, data);
	this.itemCount++;
	return item;
};

SweetDevRia.List.prototype.existItemId = function (itemId) {

	for(var i=0;i< this.listItems.length; i++){
		if (this.listItems[i].id == itemId) {
			return true;
		}
	}
		
	return false;
};

SweetDevRia.List.prototype.indexOf = function (itemId) {

	for(var i=0;i< this.listItems.length; i++){
		if (this.listItems[i].id == itemId) {
			return i;
		}
	}
		
	return -1;
};

/**
 * Action to open the window for add item. Reset the window form.
 * @private
 */
SweetDevRia.List.prototype.addItem = function () {
	if (this.canAdd) {
		this.resetForm ();
		this.resetMandatoryErrors();
		
		var win = SweetDevRia.$(this.id+"_win");
		win.setTitle (this.getMessage ("addWindowHeader"));
		
		document.getElementById (this.id+"_win_addButton").style.display = "";
		document.getElementById (this.id+"_win_modifyButton").style.display = "none";
		
		this.openWindow ();
	}
};

/**
 * Reset the mandatories displayed error applied to this component's windows form
 * @private
 */
SweetDevRia.List.prototype.resetMandatoryErrors = function(){
	var mandatories = SweetDevRia.Mandatory.getFormControl(this.formId);
	if(mandatories){
		for(var i=0;i<mandatories.length;++i){
			mandatories[i].clearErrors();
		}
	}
};

/**
 * Action to open the window for modify. Set the window form with the data to modify.
 * @param {int} itemIndex Index of the item to modify
 * @private
 */
SweetDevRia.List.prototype.modifyItem = function (itemIndex) {
	if (this.canModify) {
		this.resetForm ();
	
		var data = this.listItems [itemIndex].data;
	
		var form = document.getElementById (this.formId); 
		SweetDevRia.Form.setFormData (form, data, this.mapping);
		
		this.resetMandatoryErrors();
		
		this.modifiedItemIndex = itemIndex;

		var win = SweetDevRia.$(this.id+"_win");
		win.setTitle (this.getMessage ("modifyWindowHeader"));

		document.getElementById (this.id+"_win_addButton").style.display = "none";
		document.getElementById (this.id+"_win_modifyButton").style.display = "";
		
		this.openWindow ();
	}
};

/**
 * Action to delete an item.
 * @param {int} itemIndex Index of the item to delete
 * @private
 */
SweetDevRia.List.prototype.deleteItem = function (itemIndex) {

	if (this.canDelete) {
		this.deleteData (itemIndex);

		var li = SweetDevRia.DomHelper.getChildAt(this.getListUL(), itemIndex);

		SweetDevRia.DomHelper.removeNode (li);
		
		this.getFrame().refreshBorders ();
	}
};


SweetDevRia.List.prototype.deleteItemById = function (itemId) {
	var index = this.indexOf (itemId);
	this.deleteItem (index);
};

/**
 * Updates the server model.
 */
SweetDevRia.List.prototype.updateServerModel = function () {
	SweetDevRia.ComHelper.fireEvent();
};




/************************* DATA MODIFICATION ***************************/

/**
 * Modify action, call the modifyData method after have get modified value inside form data
 * @private
 */
SweetDevRia.List.prototype.modifyDataAction = function (evt) {
	if (this.canModify) {
		if (this.modifiedItemIndex != null) {
			var form = document.getElementById (this.formId); 
		
			var res = SweetDevRia.Mandatory.testFormMandatory (this.formId);
		
			if (res) {
				var modifiedData = SweetDevRia.Form.getFormData (form, this.mapping);
			
				this.modifyData (this.modifiedItemIndex, modifiedData);
				
				this.modifiedItemIndex = null;

				return this.closeWindow (evt);
			}	
		}
	}
};

/**
 * Modify a list item value
 * @param {int} index Index of item to modify
 * @param {Object} data The new data value
 */
SweetDevRia.List.prototype.modifyData = function (index, data) {
	if (this.beforeModifyData (index, data)) {
		if (this.canModify) {
			var taga = this.listItems[index].getATag( ); 
			var format = this.formatData (data);
			
			SweetDevRia.DomHelper.removeChildren (taga);
			var mydiv = document.createElement ("div");
			mydiv.innerHTML = format;
			taga.appendChild (mydiv);

			this.listItems [index].data = data;
			
			var params = {"index":index, "data":data};
			var riaEvent = new SweetDevRia.RiaEvent ("modify", this.id, params);
			
			if(this.isStateful){
				SweetDevRia.ComHelper.fireEvent(riaEvent);
			}
		}
		
		this.fireEventListener (SweetDevRia.List.MODIFY_EVENT, [index, data]);

		this.afterModifyData (index, data);
	}
};


/**
 * Insert a new list item
 * @param {Object} data The new data value
 * @param {int} index The new data index
 */
SweetDevRia.List.prototype.insertData = function (data, index) {
	if (index == null) {
		index = this.listItems.length;
	}
	
	if (this.beforeInsertData (data, index)) {
		if (this.canAdd) {
			var item = this.createItem(data);
			this.listItems.insertAt (item, index);
			
			var mydiv = document.createElement ("div");
			
			mydiv.setAttribute ("id", item.getATagId()); 
			mydiv.setAttribute ("onclick", "return false;"); 
			mydiv.setAttribute ("href", "#"); 
	
			var li = document.createElement ("li");
			li.setAttribute ("id", item.getLiTagId() ); 

			li.appendChild (mydiv);
		
			var ul = this.getListUL();
			if (index < ul.childNodes.length) {
				var nextChild = SweetDevRia.DomHelper.getChildByTagName (ul, index, "li");
				ul.insertBefore (li, nextChild);
			}
			else {
				ul.appendChild (li);
			}
			
			SweetDevRia.DomHelper.addClassName(li, "ideo-lst-li");
			SweetDevRia.DomHelper.addClassName(mydiv, "ideo-lst-item");

			var format = this.formatData (data);

			mydiv.innerHTML = format;
			
			if(this.canOrder){
				this.addItemDD (item);
			}
			
			this.getFrame().refreshBorders ();
			
			var params = {"data":data, "index" : index};
			var riaEvent = new SweetDevRia.RiaEvent ("insert", this.id, params);
			
			if(this.isStateful){
				SweetDevRia.ComHelper.fireEvent(riaEvent);
			}
		}
		
		this.fireEventListener (SweetDevRia.List.INSERT_EVENT, [index, data]);

		this.afterInsertData (data, index);
	}
};


SweetDevRia.List.prototype.addItemsDD = function(){
	for(var i=0;i<this.listItems.length;++i){
		this.addItemDD(this.listItems[i]);
	}
};

SweetDevRia.List.prototype.addItemDD = function (item) {
	var list = this;
	var itemId = item.getLiTagId();
	
	if(SweetDevRia.$(itemId+"_drag")==null){
	
		new SweetDevRia.DD (itemId+"_drag");
	
		SweetDevRia.$(itemId+"_drag").setDragId (itemId);
		SweetDevRia.$(itemId+"_drag").setFakeMode (SweetDevRia.DD.CLONE);
		SweetDevRia.$(itemId+"_drag").group = this.id+"_group";
	
		SweetDevRia.$(itemId+"_drag").constraintId = this.id+"_list";
		SweetDevRia.$(itemId+"_drag").constraintType = SweetDevRia.DD.VERTICAL;
	
		SweetDevRia.$(itemId+"_drag").insertMode = SweetDevRia.DD.VERTICAL_INSERT;
		SweetDevRia.$(itemId+"_drag").dragObjectClass = "selected";
		SweetDevRia.$(itemId+"_drag").overBeforeClass = "top";
		SweetDevRia.$(itemId+"_drag").overAfterClass = "bottom";
		SweetDevRia.$(itemId+"_drag").listItem = item;
	
		SweetDevRia.$(itemId+"_drag").onStartDrag = function(){		
			this.isDropped = false;
			this.listItem.computePosition();
		};
	
	
		SweetDevRia.$(itemId+"_drag").onDrop = function(dragObject, dragPosition){
			var oldPos = dragObject.listItem.position;
			dragObject.listItem.computePosition();
			var dropPos = dragObject.listItem.position;
					
			if(oldPos != dropPos){
				list.listItems.splice(oldPos, 1);
				list.listItems.insertAt(dragObject.listItem, dropPos);
				
				var params = {"oldIndex":oldPos, "newIndex":dropPos};
				var riaEvent = new SweetDevRia.RiaEvent ("move", list.id, params);
				
				if(list.isStateful){
					SweetDevRia.ComHelper.fireEvent(riaEvent);
				}
	
				list.fireEventListener (SweetDevRia.List.MOVE_EVENT, [oldPos, dropPos]);

				dragObject.isDropped = true;
			}
		};
	
		SweetDevRia.$(itemId+"_drag").createClone = function(node){
			var div = document.createElement("div");
			SweetDevRia.DomHelper.addClassName(div, "ideo-dd-clone");
			
			div.innerHTML = node.innerHTML;
			this.cleanAllIds(div);
			return div; 
		};
		
	}

	if (this.hasBeenInitialized) {
		SweetDevRia.$(itemId+"_drag").initialize ();
	}
};

SweetDevRia.List.prototype.addContainerDrop = function () {
	var list = this;
	
	var id = this.id+"_list";

	var drop = new SweetDevRia.DD (id+"_drag");
	drop.setDragId (id);
	drop.group = this.id+"_group";
	drop.canDrag = false;
	drop.applyDropCss = false;

	function getHoverNode (node, y) {
		for (var i = 0; i< node.childNodes.length; i++) {
			var child = node.childNodes [i];
			if (child.nodeType != 3) {
				var box = YAHOO.util.Region.getRegion (child);
				if (box && box.top <= y && box.bottom >= y ) {
					return child;
				}
			}
		}

		return null;		
	}

	drop.onDrop = function(dragObject, dragPosition){
		if (dragObject.isDropped == true) {
			return;
		}

		var ul = list.getListUL();
		var posY = dragPosition[1] + SweetDevRia.DomHelper.getY(ul);
		var hover = getHoverNode(ul, posY);

		if (hover == null) {
			var oldPos = dragObject.listItem.position;
			var dropPos = list.listItems.length - 1;
	
			if(oldPos != dropPos){
			    var node = dragObject.getEl();
				var parent = node.parentNode;
				parent.appendChild (node);
				
				list.listItems.splice(oldPos, 1);
				list.listItems.insertAt(dragObject.listItem, dropPos);
				
				var params = {"oldIndex":oldPos, "newIndex":dropPos};
				var riaEvent = new SweetDevRia.RiaEvent ("move", list.id, params);
				
				if(list.isStateful){
					SweetDevRia.ComHelper.fireEvent(riaEvent);
				}

				list.fireEventListener (SweetDevRia.List.MOVE_EVENT, [oldPos, dropPos]);
				
			}
		}
	};

	if (this.hasBeenInitialized) {
		drop.initialize ();
	}

};


/**
 * Add action, call the addData method after have get new value inside form data
 * @private
 */
SweetDevRia.List.prototype.addDataAction = function (evt) {

	if (this.canAdd) {
		var form = document.getElementById (this.formId); 
	
		var res = SweetDevRia.Mandatory.testFormMandatory (this.formId);
	
		if (res) {
			var data = SweetDevRia.Form.getFormData (form,  this.mapping);
	
			this.insertData (data);		

			return this.closeWindow (evt);
		}

	}

};

/**
 * Delete a data
 * @param {int} index Data index to delete
 */
SweetDevRia.List.prototype.deleteData = function (index) {
	if (this.beforeDeleteData (index)) {

		if (this.canDelete) {
			this.listItems.splice (index, 1);
			
			var params = {"index":index};
			var riaEvent = new SweetDevRia.RiaEvent ("delete", this.id, params);
			
			if(this.isStateful){
				SweetDevRia.ComHelper.fireEvent(riaEvent);
			}
		}
		
		this.fireEventListener (SweetDevRia.List.DELETE_EVENT, index);

		this.afterDeleteData (index);
	}
};

/**
 * Reset form data
 * @private
 */
SweetDevRia.List.prototype.resetForm = function () {
	this.moveWindow ();

	var form = document.getElementById (this.formId); 
	for (var i = 0; i <  form.elements.length; i++) {
		var elem = form.elements [i];
		var id = elem.id;
		var name = elem.name;
		if (id || name) {
			SweetDevRia.Form.resetComponent (elem);
		}
	}
};

/**
 * Generate the window containing input form.
 * @param {int} width Window width
 * @param {int} height Window height
 * @private
 */
SweetDevRia.List.prototype.generateWindow = function (width, height) {
	
	var win = new SweetDevRia.Window(this.id+"_win", -1, -1, width, height);
	win.content = TrimPath.processDOMTemplate(this.templateWindow, this);

	win.title = this.getMessage ("addWindowHeader");	
	win.modal = true;	
	win.canMaximize = false;
	win.canMinimize = false;
	win.showTitleIcon = false;
	win.isResizable = false;
    win.isOpen = false;
    win.isLoaded = true;

	win.render ();
	win.initialize ();

};

/**
 * Close the window containing input form
 * @param {Event} evt Mouse event
 * @private
 */
SweetDevRia.List.prototype.closeWindow = function (evt) {
	SweetDevRia.$(this.id+'_win').close ();	
	SweetDevRia.EventHelper.stopPropagation(evt);
	return false;
};

/**
 * Move window at the initialize
 * @private
 */
SweetDevRia.List.prototype.moveWindow = function () {
	if (this.windowMoved == true) {return;}

	var win = SweetDevRia.$(this.id+"_win");
	var content = document.getElementById (win.id+"_content");
	var panel = document.getElementById (win.id+"_form");
	if(content.parentNode != panel) {
		var form = document.createElement ("form");
		form.setAttribute ("id", this.formId);

		form.appendChild(content);
		panel.appendChild(form);
		content.style.display = "block";
	}
	
	this.windowMoved = true;
	
};

/**
 * Create the pagination bar. 
 * @private
 */
SweetDevRia.List.prototype.createPageBar = function(){
	
	var pageBar = new SweetDevRia.PageBar (this.id+"_pageBar");	

	pageBar.setPageNumber (this.pageNumber);
	pageBar.setActualPage (this.actualPage);
	pageBar.setLinkedId (this.id);

	var container = document.getElementById (pageBar.id+"_container");
	container.style.display = "";
	
	// Debut SWTRIA-987
	pageBar.i18n["firstTitle"] 		= this.i18n["firstTitle"];
	pageBar.i18n["prevTitle"] 		= this.i18n["prevTitle"];
	pageBar.i18n["nextTitle"] 		= this.i18n["nextTitle"];
	pageBar.i18n["lastTitle"] 		= this.i18n["lastTitle"];
	pageBar.i18n["noFirstTitle"]	= this.i18n["noFirstTitle"];
	pageBar.i18n["noPrevTitle"] 	= this.i18n["noPrevTitle"];
	pageBar.i18n["noNextTitle"] 	= this.i18n["noNextTitle"];
	pageBar.i18n["noLastTitle"] 	= this.i18n["noLastTitle"];
	// Fin SWTRIA-987

	// create pageBar !
	pageBar.render ();
	//SweetDevRia.init();//useless, automatically stacked into the initialization
};

/**
 * Change the displayed page into table pagination
 * @param {int} actualPage New displayed page number
 * @see SweetDevRia.PageBar.prototype.goToPage
 */
SweetDevRia.List.prototype.goToPage = function(actualPage){
	//if (this.beforeGoToPage (actualPage)) {
		this.actualPage = actualPage;

		//SweetDevRia.showWaitingMessage (this.getMessage("paginationWaiting"), "ideo-ndg-waitingMessage");
		//SweetDevRia.centerWaitingMessage(SweetDevRia.DomHelper.get(this.id));

		//this.updateServerModel ();

		var params = {};
		params ["listId"] =  this.id;
		params ["actualPage"] = this.actualPage;
		
		if(this.isStateful){
			SweetDevRia.ComHelper.fireEvent (new SweetDevRia.RiaEvent ("pagin", this.id, params));
		}
		
	//	this.afterGoToPage (actualPage);
	//}

};

/**
 * This method is called on server pagination callback
 * @param {RiaEvent} evt Event containing data to displayed
 * @private
 */
SweetDevRia.List.prototype.onPagin = function(evt) {
	this.setList(evt.data);
	SweetDevRia.DomHelper.get(this.id+'_ul').innerHTML = this.getListRender();
	
	this.addItemsDD();

	//SweetDevRia.hideWaitingMessage ();
	
	this.adaptWidth();
	this.getFrame().refreshBorders();

	return true;
};

/*** ListItem class ***/

SweetDevRia.ListItem = function(id, list, data){
	this.id = id;
	this.list = list;
	this.data = data;
};


SweetDevRia.ListItem.prototype.getATag = function(){
	return SweetDevRia.DomHelper.get(this.getATagId());
};
SweetDevRia.ListItem.prototype.getATagId = function(){
	return this.list.id+"_"+this.id;
};

SweetDevRia.ListItem.prototype.getLiTag = function(){
	return SweetDevRia.DomHelper.get(this.getLiTagId());
};
SweetDevRia.ListItem.prototype.getLiTagId = function(){
	return this.list.id+"_item_"+this.id;
};

SweetDevRia.ListItem.prototype.getDataFormatted = function(){
	return this.list.formatData(this.data);
};

SweetDevRia.ListItem.prototype.render = function(){
	var str =  TrimPath.processDOMTemplate(this.template, this);
	return str;
};

SweetDevRia.ListItem.prototype.computePosition = function(){
	this.position = SweetDevRia.DomHelper.getDomPos(this.list.getListUL(), this.getLiTagId(), false);
};



/**
 * Open the window containing input form
 * @private
 */
SweetDevRia.List.prototype.openWindow = function () {
	this.moveWindow ();
	
	var win = SweetDevRia.$(this.id+"_win");
	win.restore();
	win.open ();	
};

SweetDevRia.List.prototype.getListUL = function(){
	return SweetDevRia.DomHelper.get (this.id+"_ul");
};

SweetDevRia.List.prototype.templateWindow = 
"\
<div id=\"${id}_win_form\"></div>\
<div id=\"${id}_list_win_btnContent\" class=\"ideo-list-winCenter\">\
<button type=\"submit\" id=\"${id}_win_addButton\" class=\"ideo-list-winButton\" onclick=\"return SweetDevRia.$('${id}').addDataAction (event);\">${i18n.addButton}</button>\
<button type=\"submit\" id=\"${id}_win_modifyButton\" class=\"ideo-list-winButton\" onclick=\"return SweetDevRia.$('${id}').modifyDataAction (event);\">${i18n.modifyButton}</button>\
<button id=\"${id}_win_cancelButton\"  onclick=\"return SweetDevRia.$('${id}').closeWindow (event)\" class=\"ideo-list-winButton\">${i18n.cancelButton}</button>\
</div>\
";


//<div id=\"${id}_container\" class=\"ideo-ndg-table\" style=\"{if width}width : ${width}px;{/if}{if height}height : ${height}px;{/if}\">\


/**
 *	<a style=\"background-color:green;\"></a>\
 *	Hack pour que le premier element de la liste applique le style :hover
 *	les autres l'applique bien et le background apparait grave au 
 *	background-color:white; de ideo-lst-item
 */ 
SweetDevRia.List.prototype.template = 
"\
	<div id=\"${id}_list\" class=\"ideo-lst-list\" style=\"overflow: auto; float: left;{if width}width : ${width}px;{else}width: auto;{/if}{if height}height: ${height}px;{/if}\">\
		<a style=\"background-color: green;\"></a>\
		<ul id=\"${id}_ul\"  class=\"ideo-lst-ul\">\
			${getListRender()}\
		</ul>\
		<span id=\"${id}_pageBar_container\" style=\"display: {if pageNumber > 1}block{else}none{/if};\"\ class=\"ideo-pgb-pagebar\">&nbsp;</span>\
	</div>\
	<div id=\"${id}_delete_confirm_alert_message\" style=\"display: none;\">${i18n.deleteConfirmation}<br /></div>\
	<div style=\"clear:both;display: none;\"/>\
";


SweetDevRia.ListItem.prototype.template = 
"\
	<li id=\"${getLiTagId()}\" class=\"ideo-lst-li\"><div id=\"${getATagId()}\" class=\"ideo-lst-item\">${getDataFormatted()}</div></li>\
";
