/*** ------------------------------------
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
 * @class Communication class between browser and server. Singleton
 * @constructor
 */ 
SweetDevRia.ComHelper = function() {
	
	/** Callback repository */
	this.callbackRepository = {};
	this.globalStackSize = 0;
};

/**
 * Unique instance of the ComHelper
 * @type ComHelper
 */
SweetDevRia.ComHelper._instance = new SweetDevRia.ComHelper ();

/**
 * Return the instance of the ComHelper
 * @type ComHelper
 * @return the instance of the ComHelper
 * @private
 */
SweetDevRia.ComHelper.getInstance = function () {
	return SweetDevRia.ComHelper._instance;
};

/**
 * JavaScript var containing the page id.
 * @type String
 * @static
 */
SweetDevRia.ComHelper.ID_PAGE = "__RiaPageId";

/**
 * JavaScript post var containing the params.
 * @type String
 * @static
 */
SweetDevRia.ComHelper.EVENT_XML_PARAM = "eventXml";
 
 
/**
 * SweetDEV RIA server entry point.
 * @type String
 * @static
 * @private
 */
SweetDevRia.ComHelper.PROXY_URL = SweetDevRIAPath + "/RiaController";

/**
 * JSF page marker
 * @type String
 * @static
 * @private
 */
SweetDevRia.ComHelper.JSF_VIEW_ID = "com.sun.faces.VIEW";


/**
 * Return true if we are in a JSF context. //TODO next version.
 * @type boolean
 * @return true if we are in a JSF context, false otherwise
 * @private
 */
SweetDevRia.ComHelper.isJsfPage = function()  {
	return (document.getElementById (SweetDevRia.ComHelper.JSF_VIEW_ID) != null);
};

/**
 * Parses an XML String, cross browser.
 * @param {String} xmlStr the String to parse
 * @type DOMObject
 * @return a DOMObject resulting of the xml string parsed
 */
SweetDevRia.ComHelper.parseXml = function(xmlStr) {
	var parser = new DOMParser();
	var doc = parser.parseFromString(xmlStr, "text/xml");
	return doc;
};



/**
 * Stacks an event for the server
 * @param {RiaEvent} evt the event to stack, waiting for a send
 * @param {boolean} skipsend boolean to set to true to skip the sending if some requirements are fulfilled
 * @private
 */
SweetDevRia.ComHelper.stackEvent  = function(evt, skipsend) {
	var portletContext = SweetDevRia.PortletContextManager.getInstance().getContextByPt( SweetDevRia.$(evt.idSrc).portletId );
	portletContext.eventStack.push(evt);
	SweetDevRia.ComHelper.getInstance().globalStackSize ++;
	
	if(!skipsend && SweetDevRia.SYNCHRO_EVENTS != null && SweetDevRia.ComHelper.getInstance().globalStackSize >= SweetDevRia.SYNCHRO_EVENTS){
		SweetDevRia.ComHelper.fireEvent();
	}
};


/**
 * Flush the events stack. Force the server call. 
 */
SweetDevRia.ComHelper.flushEvents  = function() {
	SweetDevRia.ComHelper.fireEvent (null, true);
};
 
 

/**
 * Fires an event to a server model, and flush the stack
 * If no event are given as parameter, the stack of waiting events is flushed.
 * @param {RiaEvent} evt Optional. the event to send
 * @param {boolean} synchroCall Optional. true for a sycnhro call, false otherwise
 * @param {Function} callback Optional. a callback function to execute on server response
 */
