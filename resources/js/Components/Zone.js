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
 * @class
 * RIA Zone
 * @constructor
 * @param {String}	id				The id of the zone element defined in the page
 * @param {boolean}	loadAtStartup	Whether the zone will be initiated loaded or not
 * @param {String}	url				The url of this zone. undefined for none (body content).
 * @param {int}		refreshDelay	The delay of refresh of this zone, in millis. 0 for no refresh delay.
 * @param {String}	addInputs	A list of comma separated input name to submit.
 */
SweetDevRia.Zone = function(id,loadAtStartup, url, refreshDelay, addInputs){
	superClass (this, SweetDevRia.RiaComponent, id, "SweetDevRia.Zone");
	this.id = id;
	this.loadAtStartup = loadAtStartup;
	this.url = url;
	this.refreshDelay = refreshDelay;
	this.addInputs = addInputs;
	this.timeout = undefined;
};



SweetDevRia.Zone.prototype.initialize = function(){
	if(this.refreshDelay != 0){
		SweetDevRia.Zone.launchTimer( this );
	}
	if (this.initialRedirectURL) {
		this.zoneRedirect(this.initialRedirectURL);
	}	
	
	this.pageUrl = window.location.href;
};
	


extendsClass(SweetDevRia.Zone, SweetDevRia.RiaComponent);

/**
 * This event type is fire when the zone is refreshed
 * @static
 */
SweetDevRia.Zone.REFRESH_EVENT = "refresh"; 

/**
 * This event type is fire when the zone is redirected
 * @static
 */
SweetDevRia.Zone.REDIRECT_EVENT = "redirect"; 


/**
 * Public APIS
 */

/**
 * This method is called before processing a call to the server for this zone content
 * To be overridden !!
 * @param {String} newUrl	an optional new url to set on the zone
* @param {Map} params parameter map to send to server, optional
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Zone.prototype.beforeCallServer = function(newUrl, params){ return true; };  

/**
 * This method is called after having processed a call to the server for this zone content
 * To be overridden !!
 * @param {String} newUrl	an optional new url to set on the zone
* @param {Map} params parameter map to send to server, optional
 */
SweetDevRia.Zone.prototype.afterCallServer  = function(newUrl, params){  /* override this */ };

/**
 * This method is called before processing a redirect to the server for this zone content
 * To be overridden !!
 * @param {String} newUrl	an optional new url for redirection
 * @param {Map} params parameter map to send to server, optional
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Zone.prototype.beforeZoneRedirect = function(newUrl, params){ return true; };  

/**
 * This method is called after having processed a redirect to the server for this zone content
 * To be overridden !!
 * @param {String} newUrl	an optional new url for redirection
 * @param {Map} params parameter map to send to server, optional
 */
SweetDevRia.Zone.prototype.afterZoneRedirect  = function(newUrl, params){  /* override this */ };


/**
 * This method is called before processing the server response
 * To be overridden !!
 * @param {RiaEvent} evt Event containing the new zone content 
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Zone.prototype.beforeOnCallServer = function(evt){ return true; };  

/**
 * This method is called after processing the server response
 * @param {RiaEvent} evt Event containing the new zone content 
 * To be overridden !!
 */
SweetDevRia.Zone.prototype.afterOnCallServer  = function(evt){  /* override this */ };

/**
 * This method is called before processing the server redirection demand
 * To be overridden !!
 * @param {RiaEvent} evt Event containing the redirection demand 
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Zone.prototype.beforeOnZoneRedirect = function(evt){ return true; };  

/**
 * This method is called after processing the server redirection demand
 * @param {RiaEvent} evt Event containing the redirection demand 
 * To be overridden !!
 */
SweetDevRia.Zone.prototype.afterOnZoneRedirect  = function(evt){  /* override this */ };

/**
 * This method is called after zone be loaded
 * To be overridden !!
 */
SweetDevRia.Zone.prototype.onLoaded = function(){};

