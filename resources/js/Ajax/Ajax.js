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
 * Create object DOMParser for browsers who does not have this object (IE and Safari).
 */
if (typeof DOMParser == "undefined") {
   DOMParser = function () {null;};

   DOMParser.prototype.parseFromString = function (str, contentType) {
      if (typeof ActiveXObject != "undefined") {
         var d = getMsXmlObject("DomDocument");
         d.loadXML(str);
         return d;
      } else if (typeof XMLHttpRequest != "undefined") {
         var req = new XMLHttpRequest;
         req.open("GET", "data:" + (contentType || "application/xml") +
                         ";charset=utf-8," + encodeURIComponent(str), false);
         if (req.overrideMimeType) {
            req.overrideMimeType(contentType);
         }
         req.send(null);
         return req.responseXML;
      }
   };
}


//Global URL parameters - SWTRIA-1062
SweetDevRia.defaultAjaxParameters = {};

/**
 * @class Ajax utility class
 * @constructor
 * @private
 */ 
SweetDevRia.Ajax = function(id) {
	this.id = id;

	/** Register */
	SweetDevRia.Ajax.repository [id] = this;

	this.xmlhttp = null;
	this.status = null;
	this.responseText = null;
	this.responseXML = null;
	this.callback = null;
	this.readyState = null;
};

/**
 * Constant defining the synchronization state to send as param
 * @private 
 * @type String
 */ 
SweetDevRia.Ajax.SYNCHRO_CALL = "synchroCall";

SweetDevRia.Ajax.repository = {};


/**
 * Override this function to trigger an action just before an ajax request is sent. To be overridden.
 * @static 
 */ 
SweetDevRia.Ajax.onSendRequest = function(){
	
};

/**
 * Override this function to trigger an action just after an ajax response is received. To be overridden.
 * @static 
 */ 
SweetDevRia.Ajax.onReceiveResponse = function(){
	
};

/**
 * SWTRIA-1062 
 * Return a map of parameters to add to the url of the ajax call
 * @private
 * @static 
 */ 
SweetDevRia.Ajax.getParameters = function() {
    return SweetDevRia.defaultAjaxParameters;
};

/**
 * SWTRIA-1062
 * add a parameter to the url of the ajax call 
 * @private
 * @static 
 */ 
SweetDevRia.Ajax.addParameter = function(_name, _value) {
    if (_name && _value) {
        SweetDevRia.defaultAjaxParameters[_name] = _value;
    }
};

/**
 * Get an Ajax instance from its id 
 * @param {String} id the instance id to get
 * @return an Ajax instance according to the required id
 * @type Ajax
 * @private
 * @static 
 */ 
SweetDevRia.Ajax.getInstance = function (id) {
	return SweetDevRia.Ajax.repository [id];
};


/**
 * Reinitialize the Ajax object
 */
SweetDevRia.Ajax.prototype.reset = function() {
	this.xmlhttp = null;
	this.status = null;
	this.responseText = null;
	this.responseXML = null;
	this.callback = null;
	this.readyState = null;
};

/** 
 * Get Microsoft's XmlHttpRequest
 */
function getMsXmlObject (object) {
	var prefixes = ["MSXML2", "Microsoft", "MSXML", "MSXML3"];
	var xmlHttp;
	for (var i = 0; i < prefixes.length; i++) {
		try {
			// try to create the objects
			xmlHttp = new ActiveXObject(prefixes[i] + "." + object);
			return xmlHttp;
		}
		catch (ex) {
		}
	}
	
	throw new Error("Could not find an installed XML parser");
}

/**
 * Return an XmlHttpRequest object, cross browser support.
 * @type XMLHttpRequest
 * @return an XmlHttpRequest object, cross browser support.
 * @private
 */
SweetDevRia.Ajax_getXmlHttpRequest = function() {
	var xmlhttp = null;

	if (typeof ActiveXObject != "undefined") {
		xmlhttp = getMsXmlObject ("XmlHttp");
	} else {
		xmlhttp = new XMLHttpRequest();
	}

	return xmlhttp;
};

/** 
 * Send an Ajax request
 * @param {String} method "POST" or "GET" method
 * @param {String} url the url to call
 * @param {Array} param the parameters to send to request (will be concatenated to URL)
 * @param {boolean} asynchroCall whether the call must be asynchrone (true) or synchrone (false). default : true.
 * @param {formMode} prepare parameter for a formular not JSON Communication
 * @private
 */