SweetDevRia.ComHelper.fireEvent  = function(evt, synchroCall, callback) {
	var comHelper = SweetDevRia.ComHelper.getInstance ();
	
	if(evt){
		SweetDevRia.ComHelper.stackEvent(evt, true);
	}

	var portletContext = null;
	for(var i=0;i< SweetDevRia.PortletContextManager.getInstance().getContexts().length;++i){//TODO function flushPortletStack
		portletContext = SweetDevRia.PortletContextManager.getInstance().getContexts()[i];
		var evtStack = portletContext.eventStack;

		if(evtStack.length == 0){
			SweetDevRia.log.info('Fire event for portlet '+portletContext.id+' aborted due to empty stack.');
			continue;
		}

		var synchroCall = (synchroCall != null)?synchroCall:(evt!=null)?evt.params[SweetDevRia.Ajax.SYNCHRO_CALL]:true;

		/** Get an Ajax instance */
		var ajax = SweetDevRia.AjaxPooler.getInstance ();

		/** set Ajax generic callback */
		ajax.setCallback (SweetDevRia.ComHelper.callback);

		/** Register specific callback */
		comHelper.callbackRepository [ajax.id] = callback;
	
		/** pass parameters */
		var eventAsJson = "[";
		for(var i=0;i<evtStack.length;++i){
	
			var evt = evtStack[i].toJson ();

// srevel :: ces lignes ne servent plus a rien a cause du escape ajouter plus bas.
//			var aRemplacer = /\%/g;
//			evt = evt.replace(aRemplacer, "%25")

			eventAsJson += evt;
	
			if(i<evtStack.length-1){
				eventAsJson += ",";
			}
		}
		eventAsJson += "]";

		portletContext.eventStack = [];
		comHelper.globalStackSize = 0;
		// use escape(), not encodeURI nor encodeURIComponent of the '?','?'... wont be correctly evaluated 
		// encodeURIComponent is used to get the UTF-8 based char, then we unescape to finally escape the string and evaluate correctly all char
		// TT 735
		var param = {};
		param [SweetDevRia.ComHelper.ID_PAGE] = portletContext.idPage;
		param [SweetDevRia.ComHelper.EVENT_XML_PARAM] = escape(unescape(encodeURIComponent(eventAsJson)));
//		var paramStr = SweetDevRia.ComHelper.ID_PAGE+"="+portletContext.idPage+"&"+SweetDevRia.ComHelper.EVENT_XML_PARAM + "=" + escape(eventAsJson);
	
		if (evt && evt.action != null) {
			param [action] = evt.action;
		}

		/** Ajax call */
		ajax.post (portletContext.proxyUrl, param, synchroCall);
	}
};

/**
 * Call a specific URL, through Ajax, and return the instance used
 * @param {String} url Url to call
 * @param {Object} args Object which contains parameter to send
 * @param {Function} callback the callback function
 * @return the instance used
 * @type XMLHttpRequest
 */
SweetDevRia.ComHelper.call  = function(url, args, callback) {
	var comHelper = SweetDevRia.ComHelper.getInstance ();
	
	var ajax = SweetDevRia.AjaxPooler.getInstance ();

	if (callback) {
		ajax.setCallback (SweetDevRia.ComHelper.callback);
		comHelper.callbackRepository [ajax.id] = callback;
	}

	/** Ajax call */
	return ajax.post (url, args, args[SweetDevRia.Ajax.SYNCHRO_CALL]);
};

/**
 * Call a specific URL, through Ajax, and return the instance used. Do NOT require a JSON response.
 * @param {String} url Url to call
 * @param {Object} args Object which contains parameter to send
 * @param {Function} callback the callback function
 * @param {formMode} prepare parameter for a formular not JSON Communication
 * @return the instance used
 * @type XMLHttpRequest
 */
SweetDevRia.ComHelper.genericCall  = function(url, args, callback, formMode) {
	var comHelper = SweetDevRia.ComHelper.getInstance ();
	
	var ajax = SweetDevRia.AjaxPooler.getInstance ();

	if(callback != null){
		ajax.setCallback (callback);
	}

	/** Ajax call */
	return ajax.post (url, args, args[SweetDevRia.Ajax.SYNCHRO_CALL], formMode);
};
 
 

/**
 * Fires a bunch of events described into a jsonString
 * @param {String} json a Json String containing the events
 * @private
 */
SweetDevRia.ComHelper.fireEvents  = function(json) {
	if (json) {
		var eventsTab;
		
		if (typeof (value) == "string") {
			try{
				eventsTab = JSON.parse(json);
			}catch(e){
				//SweetDevRia.log.error('The JSON server response is not correctly formatted.');
				return;
			}
		}
		else {
			eventsTab = json;
		}
		
		var proxy = SweetDevRiaProxy.getInstance ();
 		for (var i = 0; i < eventsTab.length; i++) {
 			var eventsTabReponses = eventsTab[i];
 			
 			for(var j=0;j < eventsTabReponses.length; ++j){
				var eventMap = eventsTabReponses [j];
	
				var evt = new SweetDevRia.RiaEvent (eventMap["type"],eventMap["idSrc"], eventMap["params"]);
			 	proxy.fireEvent (evt);
			 }
		}
	}
};
					