/**
* Launch a timer for the specified zone
* @param {Zone} zone 	the zone to start a timer on. 
* @static
*/
SweetDevRia.Zone.launchTimer = function(zone){
	zone.timeout = window.setTimeout( "SweetDevRia.Zone.timerRefresh('"+zone.id+"');", zone.refreshDelay ); 
};

/**
* Function automatically called when the delay ends to trigger the server call.
* @private
* @static
*/
SweetDevRia.Zone.timerRefresh = function(zoneId){
	SweetDevRia.getComponent(zoneId).callServer();
};

/**
* Cancel the timer on the zone
*/
SweetDevRia.Zone.prototype.cancelTimer = function(){
	if(this.timeout != undefined){
		window.clearTimeout(this.timeout);
	}
	this.timeout = undefined;
};
/**
* Starts the timer on the zone
*/
SweetDevRia.Zone.prototype.restartTimer = function(){
	if(this.timeout == undefined){
		SweetDevRia.Zone.launchTimer(this);
	}
};

/**
* Changes the url of the zone
* Do NOT reload the zone
* @param {String} url	the new url targetted by the zone 
*/
SweetDevRia.Zone.prototype.setUrl = function(url){
	this.url = url;
	SweetDevRia.ComHelper.stackEvent (new SweetDevRia.RiaEvent ("updateUrl", this.id, {"url":this.url}));
};

/**
* Returns the url of the zone
* @return 	the url targetted by the zone
* @type		{String}
*/
SweetDevRia.Zone.prototype.getUrl = function(){
	return this.url;
};

/**
* Changes the refresh delay of the zone
* Do NOT launch the timer
* @param {int} newDelay		the new refresh delay of the zone
*/
SweetDevRia.Zone.prototype.setRefreshDelay = function(newDelay){
	this.refreshDelay = newDelay;
	SweetDevRia.ComHelper.stackEvent (new SweetDevRia.RiaEvent ("updateDelay", this.id, {"delay":this.refreshDelay}));
};

/**
* Returns the refresh delay of the zone
* @return 	the refresh delay of the zone
* @type		{int}
*/
SweetDevRia.Zone.prototype.getRefreshDelay = function(){
	return this.refreshDelay ;
};


/**
* Set a list of inputs name to submit
* @param {String} addInputs	the list of inputs name to submit, comma separated
*/
SweetDevRia.Zone.prototype.setAddInputs = function(addInputs){
	this.addInputs = addInputs;
};

/**
* Returns the submit inputs name sent additionally to the request, comma separated
* @return the submit inputs name sent additionally to the request, comma separated
* @type	{String}
*/
SweetDevRia.Zone.prototype.getAddInputs = function(){
	return this.addInputs ;
};


/**
* Refresh multiple zones
* @param {String} zones	Comma separated ids of the zones to refresh
*/
SweetDevRia.Zone.refreshZones = function(zones){
	if(!zones){
		throw("NullPointerException : The refreshZones function has been called without parameters!");
	}

	var zoneArray = zones.split(",");
	for(var i=0;i<zoneArray.length;++i){
		if(SweetDevRia.$(zoneArray[i])){
			SweetDevRia.$(zoneArray[i]).callServer(null, null, true);
		}else{
			SweetDevRia.log.warn("The zone id :"+zoneArray[i]+" cannot be refreshed, it has not be found in the current page.");
		}
	}
	SweetDevRia.ComHelper.fireEvent ();
};

