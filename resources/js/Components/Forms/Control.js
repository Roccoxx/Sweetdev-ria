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
 * This is the Control component class
 * @param {String} id Id of this table
 * @constructor
 * @extends RiaComponent
 * @base RiaComponent
 */
SweetDevRia.Control = function(id){
	superClass (this, SweetDevRia.RiaComponent, id, "Control");
	
	this.srcIds = null;
	this.actions = [];
	this.actionsElse = [];
	this.test = null;
	this.testClass = null;
	this.handler = null;
	
	this.canBeEmpty = true;
	
	this.allowChar = null;
	
	this.applyErrorClass = false;
	this.applyLabelErrorClass = false;
	
	this.triggers = [];
	this.triggers[SweetDevRia.Form.INPUT_TYPE] = "keyup";
	this.triggers[SweetDevRia.Form.TEXTAREA_TYPE] = "keyup";
	this.triggers[SweetDevRia.Form.SELECT_TYPE] = "change";
	this.triggers[SweetDevRia.Form.RADIO_TYPE] = "click";
	this.triggers[SweetDevRia.Form.CHECKBOX_TYPE] = "click";
	this.triggers[SweetDevRia.Form.RIA_CALENDAR_TYPE] = "change";
	this.triggers[SweetDevRia.Form.RIA_SUGGEST_TYPE] = "change";
	this.triggers[SweetDevRia.Form.RIA_EDITABLE_TYPE] = SweetDevRia.Editable.CHANGE_EVENT;

	this.allowTriggers = [];
	this.allowTriggers[SweetDevRia.Form.INPUT_TYPE] = "keypress";
	this.allowTriggers[SweetDevRia.Form.TEXTAREA_TYPE] = "keypress";
	this.allowTriggers[SweetDevRia.Form.RIA_EDITABLE_TYPE] = "keypress";

};

extendsClass(SweetDevRia.Control, SweetDevRia.RiaComponent);


SweetDevRia.Control.SHOW_ACTION = 0;
SweetDevRia.Control.HIDE_ACTION = 1;
SweetDevRia.Control.DISABLE_ACTION = 2;
SweetDevRia.Control.ENABLE_ACTION = 3;
SweetDevRia.Control.LOADDATA_ACTION = 4;
SweetDevRia.Control.RESET_ACTION = 5;
SweetDevRia.Control.SETVALUE_ACTION = 6;
SweetDevRia.Control.HANDLER_ACTION = 7;


SweetDevRia.Control.EMPTY_MASK = "(^$)|";







/**
 * This method is called before Load data in a component. Used to modify select options. For all component types, it's call the setValue method. 
 * To be overridden !!
 * @param {component} comp Component to modify
 * @param {Object} data the new data
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Control.prototype.beforeLoadData = function (comp, data) {  /* override this */ return true;  };

/**
 * This method is called after Load data in a component. Used to modify select options. For all component types, it's call the setValue method. 
 * To be overridden !!
 * @param {component} comp Component to modify
 * @param {Object} data the new data
 */
SweetDevRia.Control.prototype.afterLoadData = function (comp, data) {  /* override this */ };
/**
 * This method is called before Set the value of a component value
 * To be overridden !!
 * @param {component} comp Component to set
 * @param {String} value the new value to set
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Control.prototype.beforeSetValue = function (comp, value) {  /* override this */ return true;  };

/**
 * This method is called after Set the value of a component value
 * To be overridden !!
 * @param {component} comp Component to set
 * @param {String} value the new value to set
 */
SweetDevRia.Control.prototype.afterSetValue = function (comp, value) {  /* override this */ };

/**
 * This method is called before Test a component value
 * To be overridden !!
 * @param {String} id Identifiant of component to test 
 * @param {String} value Value to test.
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Control.prototype.beforeTestValue = function (id, value) {  /* override this */ return true;  };

/**
 * This method is called after Test a component value
 * To be overridden !!
 * @param {String} id Identifiant of component to test 
 * @param {String} value Value to test.
 */
SweetDevRia.Control.prototype.afterTestValue = function (id, value) {  /* override this */ };

