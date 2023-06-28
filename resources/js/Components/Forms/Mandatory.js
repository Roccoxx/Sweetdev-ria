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
 * This is the Mandatory component class
 * @param {String} id Id of this mandatory
 * @constructor
 * @extends RiaComponent
 * @base RiaComponent
 */
SweetDevRia.Mandatory = function(id){
	superClass (this, SweetDevRia.RiaComponent, id, "SweetDevRia.Mandatory");
	
	this.formId = null;
	this.ids = {};
	this.type = SweetDevRia.Mandatory.AND_TYPE;
};

extendsClass(SweetDevRia.Mandatory, SweetDevRia.RiaComponent);

SweetDevRia.Mandatory.AND_TYPE = 0;
SweetDevRia.Mandatory.OR_TYPE = 1;

/**
 * This method is automatically called at the page load
 * @private
 */
SweetDevRia.Mandatory.prototype.initialize = function () {
	if (this.formId) {
		var form = document.getElementById (this.formId);

		if (form) {
			SweetDevRia.EventHelper.addListener(form, "submit", this.onControlListener, this);
		}
	}
};

/**
 * Return all Mandatory controls associated with a formular id.
 * @param {String} formId formular id to search
 * @return All mandatory controls associated with a formular id.
 * @type Array
 */
SweetDevRia.Mandatory.getFormControl = function (formId) {
	var controls = [];
	var mandatories = SweetDevRia.getInstances("SweetDevRia.Mandatory");
	if (mandatories) {
		for (var i = 0; i < mandatories.length; i++){
			var mandatory = SweetDevRia.$ (mandatories [i]);
			if (mandatory && mandatory.formId == formId) {
				controls.add (mandatory);
			}
		}
	}

	return controls;
};

/**
 * Test if formular all mandatory constraints are respected
 * @param {String} formId formulare id to test
 * @return true if formular all mandatory constraints are respected, else false
 * @type boolean
 */
SweetDevRia.Mandatory.testFormMandatory = function (formId) {
	var mandatories = SweetDevRia.Mandatory.getFormControl (formId);
	for (var i = 0; i < mandatories.length; i++){
		var mandatory = mandatories [i];
		if (! mandatory.onControl ()) {
			return false;
		}
	}
	
	return true;
};

/**
 * call control method and stop event propagation if the form does't be submitted
 * @param {Event} evt
 * @param {SweetDevRia.Mandatory} mandatory
 * @private
 */
SweetDevRia.Mandatory.prototype.onControlListener = function (evt, mandatory) {
	var res = mandatory.onControl ();

	if (! res) {
		SweetDevRia.EventHelper.preventDefault (evt);
	}
	
	return res;
};

/**
 * Display all error messages
 * @param {Array} errorIds Component identifiants on error
 * @private
 */
SweetDevRia.Mandatory.prototype.displayErrors = function (errorIds) {

	for (var i = 0; i < errorIds.length; i++) {
		var id  = errorIds [i];		
		if (this.ids  [id]) {
			var messageConf = this.ids [id];
			SweetDevRia.Messenger.sendMessage (messageConf, true, id);
		}
	}
	
	if (errorIds.length > 0) {
		// send general message
		SweetDevRia.Messenger.sendMessage (this.messageConf, true, null);
	}
	else {
		SweetDevRia.Messenger.sendMessage (this.messageConf, null, null);
	}

};


/**
 * Clear all error messages
 */
SweetDevRia.Mandatory.prototype.clearErrors = function () {
	SweetDevRia.Messenger.sendMessage (this.messageConf, null, null);
};

/**
 * Test if all mandatory components are not null.
 * @return true if mandatory rules are ok, else false
 * @type boolean
 */
SweetDevRia.Mandatory.prototype.onControl = function () {
	var errorIds = [];
	var or = false;	
	for (var id  in this.ids) {

		if (id != "toJSONString") {
			var control = SweetDevRia.$(id);
			if(control){
				if (!control.controlAll()) {
					errorIds.add (id);
				}
				else {
					if (this.type == SweetDevRia.Mandatory.OR_TYPE) {
						or = true;
					}
				}								
			}else{
				SweetDevRia.log.error('The control id :'+id+' does not exist.');
			}
		}
	}

	if (or) {
		errorIds = [];
	}

	this.displayErrors (errorIds);

	return (errorIds.length == 0);
};

/**
 * Add an mandatory component identifiant
 * @param {String} id New mandatory component identifiant
 * @param {Array} messageConf Optionnal error messages configuration. ex :[["loginMessage", null, true, false],  ["globalMessage", "Votre identifiant est inconnu !", true, true]]
 */
SweetDevRia.Mandatory.prototype.addMandatoryId = function (id, messageConf) {
	this.ids [id] = messageConf;
};


SweetDevRia.Mandatory.prototype.addMessage = function (messageConf) {
	this.messageConf = messageConf;
};