/**
* Call the server
* @param {String} newUrl	an optional new url to set on the zone
* @param {Map} paramsMap	parameter map of key/value to send to server, optional.
* @param {boolean} stack	boolean indicating whether the server request must be stacked (not processed right away). Optional.
*/
SweetDevRia.Zone.prototype.callServer = function(newUrl, paramsMap, stack){		

	if(this.beforeCallServer(newUrl, paramsMap)){
	
		if(newUrl != undefined){
			this.url = newUrl;
		}
		
		if(!document.getElementById(this.id)){
			throw new Error("This zone no longer exists in the page :"+this.id);
		}
		
		var params = {};
		params ["url"] = this.url;
		if(this.contextId!=__RiaPageId){
			params ["contextId"] = this.contextId;
		}
		
	    if (this.pageUrl != null && this.pageUrl != '') {
	        params ["pageUrl"] = this.pageUrl;
	    }
		
		var customParams = "";
		
		var inputParams = this.formatInputParams();
		var mapParams = this.formatMapParams(paramsMap);
		
		if(inputParams != "" && mapParams != null){
			customParams = inputParams + '!&!' + mapParams;//@see formatInputParams
		}else{
			if(inputParams != ""){
				customParams = inputParams;
			}else if(mapParams != ""){
				customParams = mapParams;
			}
		}
		
		params ["customParams"] = customParams;
		
		if(!stack){
			SweetDevRia.ComHelper.fireEvent (new SweetDevRia.RiaEvent ("callServer", this.id, params));
		}else{
			SweetDevRia.ComHelper.stackEvent (new SweetDevRia.RiaEvent ("callServer", this.id, params));
		}
		
		this.afterCallServer(newUrl, paramsMap);
	}
	
};


/**
 * Zone redirection : The content of URL will be feeded by the url urlRedirection
 * @param {urlRedirection} The url containing the new zone content 
 */
SweetDevRia.Zone.prototype.zoneRedirect = function(urlRedirection, paramsMap, stack) {
	if(this.beforeZoneRedirect(urlRedirection, paramsMap)){

		if(!document.getElementById(this.id)){
			throw new Error("This zone no longer exists in the page :"+this.id);
		}
		
		var params = {};
		params ["url"] = urlRedirection;
		if(this.contextId!=__RiaPageId){
			params ["contextId"] = this.contextId;
		}
				 
		var customParams = "";
		
		var inputParams = this.formatInputParams();
		var mapParams = this.formatMapParams(paramsMap);
		
		if(inputParams != "" && mapParams != null){
			customParams = inputParams + '!&!' + mapParams;//@see formatInputParams
		}else{
			if(inputParams != ""){
				customParams = inputParams;
			}else if(mapParams != ""){
				customParams = mapParams;
			}
		}
		
		params ["customParams"] = customParams;	
		
		if(!stack){
			SweetDevRia.ComHelper.fireEvent (new SweetDevRia.RiaEvent ("zoneRedirect", this.id, params));
		}else{
			SweetDevRia.ComHelper.stackEvent (new SweetDevRia.RiaEvent ("zoneRedirect", this.id, params));
		}
		
		this.fireEventListener (SweetDevRia.Zone.REDIRECT_EVENT);
		
		this.afterZoneRedirect(urlRedirection, paramsMap);
	}
};

/**
* Callback method for a zone refresh
* @param {RiaEvent} evt Event containing the new zone content 
* @private
*/
SweetDevRia.Zone.prototype.onCallServer = function(evt) {

	if(this.beforeOnCallServer(evt)){
		this.garbageCollector(); // delete old components inside this zone
		this.setAsContext();
		
		//Hack pour executer les balise JS sous ie
		if(browser.isIE && evt.data.indexOf("<body")==-1){
			evt.data = "<body>"+evt.data+"</body>";
		}
		
		document.getElementById(this.id).innerHTML = evt.data;
		SweetDevRia_Zone_evalJS( document.getElementById(this.id) );
		
		this.cancelAsContext();
		
		SweetDevRia.init ();
		
		this.fireEventListener (SweetDevRia.Zone.REFRESH_EVENT);

		this.afterOnCallServer(evt);
		
		if(this.refreshDelay != 0){
			SweetDevRia.Zone.launchTimer( this );
		}
	}
	//TODO quoi quand l'id de la zone n'existe pas ?
	return true;
};

/**
 * Event called after a zone refresh if server ask for a redirection
 */
