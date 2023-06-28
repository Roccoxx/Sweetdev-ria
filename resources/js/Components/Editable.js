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
* This is the Table component class 
* @param {String} id Id of this table
* @constructor
* @extends RiaComponent
* @base RiaComponent
*/
SweetDevRia.Editable = function (id){
	superClass (this, SweetDevRia.RiaComponent, id, "SweetDevRia.Editable");
	
	this.targetTitle = this.getMessage("title");//"Cliquez ici pour modifier.";
	this.editTitle = this.getMessage("invit");//"Saisissez votre nouvelle valeur.";
	this.emptyMessage = this.getMessage("empty");//"Cliquez ici pour modifier.";
	
	this.formatter = null;
	
	this.updated = false;
	this.isEditing = false;
	
	this.inError = false;
	
	this.editClassName = "ideo-edit-editable";
	
	this.editComponentId = id + "_edit";
	this.editComponentContainerId = id + "_edit";
	
	SweetDevRia.EditableManager.addEditable (this);
};

extendsClass (SweetDevRia.Editable, SweetDevRia.RiaComponent);

SweetDevRia.Editable.TEXT = 0;
SweetDevRia.Editable.LIST = 1;
SweetDevRia.Editable.DATE = 2;


/**
 * Set the name of the javascript function to be called when the user switch to edit mode.
 */
SweetDevRia.Editable.prototype.onStartEdit= null;


/**
 * Set the name of the javascript function to be called when the user finish editing.
 */
SweetDevRia.Editable.prototype.onEndEdit= null;


/**
 * Set the name of the javascript function to be called when the user close the edit mode.
 */
SweetDevRia.Editable.prototype.onClose= null;


/**
 * This method is called before startEdit method. 
 * To be overridden !!
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Editable.prototype.beforeStartEdit = function(){  /* override this */ return true;  };

/**
 * This method is called after startEdit. 
 * To be overridden !!
 */
SweetDevRia.Editable.prototype.afterStartEdit = function(){  /* override this */ };

/**
 * This method is called before endEdit method. 
 * To be overridden !!
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Editable.prototype.beforeEndEdit = function(){  /* override this */ return true;  };

/**
 * This method is called after endEdit. 
 * To be overridden !!
 */
SweetDevRia.Editable.prototype.afterEndEdit = function(){  /* override this */ };


/**
 * This method is called before close method. 
 * To be overridden !!
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Editable.prototype.beforeClose = function(){  /* override this */ return true;  };

/**
 * This method is called after close. 
 * To be overridden !!
 */
SweetDevRia.Editable.prototype.afterClose = function(){  /* override this */ };

/**
 * This event type is fired when start edition
 * @static
 */
SweetDevRia.Editable.START_EVENT = "start";

/**
 * This event type is fired when end edition
 * @static
 */
SweetDevRia.Editable.END_EVENT = "end";

/**
 * This event type is fired when close the edit component
 * @static
 */
SweetDevRia.Editable.CLOSE_EVENT = "close";

/**
 * This event type is fired when the edit value has changed
 * @static
 */
SweetDevRia.Editable.CHANGE_EVENT = "change";


/**
 * Initialize the Editable. This method must be called at the page load !!!
 * 
 * @private
 */
SweetDevRia.Editable.prototype.initialize = function(){

	if(this.listOptions){
		this.options = new Array();
		for(var i=0;i<this.listOptions.length;i++){

			this.options.push(new Option (this.listOptions[i].value,this.listOptions[i].id));
		}
	}

	var target = this.getTarget ();
	if (target != null) {
		if (this.targetTitle != null) {
			target.title = this.targetTitle;
		}
		
		if (this.editClassName) {
			SweetDevRia.DomHelper.addClassName(target,this.editClassName);
		}
		
		SweetDevRia.EventHelper.addListener(target, "click", this.startEditHandler, this);

		if (this.value == null) {
			this.value = "";
		}


		target.innerHTML = this.formatEditValue (this.value);
	}

	if (this.maskPattern != null || this.charPattern != null) {
		this.control = SweetDevRia.$ (this.id+"_control");
		if (this.control == null) {
			this.control = new SweetDevRia.Control (this.id+"_control");
		}

		this.control.setSrcIds (this.id);
		this.control.setTest (	this.maskPattern, [[this.maskMessageType, this.maskMessage]]);
		this.control.allowChar = this.charPattern;   	
		this.control.charMessage = this.charMessage;   	
		this.control.charMessageType = this.charMessageType;   	
		this.control.applyLabelErrorClass = false;
		this.control.applyErrorClass = true;

		if (SweetDevRia.isInit) {
			this.control.initialize ();
		}
	}
	
	return true;
};