/**
 * This method is called before Put an error style on source component
 * To be overridden !!
 * @param {String} id Component identifiant on error
 * @param {boolean} errorMode true to put an error style, else false
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Control.prototype.beforeSetErrorMode = function (id, errorMode) {  /* override this */ return true;  };

/**
 * This method is called after Put an error style on source component
 * To be overridden !!
 * @param {String} id Component identifiant on error
 * @param {boolean} errorMode true to put an error style, else false
 */
SweetDevRia.Control.prototype.afterSetErrorMode = function (id, errorMode) {  /* override this */ };

/**
 * This method is called before Disable a component
 * To be overridden !!
 * @param {Component} comp Component to disable
 * @param {boolean} disable True to disable the component, else false
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Control.prototype.beforeSetComponentDisable = function (comp, disable) {  /* override this */ return true;  };

/**
 * This method is called after Disable a component
 * To be overridden !!
 * @param {Component} comp Component to disable
 * @param {boolean} disable True to disable the component, else false
 */
SweetDevRia.Control.prototype.afterSetComponentDisable = function (comp, disable) {  /* override this */ };

/**
 * This method is called before set the visibility of a component
 * To be overridden !!
 * @param {Component} comp Component to set the visibility
 * @param {boolean} visibility True to show the component, false to hide
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Control.prototype.beforeSetComponentVisibility = function (comp, visibility) {  /* override this */ return true;  };

/**
 * This method is called after set the visibility of a component
 * To be overridden !!
 * @param {Component} comp Component to set the visibility
 * @param {boolean} visibility True to show the component, false to hide
 */
SweetDevRia.Control.prototype.afterSetComponentVisibility = function (comp, visibility) {  /* override this */ };

/**
 * This method is called before Reset the component value
 * To be overridden !!
 * @param {Component} comp component to reset
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Control.prototype.beforeResetComponent = function (comp) {  /* override this */ return true;  };

/**
 * This method is called after Reset the component value
 * To be overridden !!
 * @param {Component} comp component to reset
 */
SweetDevRia.Control.prototype.afterResetComponent = function (comp) {  /* override this */ };

/**
 * This method is called before execute actions.
 * To be overridden !!
 * @param {String} id Identifiant of source component
 * @param {String} value Source component value, used if exist an action condition
 * @param {array} actions Actions to execute
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Control.prototype.beforeExecuteActions = function (id, value, actions) {  /* override this */ return true;  };

/**
 * This method is called after execute actions.
 * To be overridden !!
 * @param {String} id Identifiant of source component
 * @param {String} value Source component value, used if exist an action condition
 * @param {array} actions Actions to execute
 */
SweetDevRia.Control.prototype.afterExecuteActions = function (id, value, actions) {  /* override this */ };


/**
 * This method is automatically called at the page load
 * @private
 */
SweetDevRia.Control.prototype.initialize = function () {
	this.addOnChangeHandler ();
};


SweetDevRia.Control.prototype.destroy = function () {
	this.removeOnChangeHandler ();
};

/**
 * Set the event triggering the action for a certain kind of component
 * Must be called before the page load
 * Call updateEventTrigger to change it at runtime, after the page finished loading
 * Default is :
 * SweetDevRia.Form.INPUT_TYPE : blur
 * SweetDevRia.Form.TEXTAREA_TYPE : blur
 * SweetDevRia.Form.SELECT_TYPE : change
 * SweetDevRia.Form.RADIO_TYPE : click
 * SweetDevRia.Form.CHECKBOX_TYPE : click
 * SweetDevRia.Form.RIA_CALENDAR_TYPE : change
 * SweetDevRia.Form.RIA_SUGGEST_TYPE : change
 * @param {int} formType the type of the form element we set the trigger (ex: SweetDevRia.Form.SELECT_TYPE)
 * @param {String} event the type of HTML event triggering the control (ex: "blur", "click")
 */
SweetDevRia.Control.prototype.setEventTrigger = function(formType, event){
	this.triggers[formType] = event;
};