SweetDevRia.Ajax.prototype.send = function(method, url, param, async, formMode) {
	if (async == null) {async = true;}

	/** On construit un objet XmlHttpRequest */
	this.xmlhttp = SweetDevRia.Ajax_getXmlHttpRequest ();

	// SWTRIA-1062 : Add default Ajax params
	var defaultAjaxParam = SweetDevRia.Ajax.getParameters();	

    if (defaultAjaxParam != null) {
        for (var key in defaultAjaxParam) {
            param[key] = defaultAjaxParam[key];
        }
    }

    this.xmlhttp.open(method,url, async);

	this.xmlhttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');

	if (async) { // SWTRIA-991
	this.xmlhttp.onreadystatechange =  
		new Function ("SweetDevRia.Ajax.getInstance (\""+this.id+"\").bindCallback();");
	}	

	SweetDevRia.Ajax.onSendRequest();
	
	param = SweetDevRia.Ajax.prepareParams (param, formMode);
    
	this.xmlhttp.send(param);

    if (! async) { // si appel synchrone, le onreadystatechange n est pas execute.
//		SweetDevRia.Ajax.onReceiveResponse();

    	if (this.callback) {
		    if (this.xmlhttp.responseText) {
				var resultStr = this.xmlhttp.responseText;
				try{
					var result = JSON.parse(resultStr);
					this.callback (result);
				}catch(ex){ //Firefox error
					this.callback ();
				}		
			}
		    else {
				this.callback ();
		    }
		}
		else {
		    if (this.xmlhttp.responseText) {
				var resultStr = this.xmlhttp.responseText;

				try{
					this.free = true;
					return JSON.parse(resultStr);
				}catch(ex){ //Firefox error
				}		
			}
		}
		
		this.free = true;
    }
    
    return this.xmlhttp;
};

/**
*
*  URL encode / decode
*  http://www.webtoolkit.info/
*
**/
 
var Url = {
 
	// public method for url encoding
	encode : function (string) {
		//return escape(this._utf8_encode(string));
		return this._utf8_encode(string);
	},
 
	// public method for url decoding
	decode : function (string) {
		return this._utf8_decode(unescape(string));
	},
 
	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 
		for (var n = 0; n < string.length; n++) {
 
			var c = string.charCodeAt(n);
 
			if (c < 128) {
				utftext += string.charAt(n);
			}
			/*
			else{
				
				utftext += "\\"+"u0"+c.toString(16);
			}*/
			
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 			
		}
		return utftext;
	},
 
	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
 
		while ( i < utftext.length ) {
 
			c = utftext.charCodeAt(i);
 
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
 
		}
 
		return string;
	}
 
};

/**
 * Convert a parameterMap to a String to be send by Ajax
 * @param {Map} map the parameter map to convert to string  
 * @param {formMode} prepare parameter for a formular not JSON Communication
 * @return the parameter string corresponding to the map
 * @type String
 * @private
 */
SweetDevRia.Ajax.prepareParams  = function(map, formMode) {
	var argsStr = "";
	var first = true;
	function addArg(paramKey, paramValue) {
		if (!formMode || (paramValue && paramValue != null)) {
			argsStr +=(first)?"":"&";
			argsStr += 	encodeURIComponent(paramKey) + "=" + encodeURIComponent(paramValue);
			first = false;
		}
	}
	
	/** Set parameters */
	if (typeof(args) == "string") {
		argsStr = map;
	}
	else {
		for (var i in map) {
			if (i != SweetDevRia.Ajax.SYNCHRO_CALL) {
				// DO NOT USE escape (escape use ISO-8859-1 encoding) !			
				// encode (which is similar to native javascript 1.5 function encoreURIComponent)
				// may be avoided... 
				var value = map[i];
				if (formMode && value && value.length && value.push) {
					for (p = 0; p < value.length; p++) {
						addArg(i, value [p]);
					}
				} else {
					addArg(i, map [i]);
				}
			}
		}	
	}

	return argsStr;
};

/** 
 * Send a POST Ajax request
 * @param {String} request URL
 * @param {String} parameters to send to request (will be concatenated to URL)
 * @param {boolean} synchroCall True for a synchrone server call, else false
 * @param {formMode} prepare parameter for a formular not JSON Communication
 */