SweetDevRia.Editable.prototype.destroy = function(){
	var target = this.getTarget ();
	if (target) {
		YAHOO.util.Event.removeListener(target, "click", this.startEditHandler);

		var editComponent = this.getEditComponent ();
		var evtType = this.getEvtType (); 
		
		if (evtType != null) {
			YAHOO.util.Event.removeListener(editComponent, evtType, this.editHandleEvent);
		}
		
		YAHOO.util.Event.removeListener(editComponent, "click", this.clickEditHandler);
	}
	
	var control = SweetDevRia.$ (this.id+"_control");
	if (control) {
		control.destroy ();
	}
};

SweetDevRia.Editable.prototype.getEvtType = function(){
	var evtType = null; 
	if (this.type == SweetDevRia.Editable.TEXT) {
		evtType = "keydown";
	}
	else if (this.type == SweetDevRia.Editable.LIST) {
		evtType = "keydown";
	}
	else if (this.type == SweetDevRia.Editable.DATE) {
		evtType = "keydown";
	}
	return evtType;
};

SweetDevRia.Editable.prototype.getTarget = function(){
	return document.getElementById (this.targetId);
};

SweetDevRia.Editable.prototype.formatEditValue = function(editValue){
	var valueToDisplay = editValue;
	if (this.formatter && window[this.formatter]) {
		valueToDisplay = window[this.formatter].call (this, editValue);
	}
	else if(this.type == SweetDevRia.Editable.LIST && this.options){
		for(var i=0;i<this.options.length;i++){
			if(this.options[i].value == editValue){
				valueToDisplay = this.options[i].text;
			}
		}
	}
	
	if (valueToDisplay == null || valueToDisplay == "") {
		valueToDisplay = this.emptyMessage;
	}
	
	return valueToDisplay;
};

SweetDevRia.Editable.prototype.getEditValue = function(){
	var editComponent = this.getEditComponent ();
	if (editComponent) {
		return SweetDevRia.Form.getValue (editComponent);
	}
	
	return null;
};


SweetDevRia.Editable.prototype.setValue  = function(value){
	this.value = value;
	this.setEditValue ();
};

SweetDevRia.Editable.prototype.setEditValue  = function(value){
	var editComponent = this.getEditComponent ();
	if (editComponent) {
		SweetDevRia.Form.setValue (editComponent, value);
	}
};

SweetDevRia.Editable.prototype.getEditComponentId = function(){
	return this.editComponentId;
};

SweetDevRia.Editable.prototype.getEditComponentContainerId = function(){
	return this.editComponentContainerId;
};

SweetDevRia.Editable.prototype.getEditComponentContainer= function(){
	return document.getElementById (this.getEditComponentContainerId ());
};

SweetDevRia.Editable.prototype.getEditComponent = function(){
	return document.getElementById (this.getEditComponentId ());
};

