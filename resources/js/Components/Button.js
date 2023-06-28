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
 * This is the Button component class
 * @param {String} id Id of this Button
 * @constructor
 * @extends SweetDevRia.RiaComponent
 * @base SweetDevRia.RiaComponent
 */
SweetDevRia.Button = function(id){
	superClass (this, SweetDevRia.RiaComponent, id, "SweetDevRia.Button");
	
	this.contentId = null;

};

extendsClass(SweetDevRia.Button, SweetDevRia.RiaComponent);

/**
 * This method is automatically called at the page load
 * @private
 */
SweetDevRia.Button.prototype.initialize = function () {
	var content = document.getElementById (this.contentId);
	if (content) {
		var button = document.createElement ("span");
		//button.setAttribute("onclick","return false;");

		button.id = this.id;
		SweetDevRia.DomHelper.addClassName(button, "ideo-but-main");
	
		content.parentNode.insertBefore (button, content);
	
		var left = document.createElement ("span");
		SweetDevRia.DomHelper.addClassName(left, "ideo-but-left");
	
		var center = document.createElement ("span");
		SweetDevRia.DomHelper.addClassName(center, "ideo-but-center");
		if (! browser.isIE) {
			SweetDevRia.DomHelper.addClassName(center, "ideo-but-center-FF");
		}
		var right = document.createElement ("span");
		SweetDevRia.DomHelper.addClassName(right, "ideo-but-right");
		if (! browser.isIE) {
			SweetDevRia.DomHelper.addClassName(right, "ideo-but-right-FF");
		}
		center.appendChild (content);
		right.appendChild (center);	
		left.appendChild (right);

		button.appendChild (left);

	}

	/**
	 * This method set a gray skin (like a disabled button)
	 */
	SweetDevRia.Button.prototype.setDisabledSkin = function () {
		var but_main = SweetDevRia.DomHelper.get(this.id);
	    var but_left = SweetDevRia.DomHelper.getChildByTagName(but_main, 0, "span");
	    var but_right = SweetDevRia.DomHelper.getChildByTagName(but_left, 0, "span");
        var but_center =  SweetDevRia.DomHelper.getChildByTagName(but_right, 0, "span");
        var but_a = SweetDevRia.DomHelper.getChildByTagName(but_center, 0, "a");
        
        SweetDevRia.DomHelper.removeClassName(but_a, "ideo-but-center");
        
        SweetDevRia.DomHelper.addClassName(but_main, "ideo-but-main-gray");
        SweetDevRia.DomHelper.addClassName(but_left, "ideo-but-left-gray");
        SweetDevRia.DomHelper.addClassName(but_right, "ideo-but-right-gray");
        SweetDevRia.DomHelper.addClassName(but_center, "ideo-but-center-gray");
        
        SweetDevRia.DomHelper.setStyle(but_a, "cursor", "default");
	}

};