SweetDevRia.Ajax.prototype.post = function(url, param, synchroCall, formMode) {
	//SWTRIA-1222
	//attention les parametres sont inverses
	var async;
	if(synchroCall != undefined){
		async = !synchroCall;
	}
	
	return this.send ("POST", url, param, async, formMode);
};

/** 
 * Send a GET Ajax request
 * @param {String} request URL
 * @param {boolean} synchroCall True for a synchrone server call, else false
 * @param {formMode} prepare parameter for a formular not JSON Communication
 */
SweetDevRia.Ajax.prototype.get = function(url, synchroCall, formMode) {
	//SWTRIA-1222
	//attention les parametres sont inverses
	var async;
	if(synchroCall != undefined){
		async = !synchroCall;
	}
	
	return this.send ("GET", url, "", async);
};

/**
 * Add a header field to the Ajax object requester
 * @param {String} field name
 * @param {String} field value
 */
SweetDevRia.Ajax.prototype.setRequestHeader = function(name, value) {
	if (this.xmlhttp) {
		this.xmlhttp.setRequestHeader(name, value);
	}
};

/**
 * Get the text request's response
 * @type String
 * @return the response text for this Ajax object
 */
SweetDevRia.Ajax.prototype.getResponseText = function() {
	return this.responseText;
};

/**
 * Get the XML request's response
 * @type String
 * @return the response XML for this Ajax object
 */
SweetDevRia.Ajax.prototype.getResponseXML = function() {
	return this.responseXML;
};

/**
 * Return the status of the request
 * @type int
 * @return the status of the request 
 */
SweetDevRia.Ajax.prototype.getStatus = function() {
	return this.status;
};

/**
 * Set the function to call when response is coming back
 * @param {Function} callback JavaScript function to execute when response is coming back
 */
SweetDevRia.Ajax.prototype.setCallback = function(callback) {
	this.callback = callback;

	var comHelper = SweetDevRia.ComHelper.getInstance ();
	comHelper.callbackRepository [this.id] = callback;

};

/**
 * Get the callback function
 * @return {Function} callback function
 */
SweetDevRia.Ajax.prototype.getCallback = function() {
	return this.callback;
};

/**
 * Get the state of the request
 * @return {int} ready state
 */
SweetDevRia.Ajax.prototype.getReadyState = function() {
	return this.readyState;
};


/**
 * Generic callback
 * Call onServerUnreachable() on server error.
 * @private
 */
SweetDevRia.Ajax.prototype.bindCallback = function() {
	if (this.xmlhttp) {
		this.readyState = this.xmlhttp.readyState;
		if (this.readyState == 4) {
			this.responseText = this.xmlhttp.responseText;
			this.responseXML = this.xmlhttp.responseXML;

			SweetDevRia.Ajax.onReceiveResponse();
			
			try{
				this.status = this.xmlhttp.status;
			}catch(ex){ //Firefox error
				this.onServerUnreachable(ex);
				return;
			}
			
			if((this.status == 401) || (this.status == 400)){
				this.onSessionTimeout(this.responseText);
				return;
			}
			
			if( this.status == 12002 || //timeout  
				this.status == 12029 ||//Dropped connection 
				this.status == 12030 ||//Dropped connection 
				this.status == 12031 ||//Dropped connection 
				this.status == 12152){ //Connection closed by server
					this.onServerUnreachable(null, this.status);
					return;
			} 

			if (this.callback) {
			    if (this.responseText) {
					var resultStr = this.responseText;
					try{
						var result = JSON.parse(resultStr);
						this.callback (result);
					}catch(ex){ //Firefox error
						this.callback ();
					}		
				}
			    else {
					this.callback ();
			    }
			}
			
			this.free = true;
		}
	}
};


/**
 * Function called if the server cannot be reached
 * @param {Exception} ex the JavaScript native exception caught (Firefox)
 * @param {int} errorCode the error code (Internet Explorer)
 * @see http://groups.google.com/group/prototype-core/msg/3e0fe68dd1da9c1e
 */
SweetDevRia.Ajax.prototype.onServerUnreachable = function(ex, errorCode) {
	SweetDevRia.log.error("The server is not responding. Exception thrown : "+ex+". Error Code : "+errorCode);
};

/**
 * Function called if the user's server session has timeouted or is not valid anymore
 * @param {String} message the message sent by the server. This message is formatted as an HTML one, displaying a 401 http error. Displayable into an alert or window. 
 */
SweetDevRia.Ajax.prototype.onSessionTimeout = function(message) {
	SweetDevRia.log.error(''+message);
};



