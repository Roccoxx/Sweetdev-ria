/*
 * 
 * connection a l action en passant par le proxy : les valeurs sont ds la request et on forward ou include vers l action. 
 * 						idee : include et zoneId pour afficher le resultat
 * mise a jour de valeur, kelle formalisme :  champ json updateValues  -> update automatique des values
 * envoi ajax des valeurs
 * 
 */



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
 * @class Form
 * @constructor
 * @param {String} 	id Identifier of the SweetDevRia.Form component
 */ 
SweetDevRia.Form = function(id){

	superClass (this, SweetDevRia.RiaComponent, id, SweetDevRia.Form.prototype.className);

	this.formId = null;
	this.action = null;
	this.targetZoneId = null;
};

extendsClass(SweetDevRia.Form, SweetDevRia.RiaComponent);

/**
 * Name of the class
 * @type String
 */
SweetDevRia.Form.prototype.className = "SweetDevRia.Form";

/**
* Constant for form input type
* @type int
*/
SweetDevRia.Form.INPUT_TYPE = 0;

/**
* Constant for form select type
* @type int
*/
SweetDevRia.Form.SELECT_TYPE = 1;

/**
* Constant for form radio type
* @type int
*/
SweetDevRia.Form.RADIO_TYPE = 2;

/**
* Constant for form checkbox type
* @type int
*/
SweetDevRia.Form.CHECKBOX_TYPE = 3;

/**
* Constant for form text area type
* @type int
*/
SweetDevRia.Form.TEXTAREA_TYPE = 4;

/**
* Constant for SweetDEV RIA calendar type
* @type int
*/
SweetDevRia.Form.RIA_CALENDAR_TYPE = 5;

/**
* Constant for SweetDEV RIA suggest type
* @type int
*/
SweetDevRia.Form.RIA_SUGGEST_TYPE = 7;

/**
* Constant for SweetDEV RIA editable type
* @type int
*/
SweetDevRia.Form.RIA_EDITABLE_TYPE = 8;

/**
 * Type of event fire when the form is submitted
 * @type String
 */
SweetDevRia.Form.SUBMIT_EVENT = "submit";



/**
 * This method is called before submit the form component 
 * To be overridden !!
 * @param {String} action. Optional new action parameter. 
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Form.prototype.beforeSubmit  = function(action){  /* override this */ return true;  };

/**
 * This method is called after submit the form component 
 * @param {String} action. Optional new action parameter. 
 * To be overridden !!
 */
SweetDevRia.Form.prototype.afterSubmit = function(action){  /* override this */ };



/**
 * Submit the form component.
 * @param {String} action. Optional new action parameter. 
 */
SweetDevRia.Form.prototype.submit = function(action) {
	if (this.beforeSubmit (action)) {
		var myForm = document.getElementById (this.formId); 

		SweetDevRia.Form.ajaxFormSubmit (myForm, action, this.targetZoneId); 
		
		this.afterSubmit (action);
		
		this.fireEventListener (SweetDevRia.Form.SUBMIT_EVENT);
	}
};

/**
 * Set the action for this SweetDevRia Form
 * @param {String} action. New action parameter. 
 */
SweetDevRia.Form.prototype.setAction = function(action) {
	this.action = action;
};

/**
 * Set the target zone id handling the submission result for this SweetDevRia Form
 * @param {String} targetZoneId. New targetZoneId for this object. 
 */
SweetDevRia.Form.prototype.setTargetZoneId = function(targetZoneId) {
	this.targetZoneId = targetZoneId;
};

/**
 * Set the form Id this component acts on
 * @param {String} formId. New form id for this object.
 */
SweetDevRia.Form.prototype.setFormId = function(formId) {
	this.formId = formId;
};

/**
 * Submit a form using Ajax
 * @param {HTMLElement} form the form element to submit
 * @param {String} action an Optional action to redirect the submit target. If none, the form action attribut is used.
 * @param {String} targetZoneId Optional id of a zone which will display the form return value. If none, the result will be lost.
 * @param {Function} callback Optional function called with the response as parameter
 */
SweetDevRia.Form.ajaxFormSubmit = function (form, action, targetZoneId, callback) {
	if (form == null) {
		return;
	}

	if (action == null) {
		action = form.getAttribute ("action"); 
	}

	var values = {};
	for (var i = 0; i < form.elements.length; i++) {
		var elem = form.elements [i];
		var name = elem.name;
		if (name) {
			values [name] = SweetDevRia.Form.getValue (name, form.name);
		}
	}

	values ["__RiaPageId"] = window[SweetDevRia.ComHelper.ID_PAGE];
	SweetDevRia.ComHelper.genericCall (action, values, function () {
		if (targetZoneId != null)  {
			var zone = SweetDevRia.$ (targetZoneId);
			if (zone) {
				zone.onCallServer ({"data":this.responseText});
			}	
		}
		
		if(callback){
			callback.call(this, this.responseText);
		}
	}, true);
};