//SWTRIA-1211
//possibilite d'adapter la largeur de l'input a celle du conteneur
SweetDevRia.Editable.prototype.createEditComponent = function(targetWidth){
	var editComponent = this.getEditComponent ();
	var container = this.getEditComponentContainer ();
	
	var evtType = this.getEvtType (); 
	if (editComponent == null) {
		if (this.type == SweetDevRia.Editable.TEXT) {
			editComponent = document.createElement ("input");

			editComponent.id = this.editComponentId;
			editComponent.name = this.editComponentId;
			//SWTRIA-1211
			if(targetWidth && targetWidth.indexOf('px') !== -1){
				//on fixe la taille de l'input(text) 6px en dessous de celle du target (a cause des brodures)
				editComponent.style.width = (SweetDevRia.DomHelper.parsePx(targetWidth) - 6) + "px";
			}
			
			container = editComponent;
		}
		else if (this.type == SweetDevRia.Editable.LIST) {
			editComponent = document.createElement ("select");
			editComponent.size = 1;
			editComponent.style.width = "80px";
			editComponent.options.length = 0;
			
			for(var i=0;i<this.options.length;i++){
				editComponent.options[i] = this.options[i];
			}

			editComponent.id = this.editComponentId;
			editComponent.name = this.editComponentId;
		
			//SWTRIA-1211
			if(targetWidth && targetWidth.indexOf('px') !== -1){
				//on fixe la taille de l'input(select) a celle du target
				editComponent.style.width = (SweetDevRia.DomHelper.parsePx(targetWidth)) + "px";
			}
		
			container = editComponent;
		}
		else if (this.type == SweetDevRia.Editable.DATE) {
			editComponent = document.getElementById (this.dateEditId);

			this.editComponentId = this.dateEditId;
			this.editComponentContainerId = this.dateEditId+"Div";

			//SWTRIA-1211
			if(targetWidth && targetWidth.indexOf('px') !== -1){
				//on fixe la taille de l'input(calendar) 25px en dessous de celle du target (a cause de l'image)
				editComponent.style.width = (SweetDevRia.DomHelper.parsePx(targetWidth) - 28) + "px";
			}

			container = this.getEditComponentContainer ();
		}
	}

	if (this.editTitle != null) {
		editComponent.title = this.editTitle;
	}

	if (evtType != null) {
		SweetDevRia.EventHelper.addListener(editComponent, evtType, this.editHandleEvent, this);
	}

	SweetDevRia.EventHelper.addListener(editComponent, "click", this.clickEditHandler, editComponent);

	return container;
};

SweetDevRia.Editable.prototype.clickEditHandler = function(evt, editComponent){
	SweetDevRia.EventHelper.stopPropagation (evt);
	SweetDevRia.EventHelper.preventDefault (evt);
};


SweetDevRia.Editable.prototype.startEditHandler = function(evt, editable){
	SweetDevRia.Menu.hideAll();
	editable.startEdit ();
	
	SweetDevRia.EventHelper.stopPropagation (evt);
	SweetDevRia.EventHelper.preventDefault (evt);
};

SweetDevRia.Editable.prototype.startEdit = function(){
	if (this.beforeStartEdit ()) {
		SweetDevRia.EditableManager.startEditable (this);
		this.isEditing = true;

		var target = this.getTarget ();
		
		//SWTRIA-1211
		//la taille de l'input depend de la taille du target
		var container = this.createEditComponent (target.style.width);
		
		target.innerHTML = "";

		target.appendChild (container); 

		var editComponent = this.getEditComponent ();
		
		YAHOO.util.Event.removeListener(target, "click", this.startEditHandler);
	
		if (this.editClassName) {
			SweetDevRia.DomHelper.removeClassName(target,this.editClassName);
		}

		if (this.type == SweetDevRia.Editable.LIST){
			var options = editComponent.options;
			for(var i=0;i<options.length;i++){
				if((options[i].text==this.value)||(options[i].value==this.value)){
					options[i].selected = true;
					break;
				}
			}
		}
		else{
			this.setEditValue (this.value);
		}
		
		if (this.control) {
			this.control.updateOnChangeHandler ();
		}
		
		
		if (editComponent.focus) {
			editComponent.focus();
			
			setTimeout(function() {
				try{
					editComponent.focus();
				}
				catch(err){
					
					/*
					 * The catch is to avoid getting the following error message in IE : 
					 *     Error -2147418113
					 *     Request access to the method or property unexpectedly
					 */
				}
			}, 0);
			
		}
		
	
		this.afterStartEdit ();
		
		this.fireEventListener (SweetDevRia.Editable.START_EVENT);

		if (this.onStartEdit){ 
			this.onStartEdit.call (this);
		}
	}
};

