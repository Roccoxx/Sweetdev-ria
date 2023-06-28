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
 * This is the Messenger component class
 * @param {String} id Id of this messenger
 * @constructor
 * @extends RiaComponent
 * @base RiaComponent
 */
SweetDevRia.Messenger = function(id){
	superClass (this, SweetDevRia.RiaComponent, id, "Messenger");
	
	this.messageTypes = [];
	
	this.displayIcon = true;
	this.displayMessage = true;
};

extendsClass(SweetDevRia.Messenger, SweetDevRia.RiaComponent);

/**
 * Add a new message type to display
 * @param {String } messageType The new message type to display
 */
SweetDevRia.Messenger.prototype.addMessageType = function (messageType) {
	this.messageTypes.add (messageType);
};


/**
 * 
 * @param {Array} messageConf Error messages configuration as [[mesageType, message], ...]. 
 * 					ex :[["loginMessage", null],  ["globalMessage", "Votre identifiant est inconnu !"]]
 * @param {boolean} errorMode True if the component is in error, else false
 * @param {String} srcId Component identifiant on error
 */
SweetDevRia.Messenger.sendMessage = function (messageConf, errorMode, srcId) {
	if (messageConf) {
		for (var i = 0; i < messageConf.length; i++) {
			var messConf = messageConf [i];
			if (messConf) {
				var messageType = messConf [0];
				var message = messConf [1];
				
				// find all message component that listen this message type
				var messengers = SweetDevRia.getInstances ("Messenger");
				if(messengers){
					for (var j = 0; j < messengers.length; j++) {
						var messenger = SweetDevRia.$(messengers [j]);
						if (messenger && messenger.messageTypes.contains (messageType)) {
							messenger.sendMessage (srcId, errorMode, message);
						}
					}
				}
			}
		}
	}
};

/**
 * Display an error message
 * @param {String} srcId Component identifiant on error
 * @param {boolean} errorMode True if the component is in error, else false
 * @param {String} message The error message to display
 * @private
 */
SweetDevRia.Messenger.prototype.sendMessage = function (srcId, errorMode, message) {
	var messageZone = document.getElementById (this.id);
	var messageContainer = document.getElementById (this.id+'_container');

	if (messageZone) {
		if (errorMode == null) {
			messageContainer.style.display = "none";
		}
		else {
			messageContainer.style.display = "";

			if (this.displayIcon) {
				messageZone.innerHTML = "&nbsp;";
				if (errorMode) {
					SweetDevRia.DomHelper.addClassName(messageZone,"ideo-msg-iconError");
					SweetDevRia.DomHelper.removeClassName(messageZone,"ideo-msg-iconNotError");
				}
				else{
					SweetDevRia.DomHelper.addClassName(messageZone,"ideo-msg-iconNotError");
					SweetDevRia.DomHelper.removeClassName(messageZone,"ideo-msg-iconError");
				}
			}

			if (this.displayMessage) {

				messageZone.innerHTML = message;

				if (errorMode) {
					SweetDevRia.DomHelper.addClassName(messageZone,"ideo-msg-messageError");
					SweetDevRia.DomHelper.removeClassName(messageZone,"ideo-msg-messageNotError");
				}
				else{
					SweetDevRia.DomHelper.addClassName(messageZone,"ideo-msg-messageNotError");
					SweetDevRia.DomHelper.removeClassName(messageZone,"ideo-msg-messageError");
				}
				
				this.getFrame().refreshBorders();
			}
		}
	}
	
};