/**
 * This method is used to get some components through their identifiers.
 * @param {String} identifiers Searched component identifiers (ex, "id1,id2"), comma separated.
 * @param {String} optionnal formName the form which contains the component
 * @return An array of components associated with these identifiers
 * @type Array
 */
SweetDevRia.Form.getComponents = function (identifiers,formName) {
	 if (identifiers.split) {
		identifiers = (identifiers.split(","));
		// Trim the component identifiers
		for (var i = 0; i < identifiers.length; i++) {
			identifiers [i] = SweetDevRia.StringHelper.trim(identifiers [i]);
		}
	 }
	 var comps = [];
	 
	 if (identifiers.add && identifiers.nodeName!="SELECT") { // if array
		 for (var i = 0; i < identifiers.length; i++) {
			 var identifier = identifiers[i];
			 var comp = identifier;
			 if (typeof (identifier) == "string") {
				 comp = SweetDevRia.Form.getComponent (identifier,formName);
			 }
	
			 if (comp != null) {
				comps.add (comp);
			 }
		 }
	 }
	 else {
		 var identifier = identifiers;
		 var comp = identifier;
		 if (typeof (identifier) == "string") {
			 comp = SweetDevRia.Form.getComponent (identifier,formName);
		 }
		 if (comp != null) {
			comps.add (comp);
		 }
	 }
	
	 return comps;
};

/**
 * This method is used to get a component through its identifier. We first look for a SweetDEV RIA component and if none are found, for an html component. 
 * The seeking of the HTML component is first looking for an id corresponding to the identifier, and finally for a name.  
 * @param {String} identifier Searched component identifier (ex, "id1,id2").
 * @param {String} optionnal formName the form which contains the component
 * @return The component found, or null if none are found for this identifier
 * @type HTMLComponent | SweetDevRia.RiaComponent 
 */
SweetDevRia.Form.getComponent = function (identifier,formName) {
	var comp = SweetDevRia.$ (identifier);
	
	if(formName){
		comp = document.forms[formName].elements[identifier];
	}
	
	if (comp == null) {
		comp = document.getElementById (identifier);
	 	if(comp == null){
			comp = document.getElementsByName (identifier);
//			if (!(comp && comp.length && comp[0].type && comp[0].type.toLowerCase() == "radio")) {
			if (comp && comp.length && comp[0].type && (comp[0].type.toLowerCase() != "radio")) {
			 	comp = comp [0];
			}
		 }
		 else if ((comp.type && comp.type.toLowerCase() == "radio")) {
			comp = document.getElementsByName (identifier);
			if (!(comp && comp.length && comp[0].type && comp[0].type.toLowerCase() == "radio")) {
			 	comp = comp [0];
			}
		}
	 }
	 
	 // TODO Pour suggest et editable, doit retourner les identifiants des champs de saisie qui vont bien !! du coup ca fera marcher direct tt le reste
	 
	 return comp;
};

/**
 * Return the component type (ex : input, select, radio, checkbox, calendar, comboMulti)
 * @param {Object} comp Component to return type
 * @return component type (ex : SweetDevRia.Form.INPUT_TYPE)
 * @type int
 * @private
 */
SweetDevRia.Form.getType = function (comp) {
	var type = null;
	 if (comp.isRiaComponent) {
	 	var className = comp.className;

		 if (className == "CalendarBase" || className == "MultiCalendar") {
			 type =  SweetDevRia.Form.RIA_CALENDAR_TYPE;
		 }
		 else if (className == "SweetDevRia.Suggest") {
			 type =  SweetDevRia.Form.RIA_SUGGEST_TYPE;
		 }		 
		 else if (className == "SweetDevRia.Editable") {
			 type =  SweetDevRia.Form.RIA_EDITABLE_TYPE;
		 }		 
		
	 }
	 else {
		 var nodeName = comp.nodeName;
		 if (nodeName) {
			 if (nodeName.toLowerCase() == "input") {
			 	var type = comp.type;
				if (type == "text" || type == "password" || type == "hidden") {
					 type =  SweetDevRia.Form.INPUT_TYPE;
				 }
				 else if (type == "radio") {
					 type =  SweetDevRia.Form.RADIO_TYPE;
				 }
				 else if (type == "checkbox") {
				 	type =  SweetDevRia.Form.CHECKBOX_TYPE;
				 }
			 }
			 else if (nodeName.toLowerCase() == "textarea") {
			 	type =  SweetDevRia.Form.TEXTAREA_TYPE;
			 }
			 else if (nodeName.toLowerCase() == "select" || nodeName.toLowerCase() == "option") {
				type =  SweetDevRia.Form.SELECT_TYPE;
			}
		 }
		 else {
			 if (comp && comp.length && comp[0].type && comp[0].type.toLowerCase() == "radio") {
				 type =  SweetDevRia.Form.RADIO_TYPE;
		 	}
		 }
	}
	return type;
};

