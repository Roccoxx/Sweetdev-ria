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
 * @class Display a modal panel
 * @constructor
 * @param {String} id 	the id of the modal panel
 * @private
 */  
SweetDevRia.ModalPanel = function(id) {
	superClass (this, SweetDevRia.RiaComponent, id, "SweetDevRia.ModalPanel");

	this.panel = null;
	this.iframe = null;
};

extendsClass (SweetDevRia.ModalPanel, SweetDevRia.RiaComponent);


SweetDevRia.ModalPanel.MODAL_PANEL_ID = "__SweetDEV_modalPanel";

// creates the instance
SweetDevRia.ModalPanel._instance = new SweetDevRia.ModalPanel (SweetDevRia.ModalPanel.SWEETDEV_RIA_PROXY_ID);

SweetDevRia.ModalPanel.getInstance = function () {
	return SweetDevRia.ModalPanel._instance;
};


/**
 * Public APIS
 */
 
/**
 * This method is called before showing the modal panel 
 * To be overridden !!
 * @param {int} zindex Optional z index of the modal panel.
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.ModalPanel.beforeShowModalPanel = function(zindex){	return true; };

/**
 * This method is called after having turn the modalPanel to visible state 
 * To be overridden !!
 * @param {int} zindex Optional z index of the modal panel.
 */
SweetDevRia.ModalPanel.afterShowModalPanel = function(zindex){};

/**
 * This method is called before hidding the modal panel 
 * To be overridden !!
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.ModalPanel.beforeHideModalPanel = function(){	return true; };

/**
 * This method is called after having turn the modalPanel to hidden state 
 * To be overridden !!
 */
SweetDevRia.ModalPanel.afterHideModalPanel = function(){};

/**
 * This event type is fired when show the modal panel
 * @static
 */
SweetDevRia.ModalPanel.SHOW_EVENT = "show";


/**
 * This event type is fired when hide the modal panel
 * @static
 */
SweetDevRia.ModalPanel.HIDE_EVENT = "hide";


/**
 * Resize the modal panel on window resize
 * @private
 */
SweetDevRia.ModalPanel.prototype.resize  = function() {
	if(this.panel) {//TT 451
		this.panel.style.height = YAHOO.util.Dom.getDocumentHeight()+"px";
		this.panel.style.width = YAHOO.util.Dom.getDocumentWidth()+"px";
	}
	if(this.iframe) {
		this.iframe.style.height = YAHOO.util.Dom.getDocumentHeight()+"px";
		this.iframe.style.width = YAHOO.util.Dom.getDocumentWidth()+"px";
	}
};

/**
 * Show the modal panel
 * @param {int} zindex Optional z index of the modal panel.
 */
SweetDevRia.ModalPanel.showModalPanel = function(zindex){
	if(SweetDevRia.ModalPanel.beforeShowModalPanel(zindex)){
		SweetDevRia.ModalPanel.getInstance().show(zindex);

		SweetDevRia.ModalPanel.afterShowModalPanel(zindex);
	}
};

/**
 * Hide the modal panel
 */
SweetDevRia.ModalPanel.hideModalPanel = function(){
	if(SweetDevRia.ModalPanel.beforeHideModalPanel()){
		SweetDevRia.ModalPanel.getInstance().hide();
	
		SweetDevRia.ModalPanel.afterHideModalPanel();
	}
};


/**
 * Returns true if the modal panel is currently visible
 * @return true if the modal panel is currently visible
 * @type boolean
 */
SweetDevRia.ModalPanel.isVisible = function(){
	return SweetDevRia.ModalPanel.getInstance().isVisible();
};

/**
 * Show an instance of modal panel
 * @param {int} zindex the z index of the modal panel.
 * @private
 */
SweetDevRia.ModalPanel.prototype.show = function(zindex) {
	if(! this.panel) {
		this.create ();
	}

	if (zindex == null) {
		SweetDevRia.DisplayManager.getInstance()._getMaxZindex();
		zindex = SweetDevRia.DisplayManager.getInstance().getTopZIndex ();
	}
	
	this.panel.style.zIndex = zindex + 1;
	
	this.resize ();
	this.panel.style.display = "block";
	if (this.iframe) {
		this.iframe.style.display = "block";
		this.iframe.style.zIndex = zindex;
	}
	
	this.fireEventListener (SweetDevRia.ModalPanel.SHOW_EVENT);
};


/**
 * Returns true if the modal panel is currently visible
 * @return true if the modal panel is currently visible
 * @type boolean
 * @private
 */
SweetDevRia.ModalPanel.prototype.isVisible = function() {
	if (this.panel) {
		return (this.panel.style.display == "block");
	}
	return false;
};


/**
 * Hide the modal panel
 * @private
 */
SweetDevRia.ModalPanel.prototype.hide = function() {
	if(this.panel) {
		this.panel.style.display = "none";
	}
	if (this.iframe) {
		this.iframe.style.display = "none";
	}
	this.fireEventListener (SweetDevRia.ModalPanel.HIDE_EVENT);
};

/**
 * Creates the grey panel 
 * @private
 */
SweetDevRia.ModalPanel.prototype.create = function() {
	// on affiche l iframe que dans le cas d un Internet Explorer inferieur a IE 7
	var displayIframe = browser.isIE && (browser.version < 7); 

//displayIframe= false;

	if (displayIframe) {
		this.iframe = document.createElement("iframe");
		this.iframe.setAttribute("frameborder", 0);
		this.iframe.setAttribute("src", SweetDevRIAJSPPath +"/blank.html");
//this.iframe.setAttribute("src", "");
		this.iframe.className = "ideo-mp-iframe";//JIRA SWTRIA-496
		this.iframe.style.position = "absolute";
		this.iframe.style.top = "0px";
		this.iframe.style.left = "0px";
		this.iframe.width = YAHOO.util.Dom.getDocumentWidth()+"px";
		this.iframe.height = YAHOO.util.Dom.getDocumentHeight()+"px";
		this.iframe.style.width = YAHOO.util.Dom.getDocumentWidth()+"px";
		this.iframe.style.height = YAHOO.util.Dom.getDocumentHeight()+"px";
		this.iframe.style.zIndex = 	SweetDevRia.DisplayManager.getInstance().getTopZIndex(true);
		this.iframe.style.display = "none";
	}

	this.panel = document.createElement("div");
	this.panel.style.position = "absolute";
	this.panel.style.top = "0px";
	this.panel.style.left = "0px";
	this.panel.style.zIndex = SweetDevRia.DisplayManager.getInstance().getTopZIndex(!displayIframe);
	this.panel.className = "ideo-mp-main";
	this.panel.style.display = "none";


	document.body.appendChild(this.panel);
	
	if (this.iframe) {
		document.body.appendChild(this.iframe);
	}

	var modalPanel = this;
	SweetDevRia.EventHelper.addListener (window, "resize", function () {
		modalPanel.resize ();
	});
	SweetDevRia.EventHelper.addListener (window, "scroll", function () {
		modalPanel.resize ();
	});
};