SweetDevRia.Zone.prototype.onZoneRedirect = function(evt) {

	if(this.beforeOnZoneRedirect(evt)){
		var urlRedirection = evt.redirect;		
		this.zoneRedirect(urlRedirection);
		this.afterOnZoneRedirect(evt);
	} 
	
	return true;
};

/**
* Return the context id for this zone
* @type String
* @return the context id for this zone
*/
SweetDevRia.Zone.prototype.getContextId = function(){
	return this.id;
};

/**
* Set this zone context as the current one
* @private
*/
SweetDevRia.Zone.prototype.setAsContext = function(){
	SweetDevRia.ContextManager.getInstance().pushContext(this.getContextId());
};


/**
* Cancel this zone context as the current one
* @private
*/
SweetDevRia.Zone.prototype.cancelAsContext = function(){
	SweetDevRia.ContextManager.getInstance().popContext(this.getContextId());
};


/**
* Format the URL according to the addInputs value
* @type String
* @return the url params formatted with the addInputs parameters (key=value&key=value)
* @private
*/
SweetDevRia.Zone.prototype.formatInputParams = function(){
	if(this.addInputs == null || this.addInputs == ""){
		return "";
	}
	var params = "";
	var nextSeparator = '';
 	var inputs = this.addInputs.split(",");
 	for(var i=0;i<inputs.length;++i){
 		if(SweetDevRia.Form.getValue(inputs[i]) && SweetDevRia.Form.getValue(inputs[i])!=''){
 			//these tags '!=!' are used to retrieve which = have to be decode and keep safe
 			//@see ZoneModel.java#onCallServer
			params = params+nextSeparator+inputs[i]+'!=!'+SweetDevRia.Form.getValue(inputs[i]);
			nextSeparator = '!&!';
		}
	}
	return params;
};	

/**
* Format the URL according to the map parameters
* @param {Map} map 	the map to format the key/value
* @type String
* @return the url params formatted with the map parameters (key=value&key=value)
* @private
*/
SweetDevRia.Zone.prototype.formatMapParams = function(map){
	if(map == null){
		return "";
	}
	var params = "";
	var nextSeparator = '';
	
	for(var key in map){
		if(key != 'toJSONString'){
			params = params+nextSeparator+key+'!=!'+map[key];
			nextSeparator = '!&!';
		}
	}
	return params;
};	

/**
* Destroy a zone and free all of its resources
* @private
*/
SweetDevRia.Zone.prototype.destroy = function(){
	this.cancelTimer();
	this.garbageCollector();
};

/**
* Evaluates the javascript of a zone on a server callback
* @private
* @static
*/
function SweetDevRia_Zone_evalJS(zone){
	var scripts = zone.getElementsByTagName("script");
	var strExec;
	var bSaf = (navigator.userAgent.indexOf('Safari') != -1);
	var bOpera = (navigator.userAgent.indexOf('Opera') != -1);
	var bMoz = (navigator.appName == 'Netscape');
	for(var i=0; i<scripts.length; i++){
	    if (bSaf) {
	      strExec = scripts[i].innerHTML;
	    }
	    else if (bOpera) {
	      strExec = scripts[i].text;
	    }
	    else if (bMoz) {
	      strExec = scripts[i].textContent;
	    }
	    else {
	      strExec = scripts[i].text;
	    }
	    
	    strExec = strExec.replace('<!--','');
		strExec = strExec.replace('-->','');
	    
	    if(window.execScript){ 
	    	//bug fix
			window.execScript(strExec);
       	}
        else{
          	try {
		      	window.eval(strExec);
		    } catch(e) {
		      	throw "Script evaluation failed :\n"+strExec;
		    }
       	}
	    
	}
}

/**
* Free every resource contained in the zone.
* Called at the begining of a zone refresh. (free nested components)
* @private
*/
SweetDevRia.Zone.prototype.garbageCollector = function (){
	SweetDevRia.unregisterContext(this.getContextId());
};

