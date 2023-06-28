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
* This is the Context component class
* Singleton managing the contexts in the page, as a stack 
* @constructor
* @private
*/
SweetDevRia.ContextManager = function(){
	if(SweetDevRia.ContextManager.instance != null){
		throw("Cannot instanciate the SweetDevRia.ContextManager object. This singleton has already been created.");
	}
	this.stack = [];
};

SweetDevRia.ContextManager.instance = null;

/**
* Return the singleton instance
* @type Context
* @return the singletong instance
*/
SweetDevRia.ContextManager.getInstance = function(){
	if(SweetDevRia.ContextManager.instance == null){
		SweetDevRia.ContextManager.instance = new SweetDevRia.ContextManager();
	}
	return SweetDevRia.ContextManager.instance;
};

/**
* Push a new context in the stack and set it as the current one in use 
* @param {String} contextId the context id to push
*/
SweetDevRia.ContextManager.prototype.pushContext = function(contextId){
	this.stack.push(contextId);
};

/**
* Pop the last pushed context from the stack  
* @param {String} contextId Optional, the context id to pop. If this parameter is specified, an error is logged to avoid a mistake, and nothing is performed. This parameter is used as an error detector. 
*/
SweetDevRia.ContextManager.prototype.popContext = function(contextId){ 
	// last context running
	context = this.stack[this.stack.length-1];
	if(contextId && context != contextId){
		SweetDevRia.log.error("Popped context doesnt correspond to the required one");
		return;
	}
	this.stack.pop();
};

/**
* Return the active context id
* @type String 
* @return the active context id
*/
SweetDevRia.ContextManager.prototype.getActiveContext = function(){
	if(this.stack.length == 0){
		return __RiaPageId;
	}
	return this.stack[this.stack.length-1];
};

SweetDevRia.PortletContext = function(id,contextId){
	this.id = id;
	this.contextId = (contextId?contextId:id);
	if(window.PTIncluder && PTPortlet.getPortletByID(id) ) { 
		this.proxyUrl = PTPortlet.getPortletByID(id).transformURL(SweetDevRIAPath + "/RiaController");
		this.contextPath = PTPortlet.getPortletByID(id).transformURL(SweetDevRIAPath);
	}else{
		this.proxyUrl = SweetDevRIAPath + "/RiaController";
		this.contextPath = SweetDevRIAPath;
	}
	this.idPage = __RiaPageId;
	this.eventStack = [];
};

SweetDevRia.PortletContextManager = function(){
	if(SweetDevRia.PortletContextManager.instance != null){
		throw("Cannot instanciate the SweetDevRia.PortletContextManager object. This singleton has already been created.");
	}
	this.repository = [];
	this.registerContext(new SweetDevRia.PortletContext(__RiaPageId));//default context : the global page id
};

SweetDevRia.PortletContextManager.instance = null;

/**
* Return the singleton instance
* @type Context
* @return the singletong instance
*/
SweetDevRia.PortletContextManager.getInstance = function(){
	if(SweetDevRia.PortletContextManager.instance == null){
		SweetDevRia.PortletContextManager.instance = new SweetDevRia.PortletContextManager();
	}
	return SweetDevRia.PortletContextManager.instance;
};

SweetDevRia.PortletContextManager.prototype.registerContext = function(ctx){
	this.repository.push(ctx);
};

SweetDevRia.PortletContextManager.prototype.getContexts = function(){
	return this.repository;
};

SweetDevRia.PortletContextManager.prototype.unregisterContext = function(ctxId){
	for(var i=0;i<this.repository.length;++i){
		if(this.repository[i].id==ctxId){
			this.repository.remove(this.repository[i]);
			return;
		}
	}
};

SweetDevRia.PortletContextManager.prototype.getContextByPt = function(ctxId){
	for(var i=0;i<this.repository.length;++i){
		if(this.repository[i].id==ctxId){
			return this.repository[i];
		}
	}
	return null;
};

SweetDevRia.PortletContextManager.prototype.getContextById = function(ctxId){
	for(var i=0;i<this.repository.length;++i){
		if(this.repository[i].contextId==ctxId){
			return this.repository[i];
		}
	}
	
	if(SweetDevRia.$(ctxId)){
		return this.getContextById(SweetDevRia.$(ctxId).contextId);
	}
	
	return null;
};

SweetDevRia.PortletContextManager.prototype.getActiveContext = function(){
	return this.repository[this.repository.length-1];
};