/**
 * Update the change handler which will control the component value after a user action
 * This update has to be processed before the page load finished 
 * Call setEventTrigger to change it at loadtime, before any event binding has been performed
 * Default is :
 * SweetDevRia.Form.INPUT_TYPE : blur
 * SweetDevRia.Form.TEXTAREA_TYPE : blur
 * SweetDevRia.Form.SELECT_TYPE : change
 * SweetDevRia.Form.RADIO_TYPE : click
 * SweetDevRia.Form.CHECKBOX_TYPE : click
 * SweetDevRia.Form.RIA_CALENDAR_TYPE : change
 * SweetDevRia.Form.RIA_SUGGEST_TYPE : change
 * @param {int} formType the type of the form element we set the trigger (ex: SweetDevRia.Form.SELECT_TYPE)
 * @param {String} event the type of HTML event triggering the control (ex: "blur", "click")
 * @param {boolean} remove Optional whether the old event trigger must be removed (default is true)
 */
SweetDevRia.Control.prototype.updateEventTrigger = function (formType, event, remove) {
	if(remove!=false){
		remove = true;
	}
	
	var srcs = SweetDevRia.Form.getComponents (this.srcIds);

	for (var i = 0; i < srcs.length; i++) {
		 var src = srcs [i];
		 var type = SweetDevRia.Form.getType (src);
		 
		 if(type == formType){
		 	if(remove){
		 		if(src.isRiaComponent){
		 			SweetDevRia.removeListener(src, this.triggers[type], this.onRiaControl, this);
		 		}
		 		else{
		 			YAHOO.util.Event.removeListener(src, this.triggers[type], this.onControl);
		 		}
		 	}
		 	
		 	if(src.isRiaComponent){
	 			SweetDevRia.addListener(src, event);
	 		}
	 		else{
	 			SweetDevRia.EventHelper.addListener(src, event, this.onControl, this);
	 		} 	
		 }
	}
	this.setEventTrigger(formType, event);
};


SweetDevRia.Control.prototype.updateOnChangeHandler = function () {
	this.removeOnChangeHandler();
	this.addOnChangeHandler();
};

SweetDevRia.Control.prototype.removeOnChangeHandler = function () {
	 var srcs = SweetDevRia.Form.getComponents (this.srcIds);

	 for (var i = 0; i < srcs.length; i++) {
		 var src = srcs [i];
		 var type = SweetDevRia.Form.getType (src);

		 switch (type) {
			 case SweetDevRia.Form.INPUT_TYPE :
			 case SweetDevRia.Form.TEXTAREA_TYPE :
			 case SweetDevRia.Form.SELECT_TYPE :
			 case SweetDevRia.Form.RADIO_TYPE :
			 case SweetDevRia.Form.CHECKBOX_TYPE :
				 if (src) {
					 YAHOO.util.Event.removeListener(src, this.triggers[type], this.onControl);
	
					 if(this.allowTriggers [type]) {
						 YAHOO.util.Event.removeListener(src, this.allowTriggers [type], SweetDevRia.Control.testAllowChar);
					 }
				 }
				 break;
			 case SweetDevRia.Form.RIA_SUGGEST_TYPE :
				 if (src.getInput) {
					 src = src.getInput ();
				 }
			 case SweetDevRia.Form.RIA_CALENDAR_TYPE :
				 if (src) {
					 SweetDevRia.removeListener (src, this.triggers[type], SweetDevRia.Control.onRiaControl);
				 }
				 break;
			 case SweetDevRia.Form.RIA_EDITABLE_TYPE :
				 if (src) {
					 SweetDevRia.removeListener (src, this.triggers[type], SweetDevRia.Control.onRiaControl);
	
					 if (src.getEditComponent) {
						 src = src.getEditComponent ();
					 }
					 if(this.allowTriggers [type]) {
						 YAHOO.util.Event.removeListener(src, this.allowTriggers [type], SweetDevRia.Control.testAllowChar);
					 }
				 }

				 break;
			default:
				SweetDevRia.log.info("Impossible to add change handler for src :"+src+". Type not recognized.");
			break;
		 }
	}
};


/**
 * Add the change handler which will control the component value after a user action
 * @private
 */