/**
 * Return the component value(s) (could be several value in case of select component.
 * @param {String} name component name  which we want the value
 * @param {String} optionnal formName the form which contains the component
 * @return The source component value
 * @type String/Array of String (if several values)
 * @private
 */
SweetDevRia.Form.getValue = function (name,formName) {
	var srcs = SweetDevRia.Form.getComponents (name,formName);
	var src = (srcs [0].length)?srcs[0]:[srcs[0]]; // On recupere le resultat sous forme de tableau.
	// Il est a noter que d'après la phrase "si ca chante comme un canard alors c'est un canard", le composant
	// select est un tableau d'option (duck typing). 

	var value = [];
	for(var i = 0; i<src.length; i++){
		var type = SweetDevRia.Form.getType (src[i]);
		switch (type) {
			case SweetDevRia.Form.INPUT_TYPE :
			case SweetDevRia.Form.TEXTAREA_TYPE :
				value.add(src[i].value);
				break;
			case SweetDevRia.Form.SELECT_TYPE :	
				var options = src[i].options;
				if (options) {
					// current object is an selectbox
					// Le select ressemble a un tableau d'options
					// il devrait etre traite comme tel et donc ce code ne devrait pas etre
					// accedee. Mais dans une optique de resiliance, ce cas est malgres tout traite.
					for (var j  =0; options && (j < options.length); j++) {
						var opt = options [j];
						if (opt.selected) {
							value.add(opt.value);
						}	
					}
				} else {
					// current object is an option
					if (src[i].selected) {
						value.add(src[i].value);
					}
				}
				break;
			case SweetDevRia.Form.RADIO_TYPE :
				if (src[i].checked) {
					value.add(src[i].value);
				}
				break;
			case SweetDevRia.Form.CHECKBOX_TYPE :
				if (src[i].checked) {
					value.add(src[i].value);
				}
				else {
					value.add(null);
				}
				break;
			case SweetDevRia.Form.RIA_CALENDAR_TYPE :
				value.add(src[i].getSelectedDates());
				break;
			case SweetDevRia.Form.RIA_SUGGEST_TYPE :
				value.add(src[i].selectedItemsIds);
				break;
			case SweetDevRia.Form.RIA_EDITABLE_TYPE :
				value.add(src[i].value);
				break;
			default:break;			
		}
	}

	if (value.length == 0) return null; // Renvoie null si aucune valeur de trouvee.
	return (value.length > 1)?value:value[0]; // renvoie que la valeur, si qu'une seule valeurs est trouvee.
};




/**
 * Reset the component value
 * @param {Component} comp component to reset
 * @private
 */
SweetDevRia.Form.resetComponent = function (comp) {
	var type = SweetDevRia.Form.getType (comp);
	switch (type) {
		case SweetDevRia.Form.INPUT_TYPE :
		case SweetDevRia.Form.TEXTAREA_TYPE :
			comp.value = "";
			break;
		case SweetDevRia.Form.SELECT_TYPE :

			var options = comp.options;
			for (var j  =0; j < options.length; j++) {
				options[j].selected = false;
			}

			break;
		case SweetDevRia.Form.RADIO_TYPE :
			for (var j = 0; j < comp.length; j ++) {
				comp[j].checked = false;
			}

			break;
		case SweetDevRia.Form.CHECKBOX_TYPE :
			comp.checked = false;
			break;
		case SweetDevRia.Form.RIA_CALENDAR_TYPE :
		
			comp.resetCalendar ();

			break;
		case SweetDevRia.Form.RIA_SUGGEST_TYPE :
			
			comp.unselectAll ();

			break;		
		case SweetDevRia.Form.RIA_EDITABLE_TYPE :
			
			comp.setValue ("");

			break;		
			default:break;
	}
};


/**
 * Set the value of a component value
 * @param {component} comp Component to set
 * @param {String} value the new value to set
 * @private
 */
