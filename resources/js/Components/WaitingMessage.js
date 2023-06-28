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
 *
 */
 
/**
* @class Waiting Message Component
* @constructor
* @param {String} id 		The id of the component
* @param {String} message 	The message to display
* @param {String} css 		A additional css class for this component
* @param {boolean} modal 	Deprecated
*/
SweetDevRia.WaitingMessage = function(id, message, css, modal) {
	if (modal == null){
		modal = true;
	} 
	if (message == null){
		message = "";
	} 
	if (css == null){
		css = "";
	} 

	superClass (this, SweetDevRia.RiaComponent, id, "SweetDevRia.WaitingMessage");
	
	this.message = message;
	this.css = css;
	this.modal = modal;
	
	this.isShown = false;
};

extendsClass (SweetDevRia.WaitingMessage, SweetDevRia.RiaComponent);

SweetDevRia.WaitingMessage.UNIQUE_ID = "SweetDevRia_WaitMessage";




/**
* Change the component's message
* @param {String} message the new message
*/
SweetDevRia.WaitingMessage.prototype.setMessage = function (message) {
	this.message = message;
};

/**
* Create the HTML render of the component 
* @return the HTML render of the element
* @type HTMLElement
* @private
*/
SweetDevRia.WaitingMessage.prototype.createMessageDiv = function() {
    var div = document.createElement("div");
    div.setAttribute('id', this.id);
//    div.setAttribute('class', 'ideo-ndg-waitingMessage '+this.css);
    return document.body.appendChild(div);
};

/**
* Show the waiting message
*/
SweetDevRia.WaitingMessage.prototype.show = function() {
	if(this.isShown){
		return;
	}

	var div = document.getElementById (this.id);
	if (div == null) {
		div = this.createMessageDiv ();
	}

	if (div) {
//	    div.setAttribute('class', 'ideo-ndg-waitingMessage '+this.css);
		div.style.position="absolute";

	    div.innerHTML = TrimPath.processDOMTemplate(this.templateMessage, this);

		if (this.modal) {
			SweetDevRia.ModalPanel.getInstance ().show ();
		}

		var x = SweetDevRia.DomHelper.getScrolledLeft() + ((document.body.clientWidth - div.offsetWidth) /2);
		var y = SweetDevRia.DomHelper.getScrolledTop() + ((document.body.clientHeight - div.offsetHeight) /2);
		div.style.left = x+"px";
		div.style.top = y+"px";

		var zindex = SweetDevRia.DisplayManager.getInstance().getTopZIndex ();
		div.style.zIndex = zindex;

		div.style.display = "block";
		
		
		SweetDevRia.DomHelper.addClassName(div, "ideo-ndg-waitingMessage");
		SweetDevRia.DomHelper.addClassName(div, this.css);
		
		this.isShown = true;
	}

};	

/**
* Hide the waiting message
*/
SweetDevRia.WaitingMessage.prototype.hide = function() {

	var div = document.getElementById (this.id);
	if (div!=null & this.isShown) {
		div.style.display = "none";

		if (this.modal) {
			SweetDevRia.ModalPanel.getInstance ().hide ();
		}
		
		this.isShown = false;
	}
};

SweetDevRia.WaitingMessage.prototype.templateMessage = "\
	<img src=\"" + SweetDevRIAImagesPath + "/spinner.gif\" align=\"absmiddle\"> ${message}\
";


SweetDevRia.showWaitingMessage = function(message, cssClass, modal) {
	var waitingMessage = SweetDevRia.$(SweetDevRia.WaitingMessage.UNIQUE_ID);

	if  (waitingMessage == null) {
		waitingMessage = new SweetDevRia.WaitingMessage (SweetDevRia.WaitingMessage.UNIQUE_ID, message, cssClass, modal);
	}
	else if(!waitingMessage.isShown){
		waitingMessage.message = message;
		waitingMessage.css = cssClass;
		waitingMessage.modal = modal;
	}
	
	waitingMessage.show ();	
};

SweetDevRia.centerWaitingMessage = function(element){
	var x = SweetDevRia.DomHelper.getX(element);
	var y = SweetDevRia.DomHelper.getY(element);
	
	var width = SweetDevRia.DomHelper.getWidth(element);
	var height = SweetDevRia.DomHelper.getHeight(element);
	
	var waitingMessage = SweetDevRia.$(SweetDevRia.WaitingMessage.UNIQUE_ID);
	if  (waitingMessage) {
		var waitingDiv = SweetDevRia.DomHelper.get(waitingMessage.id);
		SweetDevRia.DomHelper.setX(waitingDiv, x+width/2-SweetDevRia.DomHelper.getWidth(waitingDiv)/2);
		SweetDevRia.DomHelper.setY(waitingDiv, y+height/2-SweetDevRia.DomHelper.getHeight(waitingDiv)/2);	
		
		waitingDiv.style.zIndex = SweetDevRia.DisplayManager.getInstance().getTopZIndex(true);
	}
};

SweetDevRia.hideWaitingMessage = function() {
	var waitingMessage = SweetDevRia.$(SweetDevRia.WaitingMessage.UNIQUE_ID);
	if  (waitingMessage) {
		waitingMessage.hide ();
	}
};