SweetDevRia.Control.prototype.addOnChangeHandler = function () {

	var srcs = SweetDevRia.Form.getComponents (this.srcIds);

	 for (var i = 0; i < srcs.length; i++) {
		 var src = srcs [i];

		 var type = SweetDevRia.Form.getType (src);

		 switch (type) {
			 case SweetDevRia.Form.RIA_SUGGEST_TYPE :
				 if (src.getInput) {
					 src = src.getInput ();
				 }
			 case SweetDevRia.Form.INPUT_TYPE :
			 case SweetDevRia.Form.TEXTAREA_TYPE :
			 case SweetDevRia.Form.SELECT_TYPE :
			 case SweetDevRia.Form.RADIO_TYPE :
			 case SweetDevRia.Form.CHECKBOX_TYPE :
				 if (src) {
					 SweetDevRia.EventHelper.addListener(src, this.triggers[type], this.onControl, this);
	
					 if(this.allowTriggers [type]) {
						 SweetDevRia.EventHelper.addListener(src, this.allowTriggers [type], SweetDevRia.Control.testAllowChar, this);
					 }
				 }
				 break;
			 case SweetDevRia.Form.RIA_EDITABLE_TYPE :
				 if (src) {

					 SweetDevRia.addListener (src, this.triggers[type], SweetDevRia.Control.onRiaControl, this);
	
					 if (src.getEditComponent) {
						 src = src.getEditComponent ();
					 }
					 if(this.allowTriggers [type]) {
						 SweetDevRia.EventHelper.addListener(src, this.allowTriggers [type], SweetDevRia.Control.testAllowChar, this);
					 }
				 }

				 break;
			 case SweetDevRia.Form.RIA_CALENDAR_TYPE :
				 if (src) {
					 SweetDevRia.addListener (src, this.triggers[type], SweetDevRia.Control.onRiaControl, this);
				 }
				 break;

			default:
				SweetDevRia.log.info("Impossible to add change handler for src :"+src+". Type not recognized.");
			break;
		 }
	}
};


/**
 * Load data in a component. Used to modify select options. For all component types, it's call the setValue method. 
 * @param {component} comp Component to modify
 * @param {Object} data the new data
 * @private
 */
SweetDevRia.Control.prototype.loadData = function (comp, data) {

	if (this.beforeLoadData (comp, data)) {
	
		var type = SweetDevRia.Form.getType (comp);
		switch (type) {
			case SweetDevRia.Form.INPUT_TYPE :
			case SweetDevRia.Form.TEXTAREA_TYPE :
			case SweetDevRia.Form.RADIO_TYPE :
			case SweetDevRia.Form.CHECKBOX_TYPE :
			case SweetDevRia.Form.RIA_CALENDAR_TYPE :
			case SweetDevRia.Form.RIA_SUGGEST_TYPE :
				this.setValue (comp, data);
				break;
			case SweetDevRia.Form.SELECT_TYPE :

				if (data && data.length) {
					comp.options.length = 0;
					var selectedValue = null;
					for (var i = 0; i < data.length; i++) {
						var optBean = data[i];
						if ((optBean.label!=null) && (optBean.value!=null)) {
							var value = optBean.value;
							var text = optBean.label;
							comp.options[comp.options.length] = new Option (text, value);
							if(optBean.selected == true){
								selectedValue = text;
							}
						}
					}
					if(selectedValue!=null){
						this.setValue(comp, selectedValue);
					}
				}
				
				break;
				
			default:break;
		}
		
		this.afterLoadData (comp, data);
	}
};



/**
 * Set the value of a component value
 * @param {component} comp Component to set
 * @param {String} value the new value to set
 * @private
 */
SweetDevRia.Control.prototype.setValue = function (comp, value) {
	if (this.beforeSetValue (comp, value)) {
		SweetDevRia.Form.setValue (comp, value);
		 		
		this.afterSetValue (comp, value);
	}
};



/*
SweetDevRia.Editable.testValue = function (evt, editable) {
	
	var editComponent = editable.getEditComponent ();
	var regexpr = editable.pattern;
	var value = editComponent.value;
		
	var reg = editable.pattern [0];
	var result = reg.test(value);

	// look d'erreur
	if (! result) {
		SweetDevRia.DomHelper.addClassName (editComponent, "ideo-ctrl-invalid");
		editable.inError = true;
	}
	else {
		SweetDevRia.DomHelper.removeClassName (editComponent, "ideo-ctrl-invalid");
		editable.inError = false;
	}
	
};
*/