SweetDevRia.Editable.prototype.closePopup = function(){
	if(this.isEditing){
		this.endEdit();
	}
};

SweetDevRia.Editable.prototype.endEdit = function(){
	if (this.beforeEndEdit ()) {
		if (! this.inError) {
			var oldValue = this.value;
			this.value = this.getEditValue ();
		
			this.updated = this.updated || (this.value != oldValue);
		}
		
		this.closeEdit ();
		
		this.afterEndEdit ();
		
		this.fireEventListener (SweetDevRia.Editable.END_EVENT);

		if (this.onEndEdit){
			 this.onEndEdit.call (this);
		}
	}
};

SweetDevRia.Editable.prototype.closeEdit = function(){
	if (this.beforeClose ()) {
		this.isEditing = false;
		
		var target = this.getTarget ();
		
		if (this.type == SweetDevRia.Editable.DATE) {
			var editComponent = this.getEditComponent ();
			var container = this.getEditComponentContainer ();
			var editComponentParent = document.getElementById (this.dateEditId+"DivParent");
			editComponentParent.appendChild (container);

			var evtType = this.getEvtType (); 
			if (evtType != null) {
				YAHOO.util.Event.removeListener(editComponent, evtType, this.editHandleEvent);
			}

			YAHOO.util.Event.removeListener(editComponent, "click", this.clickEditHandler);
		}
		var formattedValue = this.formatEditValue (this.value);
		target.innerHTML = formattedValue;

		SweetDevRia.EventHelper.addListener(target, "click", this.startEditHandler, this);

		if (this.editClassName) {
			SweetDevRia.DomHelper.addClassName(target,this.editClassName);
		}
		
		if (this.updated) {
			this.addUpdatedStyle(target);
			this.fireEventListener (SweetDevRia.Editable.CHANGE_EVENT);
		}

		this.fireEventListener (SweetDevRia.Editable.CLOSE_EVENT);

		this.afterClose ();
		
		if (this.onClose){
			this.onClose.call (this);
		}
	}
};

SweetDevRia.Editable.prototype.addUpdatedStyle = function (target) {
	SweetDevRia.DomHelper.addClassName(target, "ideo-edit-updated");
}

SweetDevRia.Editable.prototype.editHandleEvent = function (evt, editable) {
	switch(evt.keyCode) {
		case SweetDevRia.KeyListener.ESCAPE_KEY:
			editable.closeEdit ();
		break;
		case SweetDevRia.KeyListener.ENTER_KEY:
			editable.endEdit ();
		break;
		case SweetDevRia.KeyListener.TABULATION_KEY:
			//editable.endEdit (); //SWTRIA-921
		break;
		default :
			break;
	}
};

/***********************************************************************************************************************************************************************
					Manager !!
***********************************************************************************************************************************************************************/

SweetDevRia.EditableManager = function (id){
	superClass (this, SweetDevRia.RiaComponent, id, "SweetDevRia.EditableManager");
	this.editables = {};
};
extendsClass (SweetDevRia.EditableManager, SweetDevRia.RiaComponent);

/* create a default EditableManager */
SweetDevRia.EditableManager.ID = "__riaEditableManager";
SweetDevRia.EditableManager.DEFAULT_MANAGER = new SweetDevRia.EditableManager (SweetDevRia.EditableManager.ID);

SweetDevRia.EditableManager.addEditable = function (editable) {
	var manager = SweetDevRia.$ (SweetDevRia.EditableManager.ID);
	manager.editables [editable.id] = editable;
};

/**
 * Close all others editable components
 */
SweetDevRia.EditableManager.startEditable = function (editable) {
	var manager = SweetDevRia.$ (SweetDevRia.EditableManager.ID);
	if (manager != null) {
		for (var id in manager.editables) {
			if (id != editable.id) {
				var editable = manager.editables [id];
				if (editable.isEditing) {
					editable.endEdit ();
				}
			}
		}
	}
};

SweetDevRia.EditableManager.endEditables = function (evt, manager) {
	for (var id in manager.editables) {
		var editable = manager.editables [id];
		if (editable.isEditing) {
			editable.endEdit ();
		}
	}
};