SweetDevRia.Form.setValue = function (comp, value) {

	var type = SweetDevRia.Form.getType (comp);
	
	switch (type) {
		case SweetDevRia.Form.INPUT_TYPE :
		case SweetDevRia.Form.TEXTAREA_TYPE :
			comp.value = value;

			break;
		case SweetDevRia.Form.SELECT_TYPE :
			
			var options = comp.options;
			for (var j  =0; j < options.length; j++) {
				var opt = options [j];
				if (opt.text == value) {
					opt.selected = true;
				}
				else {
					opt.selected = false;
				}
			}

			break;
		case SweetDevRia.Form.RADIO_TYPE :
			var radio = document.getElementById (id);
			var radios = document.getElementsByName (radio.name);
			
			for (var j = 0; j < radios.length; j ++) {
				if (radios[j].value == value) {
					radios[j].checked = true;
				}
				else {
					radios[j].checked = false;
				}
			}
			
			//return null; //JSLINT fix				
			break;
		case SweetDevRia.Form.CHECKBOX_TYPE :

			if (comp.value == value) {
				comp.checked = true;
			}
			else {
				comp.checked = false;
			}

			break;
		case SweetDevRia.Form.RIA_CALENDAR_TYPE :

			// If value is a date, we parse it
			if (value ["time"] && value ["time"]["time"]) {
				value = new Date (value ["time"]["time"]);
			}

			/*comp.setNewDateAndFillDateInFields (value);*/
			comp.setValue(value);
			break;
		case SweetDevRia.Form.RIA_SUGGEST_TYPE :
			for (var i = 0; i < value.length; i++) {
				var id = value[i];
				var item = this.getSelectedItemFromId(id);
				
				if (item) {
					comp.setItemSelected (item);
				}
			}
			
			break;
		case SweetDevRia.Form.RIA_EDITABLE_TYPE :
			comp.setValue (value);
			
			break;			
		default:break;
	}
};




/**
 * Set data in a form
 * @param {Form} form Formular to set data
 * @param {Map} data Data to set
 * @param {Map} mapping Mapping between html element id and data property (ex : {"name":"firstName", "age":"year"} )
 */
SweetDevRia.Form.setFormData = function (form, data, mapping) {
	for (var i = 0; i <  form.elements.length; i++) {
		var elem = form.elements [i];
		var id = elem.id;
		if(!id){
			id = elem.name;
		}
		if (id) {
			var dataProperty = SweetDevRia.Form.getDataProperty (mapping, id);
			if (data[dataProperty] != undefined) {
				SweetDevRia.Form.setValue (elem, data[dataProperty]);
			}
		}
	}
};


/**
 * Get data of a form
 * @param {Form} form Formular to get data
 * @param {Map} mapping Mapping between html element id and data property (ex : {"name":"firstName", "age":"year"} )
 * @return Data of this formular
 * @type Map
 */
SweetDevRia.Form.getFormData = function (form, mapping) {
	var data = {};

	for (var i = 0; i <  form.elements.length; i++) {
		var elem = form.elements [i];
		var id = elem.id;
		if(!id){
			id = elem.name;
		}
		if (id) {
			var value = SweetDevRia.Form.getValue (id);
			if (value) {
				var dataProperty = SweetDevRia.Form.getDataProperty (mapping, id);
				data [dataProperty] = value;
			}
		}		
	}

	return data;
};


/**
 * Return the data property name associating of a component id using mapping map 
 * @param {Map} mapping Mapping between html element id and data property (ex : {"name":"firstName", "age":"year"} )
 * @param {String} componentId component id 
 * @return the data property according to this HTML id, or the componentId itself if none are found in the mapping
 * @type String
 */
SweetDevRia.Form.getDataProperty = function (mapping, componentId) {
	if (mapping) {
		var dataProperty = mapping [componentId];
		if (dataProperty) {
			return dataProperty;
		}
	}

	return componentId;
};



SweetDevRia.Form.getLabelTag = function(elemId) {
	var labels = document.getElementsByTagName ("label");

	if (labels) {
		for (var i = 0; i < labels.length; i++) {
			var label = labels [i];
			if (label) {
				var forAttr = label.getAttribute("for");
				/** Hack for IE */
				if (forAttr === null){
					forAttr = label.getAttribute("htmlFor");
				}
				
				if (forAttr && forAttr == elemId) {
					return label;
				}
			}
		}
	}
	
	return null;
};

/**
 * Get the label related to an HTML element's id
 * @param {String} elemId the HTML element id to get the label related
 * @type String
 * @return the label fo this HTML id
 */ 
SweetDevRia.Form.getLabel = function(elemId) {
	var label = SweetDevRia.Form.getLabelTag (elemId);

	if (label) {
		return label.childNodes[0].nodeValue;
	}
	
	return null;
};