SweetDevRia.Control.testAllowChar = function (evt, control) {
	var event = SweetDevRia.EventHelper.getEvent (evt);
	if (control.allowChar) {
		var reg = new RegExp(control.allowChar);
		var keycode = evt.keyCode;
		if (browser.isGecko) {
			keycode = evt.charCode;
		}
		if (keycode) {
			if (! evt.shiftKey && (keycode >= 65 && keycode <= 90)) {
				keycode = keycode +  32;
			}	
			// fleches, debut, fin et back
			if ((keycode==null) || (keycode==8)) {
			   return true;	
			}
			var key = String.fromCharCode(keycode);
			var result = reg.test(key);
			var srcId = event.src.name; 
			if (! result) {
				control.setErrorMode (srcId, true, [[control.charMessageType, control.charMessage]]);
				
				SweetDevRia.EventHelper.stopPropagation (evt);
				SweetDevRia.EventHelper.preventDefault (evt);
			}
			else {
				control.setErrorMode (srcId, false, [[control.charMessageType, control.charMessage]]);
			}
		}
	}
	return null;
};



/**
 * Test a component value
 * @param {String} id Identifient of component to test 
 * @param {String} value Value to test.
 * @return error messages configuration. ex :[["loginMessage", null, true, false],  ["globalMessage", "Votre identifiant est inconnu !", true, true]] if in error, null esle
 * @type Array
 * @private
 */
SweetDevRia.Control.prototype.testValue = function (id, value) {
	var testResult = [true, null, null];

	if (this.beforeTestValue (id, value)) {

		if (this.test) {
			var regexpr = this.test[0];
			if (this.canBeEmpty && regexpr!=SweetDevRia.Control.NOTNULL_MASK) {
				regexpr = SweetDevRia.Control.EMPTY_MASK + regexpr;
			}

			var reg = new RegExp(regexpr);
			testResult = [reg.test(value), this.test[1]];
		}

		if (testResult[0] && this.functionTest) {
			var functionTest = this.functionTest[0];
			var result = functionTest.call (this, value);

			testResult = [result, this.functionTest[1]];
		}

		if (testResult[0] && this.testClass) {
			// Call server by ajax to test the value
			var data = this.synchCallIAction (this.testClass[0], {"srcId" : id, "value" :value});

			testResult = [data ["data"], this.testClass[1]];
		}

		this.afterTestValue (id, value);
	}
	
	return testResult;
};

SweetDevRia.Control.onRiaControl = function (control) {

	return control.control (this.id);
};


/**
 * This method test the source component value 
 * @param {Event} evt Mouse Event
 * @param {SweetDevRia.Control} control 
 * @return True if control test are ok, else false
 * @type boolean 
 * @private
 */
SweetDevRia.Control.prototype.onControl = function (evt, control) {
	evt = SweetDevRia.EventHelper.getEvent (evt);
	var srcId = evt.src.name;
	return control.control (srcId);
};


/**
 * This method test the source component value
 * @param {String} targetId Component identifiant to test
 * @return True if control test are ok, else false
 * @type boolean 
 * @private
 */
SweetDevRia.Control.prototype.control = function (targetId) {

	var value = SweetDevRia.Form.getValue (targetId);
	var testResult = this.testValue (targetId, value);

	if (testResult[0]) {
		this.executeActions (targetId, value, this.actions);
	}
	else {
		this.executeActions (targetId, value, this.actionsElse);
	}

	this.setErrorMode (targetId, ! testResult[0], testResult[1]);

	return testResult[0];
};


/**
 * This method launch the whole tests packed into this control component 
 * @return True if control tests are ok, false otherwise
 * @type boolean 
 */
SweetDevRia.Control.prototype.controlAll = function () {

	var ids = this.srcIds.split(",");
	for(var i = 0; i<ids.length; ++i){
		if(this.control(ids[i]) == false){
			return false;
		}
	}
	return true;
};