/**
 * Generic ComHelper callback function
 * @private
 */
SweetDevRia.ComHelper.callback  = function(json) {

	var comHelper = SweetDevRia.ComHelper.getInstance ();

	/** Manage optionnal Javascript invoke */
	SweetDevRia.ComHelper.fireEvents (json);
			
	/** call callbacks */
	var callback = comHelper.callbackRepository [this.id];

	if (callback) {
		callback.call (this);
	}
};

SweetDevRia.ComHelper.callIAction = function(action, params, callback){
	params ["action"] = action;
	params [SweetDevRia.ComHelper.ID_PAGE] = window [SweetDevRia.ComHelper.ID_PAGE];

	return SweetDevRia.ComHelper.genericCall (SweetDevRia.ComHelper.PROXY_URL, params, callback);		
};


SweetDevRia.ComHelper.asyncCallIAction = function(action, params, callback, contextId){
	var callParams = {};
	callParams ["action"] = action;
	callParams [SweetDevRia.ComHelper.ID_PAGE] = window [SweetDevRia.ComHelper.ID_PAGE];
	if( params ){
		callParams ["jsonMap"] = JSON.stringify(params);
	}

	var ajax = SweetDevRia.AjaxPooler.getInstance ();
	ajax.setCallback (callback);
	
	var proxy = SweetDevRia.ComHelper.PROXY_URL;
	
	if( contextId ){
		var context = SweetDevRia.PortletContextManager.getInstance().getContextById(contextId);
		if( context ){
			proxy = context.proxyUrl;
		}
	}
	
	/** Ajax call */
	return ajax.send ("POST", proxy, callParams, true);
};

SweetDevRia.ComHelper.syncCallIAction = function(action, params, contextId){
	return SweetDevRia.ComHelper.synchCallIAction (action, params, contextId);
};

SweetDevRia.ComHelper.synchCallIAction = function(action, params, contextId){

	var callParams = {};
	callParams ["action"] = action;
	callParams [SweetDevRia.ComHelper.ID_PAGE] = window [SweetDevRia.ComHelper.ID_PAGE];
	if( params ){
		callParams ["jsonMap"] = JSON.stringify(params);
	}

	var ajax = SweetDevRia.AjaxPooler.getInstance ();
	
	var proxy = SweetDevRia.ComHelper.PROXY_URL;
	
	if( contextId ){
		var context = SweetDevRia.PortletContextManager.getInstance().getContextById(contextId);
		if( context ){
			proxy = context.proxyUrl;
		}
	}
	
	/** Ajax call */
	return ajax.send ("POST", proxy, callParams, false);
};


 



/**
 * Call an action on the server. This action implements com.ideo.sweetdevria.servlet.IAction
 * @param {String} id the id the action is related to
 * @param {String} action the name of the action
 * @param {Map} params a map of parameters
 * @static
 * @private
 */
SweetDevRia.ComHelper.callAction = function(id, action, params, contextId){
		function addInput(theForm, id, value) {
			var input = document.createElement ("input");
			input.id = id;
			input.name = id;
			input.type = "hidden";
			input.value= value;
			theForm.appendChild (input);
			
			return input;
		}
	
		var form = document.createElement ("form");
		form.action = SweetDevRia.ComHelper.PROXY_URL;
		if( contextId ){
			var context = SweetDevRia.PortletContextManager.getInstance().getContextById(contextId);
			if( context ){
				form.action = context.proxyUrl;
			}
		}		
		form.target="_self";
		form.method="post";
	
		addInput (form, "action", action);
		for (var paramId in params ) {
			addInput (form, paramId, params[paramId]);
		}
		addInput (form, SweetDevRia.ComHelper.ID_PAGE, __RiaPageId);//propagate the page id to retrieve the model in session
		
		document.body.appendChild (form);
		form.submit();
		document.body.removeChild(form);	
};