/**
 * Put an error style on source component
 * @param {String} id Component identifiant on error
 * @param {boolean} errorMode true to put an error style, else false
 * @param {Array} messageConf Optional error messages configuration. ex :[["loginMessage", null],  ["globalMessage", "Votre identifiant est inconnu !"]]
 * @private
 */
SweetDevRia.Control.prototype.setErrorMode = function (id, errorMode, messageConf) {
	if (this.beforeSetErrorMode (id, errorMode)) {
		var srcs = SweetDevRia.Form.getComponents (id);
		
		for (var i = 0; i < srcs.length; i++) {
			var src = srcs [i];
			var type = SweetDevRia.Form.getType (src);
			switch (type) {
				case SweetDevRia.Form.RIA_EDITABLE_TYPE :
					src = document.getElementById (src.targetId);
				case SweetDevRia.Form.INPUT_TYPE :
				case SweetDevRia.Form.TEXTAREA_TYPE :
				case SweetDevRia.Form.SELECT_TYPE :
				case SweetDevRia.Form.RADIO_TYPE :
				case SweetDevRia.Form.CHECKBOX_TYPE :
				case SweetDevRia.Form.RIA_SUGGEST_TYPE :
					if (errorMode) {
						SweetDevRia.Messenger.sendMessage (messageConf, errorMode, src.id);
					} 
					else {
						SweetDevRia.Messenger.sendMessage (messageConf, null, src.id);
					}
					
					break;
				case SweetDevRia.Form.RIA_CALENDAR_TYPE :
			
					if (errorMode) {
						if (src.singleDateField) {
							SweetDevRia.Messenger.sendMessage (messageConf, errorMode, src.singleDateField.id);
						}
						if (src.dateYearField) {
							SweetDevRia.Messenger.sendMessage (messageConf, errorMode, src.dateYearField.id);
						}						
						if (src.dateMonthField) {
							SweetDevRia.Messenger.sendMessage (messageConf, errorMode, src.dateMonthField.id);
						}						
						if (src.dateDayField) {
							SweetDevRia.Messenger.sendMessage (messageConf, errorMode, src.dateDayField.id);
						}
					} 
					else {
						if (src.singleDateField) {
							SweetDevRia.Messenger.sendMessage (messageConf, null, src.singleDateField.id);
						}
						if (src.dateYearField) {
							SweetDevRia.Messenger.sendMessage (messageConf, null, src.dateYearField.id);
						}						
						if (src.dateMonthField) {
							SweetDevRia.Messenger.sendMessage (messageConf, null, src.dateMonthField.id);
						}						
						if (src.dateDayField) {
							SweetDevRia.Messenger.sendMessage (messageConf, null, src.dateDayField.id);
						}						
					}

					break;
					
				default:break;
			}
			
			
			this.applyErrorClasses (src.id, errorMode);

		}
		
		this.afterSetErrorMode (id, errorMode);
	}
};



/**
 * Apply or remove the component error class and the label error class
 * @param {String} srcId Component identifiant on error
 * @param {boolean} errorMode True to apply css classes, false to remove it
 */
SweetDevRia.Control.prototype.applyErrorClasses = function (srcId, errorMode) {
	if (srcId != null && srcId != "") {
		var comp = document.getElementById (srcId);
		if (comp) {
			if (this.applyErrorClass) {
				if (errorMode) {
					SweetDevRia.DomHelper.addClassName(comp,"ideo-ctrl-error");
				}
				else{
					SweetDevRia.DomHelper.removeClassName(comp,"ideo-ctrl-error");
				}
			}		
	
			if (this.applyLabelErrorClass) {
				var label = SweetDevRia.Form.getLabel (srcId);
			
				if (label) {
					if (errorMode) {
						SweetDevRia.DomHelper.addClassName(label,"ideo-ctrl-labelError");
					}
					else{
						SweetDevRia.DomHelper.removeClassName(label,"ideo-ctrl-labelError");
					}
				}
			}		
		}
	}
};


/**
 * Disable a component
 * @param {Component} comp Component to disable
 * @param {boolean} disable True to disable the component, else false
 * @private
 */
SweetDevRia.Control.prototype.setComponentDisable = function (comp, disable) {
	if (this.beforeSetComponentDisable (comp, disable)) {
		var type = SweetDevRia.Form.getType (comp);
		switch (type) {
			case SweetDevRia.Form.INPUT_TYPE :
			case SweetDevRia.Form.TEXTAREA_TYPE :
			case SweetDevRia.Form.SELECT_TYPE :
			case SweetDevRia.Form.RADIO_TYPE :
			case SweetDevRia.Form.CHECKBOX_TYPE :
				comp.disabled = disable;
				break;
			case SweetDevRia.Form.RIA_CALENDAR_TYPE :
			case SweetDevRia.Form.RIA_SUGGEST_TYPE :

				comp.setEnabled (!disable);

				break;
			default:break;
		}
		
		this.afterSetComponentDisable (comp, disable);
	}
};

/**
 * set the visibility of a component
 * @param {Component} comp Component to set the visibility
 * @param {boolean} visibility True to show the component, false to hide
 * @private
 */
SweetDevRia.Control.prototype.setComponentVisibility = function (comp, visibility) {
	if (this.beforeSetComponentVisibility (comp, visibility)) {
		var type = SweetDevRia.Form.getType (comp);
		switch (type) {
			case SweetDevRia.Form.INPUT_TYPE :
			case SweetDevRia.Form.SELECT_TYPE :
			case SweetDevRia.Form.RADIO_TYPE :
			case SweetDevRia.Form.CHECKBOX_TYPE :
			case SweetDevRia.Form.TEXTAREA_TYPE :

				comp.style.display = visibility ? "" : "none";

				break;
			case SweetDevRia.Form.RIA_CALENDAR_TYPE :
			
				if (comp.singleDateField) {
					comp.singleDateField.style.display = visibility ? "" : "none";
				}			
				if (comp.dateYearField) {
					comp.dateYearField.style.display = visibility ? "" : "none";
				}
				if (comp.dateMonthField) {
					comp.dateMonthField.style.display = visibility ? "" : "none";
				}
				if (comp.dateDayField) {
					comp.dateDayField.style.display = visibility ? "" : "none";
				}
				
				var tooltipLink  = document.getElementById ("openCalendarTooltip"+comp.id);
				if (tooltipLink) {
					tooltipLink.style.display = visibility ? "" : "none";
				}

				var container  = document.getElementById (comp.id + "Container");
				if (container) {
					container.style.display = visibility ? "" : "none";
				}

				break;
			case SweetDevRia.Form.RIA_SUGGEST_TYPE :

				comp.setVisible (visibility);

				break;
			default:
				comp.style.display = visibility ? "" : "none";
				break;
		}
		
		var label = SweetDevRia.Form.getLabelTag (comp.name);
		if (label)  {
			label.style.display = visibility ? "" : "none";
		}
		
		this.afterSetComponentVisibility (comp, visibility);
	}
};


/**
 * Reset the component value
 * @param {Component} comp component to reset
 * @private
 */
SweetDevRia.Control.prototype.resetComponent = function (comp) {
	if (this.beforeResetComponent (comp)) {

		SweetDevRia.Form.resetComponent (comp);		

		this.afterResetComponent (comp);
	}
};


/**
 * This method execute action.
 * @param {String} id Identifiant of source component
 * @param {String} value Source component value, used if exist an action condition
 * @param {array} actions Actions to execute
 * @private
 */
SweetDevRia.Control.prototype.executeActions = function (id, value, actions) {
	if (this.beforeExecuteActions (id, value, actions)) {
		for (var j = 0; j < actions.length; j++) {
			var action = actions [j][0]; 
			var targetIds = actions [j][1];
			
			var condition = actions [j][2];
			var param = actions [j][3];
				
			var executeAction = true;

			if (condition) {
				var reg = new RegExp(condition);
				executeAction = reg.test(value);
			}

			if (executeAction) {
				var targets = SweetDevRia.Form.getComponents (targetIds);
				for (var i = 0; i < targets.length; i++) {
					var target = targets [i];

					switch (action) {
						case SweetDevRia.Control.SHOW_ACTION :
							this.setComponentVisibility (target, true);
							break;
						case SweetDevRia.Control.HIDE_ACTION :
							this.setComponentVisibility (target, false);
							break;
						case SweetDevRia.Control.DISABLE_ACTION :
							this.setComponentDisable (target, true);
							break;
						case SweetDevRia.Control.ENABLE_ACTION :
							this.setComponentDisable (target, false);
							 break;
						case SweetDevRia.Control.LOADDATA_ACTION :
							var data = this.synchCallIAction (param, {"srcId" : target.id, "value" :value});
							this.loadData (target, data["data"]);

							break;					
						case SweetDevRia.Control.SETVALUE_ACTION :
							var data = this.synchCallIAction (param, {"targetId" : target.id, "srcId" : id, "value" :value});

							this.setValue (target, data["data"]);
	
							break;
						case SweetDevRia.Control.RESET_ACTION :
							this.resetComponent (target);
							break;
						default:break;
					}
				}
				
				
				if (action == SweetDevRia.Control.HANDLER_ACTION) {
					if (param) {
						window[param].call (this, value);						
					}
				}

			}
		 }
		
		this.afterExecuteActions (id, value, actions);
	}
};


/**
 * Set the source identifiers
 * @param {String} srcIds Source component identifiers to control, ex : "id1,id2"
 */
SweetDevRia.Control.prototype.setSrcIds = function (srcIds) {
	this.srcIds = srcIds;
};


/**
 * Optional, add an action to executed on target component if the control is ok.
 * @param {String} action Optional action to executed on target component if the control is ok. Expected values are : hide, show, disable, enable, loadData
 * @param {String} RegExp condition to execute this action.
 */
SweetDevRia.Control.prototype.addAction = function (action, targetIds, condition, param) {
	this.actions.add ([action, targetIds, condition, param]);
};

/**
 * Optional, add an action to executed on target component if the control is not ok.
 * @param {String} action Optional action to executed on target component if the control is not ok. Expected values are : hide, show, disable, enable, loadData
 * @param {String} RegExp condition to execute this action.
 */
SweetDevRia.Control.prototype.addActionElse = function (action, targetIds, condition, param) {
	this.actionsElse.add ([action, targetIds, condition, param]);
};

/**
 * Set the test to valid the source component value. This test could be null if you declare a testClass for a value server test.
 * @param {String} test RegExp to test the source component value. Any regexp are predefined : email, alpha, number, alphanumber, not null
 * @param {Array} messageConf Optional error messages configuration. ex :[["loginMessage", null, true, false],  ["globalMessage", "Votre identifiant est inconnu !", true, true]]
 */
SweetDevRia.Control.prototype.setTest = function (test, messageConf) {
	this.test = [test, messageConf];
};

/**
 * Set the test class. This server class is used to test the source component value validity. This attribute could be null if test attribute is not empty.
 * @param {String} testClass Server test class.
 * @param {Array} messageConf Optional error messages configuration. ex :[["loginMessage", null, true, false],  ["globalMessage", "Votre identifiant est inconnu !", true, true]]
 */
SweetDevRia.Control.prototype.setTestClass = function (testClass, messageConf) {
	this.testClass = [testClass, messageConf];
};

/**
 * Set the client Function test. This method is called if mask test is ok, before call optional server test.
 * @param {Function} functionTest client Function test. This method is called if mask test is ok, before call optional server test
 * @param {Array} messageConf Optional error messages configuration. ex :[["loginMessage", null, true, false],  ["globalMessage", "Votre identifiant est inconnu !", true, true]]
 */
SweetDevRia.Control.prototype.setFunctionTest = function (functionTest, messageConf) {
	this.functionTest = [functionTest, messageConf];
};

/**
 * Set an handler. An handler is a JavaScript function which will be called is the source component value is ok.
 * @param {Function} handler JavaScript function which will be called is the source component value is ok.
 */
SweetDevRia.Control.prototype.setHandler = function (handler) {
	this.handler = handler;
};

/**
 * Indicate if this component value can be empty or not
 * @param {boolean} canBeEmpty True if the component value can be empty, else false
 */
SweetDevRia.Control.prototype.setCanBeEmpty = function (canBeEmpty) {
	this.canBeEmpty = canBeEmpty;
};

