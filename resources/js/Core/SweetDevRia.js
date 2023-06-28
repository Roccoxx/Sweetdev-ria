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
 
window.RIA_ACTIVE_LOG;
SweetDevRia.LOG_ACTION;

function initLogBench() {  
    var action = "com.ideo.sweetdevria.servlet.SendParameterLogBench";
    var result = SweetDevRia.ComHelper.synchCallIAction (action);
	SweetDevRia.LOG_ACTION = result.data["SweetDevRia_LOG_ACTION"];
	window.RIA_ACTIVE_LOG  = result.data["window_RIA_ACTIVE_LOG"];
}

/**
 * extends the classes passed as parameter,
 * need to call superClass in the constructor of childClass
 * @param childClass  the child class
 * @param arguments (others params) all the classes to extends
 */
function extendsClass (childClass) {
  var parents = arguments;
  for (var i = 1; i < parents.length; i++) {
    var parentClass = parents [i];
    var tmp = new parentClass;
    for (var j in tmp) {
      childClass.prototype [j] = tmp [j];
    }
  }
}

/**
 * call the constructor of the parent class extended,
 * need a static call of extendsClass
 * @param child  the current instance (this)
 * @param parentClass the parent class
 * @param arguments (others params) 
 */
function superClass (child, parentClass) {
	var args = [];
	for (var i = 2; i < arguments.length; i++) {
		args [args.length] = arguments [i];
	}
	
	child.base = parentClass;
	  
	child.base.apply ( child, args);
}

/**
 * extends parentClass and call the constructor of the parent class
 * @param child  the current instance (this)
 * @param childClass  the child class
 * @param parentClass  the parent class to extends
 */
function superExtendClass (child, childClass, parentClass) {
    var tmp = new parentClass;
    for (var j in tmp) {
    	childClass.prototype [j] = tmp [j];
    }

	child.base = parentClass;
	child.base.apply (child);
}

SweetDevRia.get = SweetDevRia_get;
SweetDevRia.set = SweetDevRia_set;
SweetDevRia.register = SweetDevRia_register;
SweetDevRia.unregister = SweetDevRia_unregister;
SweetDevRia.getComponent = SweetDevRia_getComponent;
SweetDevRia.getUrlParams = SweetDevRia_getUrlParams;
SweetDevRia.addUrlParam = SweetDevRia_addUrlParam;
SweetDevRia.unregisterContext = SweetDevRia_unregisterContext;

SweetDevRia.setToContext = SweetDevRia_setToContext;
SweetDevRia.removeFromContext = SweetDevRia_removeFromContext;

SweetDevRia.getInstances = SweetDevRia_getInstances;
SweetDevRia.setInstance = SweetDevRia_setInstance;
SweetDevRia.remove = SweetDevRia_remove;
SweetDevRia.removeInstance = SweetDevRia_removeInstance;
SweetDevRia.size = SweetDevRia_size;

SweetDevRia.dp = SweetDevRia_displayProperties;

if(SweetDevRia._instance == null){//JUM : allow double resourcesImport inclusion TT 383
	SweetDevRia._instance = new SweetDevRia();
}

SweetDevRia.getInstance = function () {
	return SweetDevRia._instance;
};

/**
  * Available values for log levels :
  *		_ Log.DEBUG
  *		_ Log.INFO
  *		_ Log.ERROR
  *		_ Log.FATAL
  *		_ Log.WARN
  *		_ Log.NONE
  * Available values for display :
  *		_ Log.popupLogger : shows logs on a popup.
  *		_ Log.consoleLogger : show logs in javascript console.
  *
  */
SweetDevRia.log = new SweetDevRiaLog(Log.NONE, Log.consoleLogger);
SweetDevRia.errorLog = new SweetDevRiaLog(Log.NONE, Log.consoleLogger);

SweetDevRia.CONTAINER_SUFFIXE = "_container";
SweetDevRia.COMPONENTS_REPOSITORY = "componentsRepository";
SweetDevRia.CLASSNAME_SUFFIXE = "_Instances";
SweetDevRia.CONTEXT_SUFFIXE = "_Context";
 
SweetDevRia.SYNCHRO_EVENTS = null;
SweetDevRia.SYNCHRO_DELAY = null;
SweetDevRia.SYNCHRO_DEFAULT = "default"; 

SweetDevRia.SYNCHRO_DELAY_TIMER = null;

SweetDevRia.VERSION = "3.5.2.1";

/**
 * @see SweetDevRia_getComponent(componentId)
 */  
SweetDevRia.$= function (id){return SweetDevRia.getComponent(id);};

SweetDevRia.riaComponentParentIds=  [];

//repository of all the component waiting for an initialization
SweetDevRia.toInitialize = [];

SweetDevRia.toInit = true;
SweetDevRia.isInit = false;
SweetDevRia.container = null;

// On est ds une iframe
// Permet ss firefox, de linker les inits ds le bon ordre !
SweetDevRia.parentWin = window.parent; 

try {
	// Verification d'appel cross site.
	var parentLoc = SweetDevRia.parentWin.location;
}
catch(err) {
	// Cas d'iframe cross site.
	SweetDevRia.parentWin = window;
}	
if (window.parent && window != window.parent) {
	
	for (var i = 0; i < SweetDevRia.parentWin.frames.length; i++) {
		var frame = SweetDevRia.parentWin.frames [i];
		try {
			if (frame.location == document.location) {
				var parentComponentId = frame.name;
			
				if (parentComponentId.indexOf("_panel") >0 &&  (parentComponentId.lastIndexOf("_panel") + "_panel".length - parentComponentId.length) == 0) {
					parentComponentId = name.substring (0, "_panel".length);
					
					SweetDevRia.container = SweetDevRia.parentWin.SweetDevRia.$ (parentComponentId);
	
					SweetDevRia.toInit = SweetDevRia.parentWin.SweetDevRia.isInit;
				}
			}
		} catch(err) {
			// XSS error
			// Do nothing
		}
	}
}

/** 
 * Init function triggered on the window onload
 * @static
 */
SweetDevRia.init = function () {

	if (this.toInit) {
		this.initCompNotInitialized ();

		this.isInit = true;
	}
	else if (SweetDevRia.container) {
		SweetDevRia.container.reload = true;
	}

	if(SweetDevRIASynchro==SweetDevRia.SYNCHRO_DEFAULT){
		return;
	}
	if(SweetDevRIASynchro.indexOf('e')!=-1){
		SweetDevRia.SYNCHRO_EVENTS = parseInt(SweetDevRIASynchro.substring(0, SweetDevRIASynchro.length-1), 10);
	}else if(SweetDevRIASynchro.indexOf('s')!=-1){
		SweetDevRia.SYNCHRO_DELAY = parseInt(SweetDevRIASynchro.substring(0, SweetDevRIASynchro.length-1), 10)*1000;
	}else{
		throw("Malformed synchro propriety :"+SweetDevRIASynchro);
	}

	if(SweetDevRia.SYNCHRO_DELAY != null){
		SweetDevRia.SYNCHRO_DELAY_TIMER = window.setInterval("SweetDevRia.ComHelper.fireEvent()", SweetDevRia.SYNCHRO_DELAY);
	}
};



/**
 * To active render and initialize logs, you must set this constant like this in your jsp page
 * 				window.RIA_ACTIVE_LOG = true;
 */
SweetDevRia.startLog  = function (key, comp, logType) {
	var myId;
	if (logType == null)  {
		logType = RiaTimer.LAST;
	}

	if (window.RIA_ACTIVE_LOG) {
		
		if (! SweetDevRia.logs) {
			SweetDevRia.logs = {};
		}
			
		if(comp != null) {
			myId=comp.id;
			if (! SweetDevRia.logs[myId]) {
				SweetDevRia.logs[myId] = [comp.className, null, null];
			}
		}

		startTimer (key, logType);				
	}	
};


/**
 * @param key {string} example : "Log.Render"
 * @param comp {RiaComponent}
 * @param index {int} ???
 **/
SweetDevRia.endLog  = function (key, comp, index) {

	if (window.RIA_ACTIVE_LOG) {
		
		
		
		endTimer (key);
		
		if(comp==null ) {
			SweetDevRia.logs [key] =  getTimer (key).display();
		
		}
		else{
			if(key=="Log.BeforeGrid"){
				SweetDevRia.logs [key] =  getTimer (key).display();
			}
			else{
				SweetDevRia.logs [comp.id] [index] =  getTimer (key).display();
			}
		}
	}
};

// this constant must be defined like SweetDevRia.LOG_ACTION = "com.ideo.sweetdevria.example.action.TestIAction3";
SweetDevRia.sendLogs  = function () {

	if (window.RIA_ACTIVE_LOG) {
	
	
		// recuperation du temps de chargement des ressources
		SweetDevRia.logs ["Log.Resources"] = RIA_RESOURCES_END - RIA_RESOURCES_START;
		
		// recuperation du temps global de la page 
		SweetDevRia.logs ["Log.Global"] = window.RIA_GLOBAL_END - RIA_GLOBAL_START;
		

		if (SweetDevRia.LOG_ACTION) {
			SweetDevRia.ComHelper.asyncCallIAction (SweetDevRia.LOG_ACTION, {"logs" : SweetDevRia.logs , "navigator":navigator.appCodeName+navigator.userAgent });
		}	
		else {
			alert(SweetDevRia.dp (SweetDevRia.logs));
		}
	}	
};

/** 
 * Initializes all the SweetDEv RIA component in the page, even after a page load
 * @static
 */
SweetDevRia.initCompNotInitialized = function () {
	var proxy = SweetDevRiaProxy.getInstance();
	var evt = new this.RiaEvent(this.RiaEvent.INIT_TYPE, proxy.id);

	if (this.toInitialize) {
		while(this.toInitialize.length > 0){
			var id = this.toInitialize[0];
			
			do{null;}while(this.toInitialize.remove(id));//avoid multiple initializations
			
			var comp = this.getComponent (id);
			if (comp && comp.isInitialized != true) {
				SweetDevRia.startLog ("Log.InitComp_"+id, comp);
				
				proxy.sendEvent (comp, evt);
				
				SweetDevRia.endLog ("Log.InitComp_"+id, comp, 2);
			}
		}
	}
};


/**
 * Register a new component in the repository
 * @param {Object} the component to register. This component must extends SweetDevRia.RiaComponent
 * @static
 * @private
 */
function SweetDevRia_register (component) {
	SweetDevRia.set (component.id, SweetDevRia.COMPONENTS_REPOSITORY, component);
	SweetDevRia.setInstance (component.className, component.id);
	SweetDevRia.setToContext (component.contextId, component.id);
}

/**
 * Unregister a component in the repository
 * @param {Object} component the component to unregister. This component must extends SweetDevRia.RiaComponent
 * @static
 * @private
 */
function SweetDevRia_unregister (component) {
	SweetDevRia.remove (component.id, SweetDevRia.COMPONENTS_REPOSITORY);
	SweetDevRia.removeInstance (component.className, component.id);
	SweetDevRia.removeFromContext (component.contextId, component.id);
}

/**
 * Unregister a context in the repository.
 * For all component in a context, this function destroy it then unregister it
 * @param {String} contextId the context id to unregister.
 * @static
 * @private
 */
function SweetDevRia_unregisterContext (contextId) {
	var instance = SweetDevRia.getInstance ();
	var repository = instance.repository[contextId+SweetDevRia.CONTEXT_SUFFIXE];

	if(!repository){
		SweetDevRia.log.info("Cannot unregister the unknown context :"+contextId);
		return;
	}

	/* Else we destroy all in this repository */
	var compId = null;
	
	while(repository.length>0){
		compId = repository[0];
		var comp = SweetDevRia.$(compId);
		if(comp){
			comp.destroy();
			SweetDevRia.unregister(comp); //unregister descreases the array
		}
	}
}

/**
 * Register a component into a context.
 * @param {String} contextId the context id containing this component.
 * @param {String} componentId the component id to register in its context.
 * @static
 * @private
 */
function SweetDevRia_setToContext (contextId, componentId) {
	var instance = SweetDevRia.getInstance ();
	var repositoryKey = contextId + SweetDevRia.CONTEXT_SUFFIXE;
	var repository = instance.repository[repositoryKey];

	if (!repository) {
		instance.repository[repositoryKey] = [];
		repository = instance.repository [repositoryKey];
	}

//	SweetDevRia.log.debug("repo context '"+contextId+"' before add "+componentId+"="+repository.length);
	repository [repository.length] = componentId;
}

/**
 * Unregister a component from a context.
 * @param {String} contextId the context id containing this component.
 * @param {String} componentId the component id to unregister from its context.
 * @static
 * @private
 */
function SweetDevRia_removeFromContext (contextId, componentId) {
	var instance = SweetDevRia.getInstance ();
	var repositoryKey = contextId + SweetDevRia.CONTEXT_SUFFIXE;
	var repository = instance.repository[repositoryKey];

	if (!repository) {
		return ;
	}

//	SweetDevRia.log.debug("repo context '"+contextId+"' before delete '"+componentId+"'="+repository.length);
	repository.remove(componentId);
//	SweetDevRia.log.debug("repo context '"+contextId+"' after delete "+componentId+"="+repository.length);
}

/**
 * Return a SweetDevRia instance according to its id
 * @param {String} componentId the id of the component to return.
 * @return a registered SweetDevRia instance according to its id
 * @type RiaComponent
 * @static
 */
function SweetDevRia_getComponent (componentId) {
	return SweetDevRia.get (componentId, SweetDevRia.COMPONENTS_REPOSITORY);
}

/** 
 *  Return an object into a specific repository (context)
 * 	@param {String} key name of the key of the component to look for
 * 	@param {String} repositoryKey Optional name of the repository key
 * 	@return the RiaComponent component corresponding to the key, or null if none is found
 * 	@type RiaComponent
 */
function SweetDevRia_get (key, repositoryKey) {
	var instance = SweetDevRia.getInstance ();
	var repository = instance.repository;

	if ((repositoryKey !== null) && (repositoryKey !== undefined)) {
		repository = instance.repository [repositoryKey];
	}

	if (repository) {
		/** On retourne la valeur ayant la @key comme cle */
		return repository [key];
	}
	else {
		/** Le r?f?rentiel recherch? n'existe pas, on retourne null */
		return null;
	}
}

/** 
 *  Enregistre une valeur d'une variable stock?e
 * 	@param {String} key nom de la variable ? sauvebarder ou modifier
 * 	@param {String} repositoryKey nom d'une r?f?rentiel ou est stock?
 * 					la variable ? sauvegarder ou modifier
 * 	@param {Object} value nouvelle valeur de la variable stock?e
 */
function SweetDevRia_set (key, repositoryKey, value) {
	var instance = SweetDevRia.getInstance ();
	var repository = instance.repository;
	
	if (repositoryKey == null) {
		throw("Cannot set the component id : '"+key+"' into an unknown repository.");
	}
	
	repository = instance.repository [repositoryKey];
		
	/** Si le r?f?rentiel recherch? n'existe pas, on le cr?e */
	if ((repository === null) || (repository == undefined)) {
		instance.repository [repositoryKey] = {};
		repository = instance.repository [repositoryKey];
	}

	/** On enregistre la valeur */	
	repository [key] = value;
}

/** 
 *  Delete value 
 * 	@param {String} key nom de la variable ? sauvebarder ou modifier
 * 	@param {String} repositoryKey nom d'une r?f?rentiel ou est stock?
 * 					la variable ? sauvegarder ou modifier
 */
function SweetDevRia_remove (key, repositoryKey) {
	var instance = SweetDevRia.getInstance ();
	var repository = instance.repository;
	
	if (repositoryKey !== null) {
		repository = instance.repository [repositoryKey];
	}

	if (repository !== null) {
		/** On enregistre la valeur */	
		repository [key] = null;
	}
	
	//TODO destroy ?
}

/** 
 * Get all instances of a className
 * @param {String} className the name of the class to look for
 * @return an array of Ria components ids
 * @type Array
 * @static
 */
function SweetDevRia_getInstances (className) {
	var repository = SweetDevRia.getInstance ().repository;
	return repository [className+SweetDevRia.CLASSNAME_SUFFIXE];
}

/** 
 * Set an instance in a repository relative to a className
 * @param {String} className the name of the class to store
 * @param {String} componentId the component id to store
 */
function SweetDevRia_setInstance (className, componentId) {
	var repository = SweetDevRia.getInstance ().repository;
	var instancesRepo = repository [className+SweetDevRia.CLASSNAME_SUFFIXE];

	if ((instancesRepo === null) || (instancesRepo == undefined)) {
		repository [className+SweetDevRia.CLASSNAME_SUFFIXE] = [];
		instancesRepo = repository [className+SweetDevRia.CLASSNAME_SUFFIXE];
	}
	
	instancesRepo [instancesRepo.length] = componentId;
}

/** 
 * Remove an instance in a repository relative to a className
 * @param {String} className the name of the class to store
 * @param {String} componentId the component id to remove
 */
function SweetDevRia_removeInstance (className, componentId) {
	var repository = SweetDevRia.getInstance ().repository;
	var instancesRepo = repository [className+SweetDevRia.CLASSNAME_SUFFIXE];

	if ((instancesRepo !== null) && (instancesRepo !== undefined)) {
		instancesRepo.remove(componentId);
	}
}

function SweetDevRia_size (className) {
	var repository = SweetDevRia.getInstance ().repository;
	var instancesRepo = repository [className+SweetDevRia.CLASSNAME_SUFFIXE];

	if ((instancesRepo !== null) && (instancesRepo !== undefined)) {
		return instancesRepo.length;
	}
	
	return 0;
}



/** 
 * Retourne un toString d'un objet
 * @param {Object} objet dont on souhaite le toString
 * @return une chaine contenant les diff?rentes valeurs de l'objet
 * @type String
 */
function SweetDevRia_displayProperties (obj) {
	var rep = "";
	
	for (var i in obj) {
		if (typeof (i)== "function"){
			rep += i + " :: (function)\n";		
		}
		else{
			rep += i + " :: "+obj [i]+"\n";
		}		
	}
	
	return rep;
}

function SweetDevRia_getUrlParams () {
	var params = {};
	var location = window.location+"";
	var index = location.indexOf ("?");
	if (index > 0) {
		location = location.substring (index+1);
		var tab = location.split ("&");
		for (var i = 0; i < tab.length; i++) {
			var equalIndex = tab[i].indexOf ("=");
			if (equalIndex > 0) {
				var name = tab[i].substring (0, equalIndex);
				var value = tab[i].substring (equalIndex + 1);
				params [name] = value;
			}
		}
	}
	
	return params;
}

function SweetDevRia_addUrlParam (name, value) {
	var location = window.location+"";
	var index = location.indexOf ("?");
	if (index > 0) {
		location += "&";
	}
	else {
		location += "?";
	}
	
	location += name + "=" + value;
	window.location = location;
}

/**
 * Add a listener on a SweetDevRia component event.
 * These events are triggered on some components main action (window opening...). 
 * @param {Object} comp the SweetDevRia component we are listening an event on
 * @param {String} eventType the type of the event
 * @param {function} handler A function handling the event.
 * @param {Object} param some parameters to pass to the function
 */
SweetDevRia.addListener =  function (comp, eventType, handler, param) {
	if (comp.isRiaComponent) {
		var id = comp.id;	
		var ria = SweetDevRia.getInstance ();
		
		if (! ria.listeners [id]) {
			ria.listeners [id] = {};
		}
		if (! ria.listeners [id][eventType]) {
			ria.listeners [id][eventType] = [];
		}				

		ria.listeners [id][eventType].add ([handler, param]);
				
		return true;
	}
	
	return false;
};

SweetDevRia.removeListener =  function (comp, eventType) {
	if (comp.isRiaComponent) {
		var id = comp.id;	
		var ria = SweetDevRia.getInstance ();
		
		if (ria.listeners [id]) {
			ria.listeners [id][eventType] = [];
		}				
				
		return true;
	}
	
	return false;
};

SweetDevRia.EventHelper.addListener (window, "load", function () {
	SweetDevRia.startLog ("Log.Onload");
	SweetDevRia.init ();
	SweetDevRia.endLog ("Log.Onload");
});


//add a function to call before unload (updateservermodel grid)
SweetDevRia.addBeforeUnload = function(func){
	SweetDevRia.getInstance().beforeUnloadListeners.push(func);
};

//fire the remaining events on beforeunload, and call the function listeners before.
SweetDevRia.EventHelper.addListener (window, "beforeunload", function () {
	var arrayFunc = SweetDevRia.getInstance().beforeUnloadListeners;
	
	for(var i=0;i<arrayFunc.length;++i){
		arrayFunc[i]();
	}

	SweetDevRia.ComHelper.fireEvent(null, true);//synchroCall
});


/**
 * Retourne la chaine HTML resultant de la compilation du template @template avec l'objet @obj
 * @param template HTMLString Template HTML contenant des trous du type ${id}
 * @param obj Object Instance servant a remplir les trous du template
 * @return la chaine HTML resultant de la compilation du template @template avec l'objet @obj
 * @type String
 */
SweetDevRia.getHtmlString  = function (template, obj){
	if (obj == null) {
		obj = this;
	}
	var str =  TrimPath.processDOMTemplate(template, obj);
	return str;
};


/**
 * Effectue la compilation d'un template avec une instance et ajoute le resultat a un noeud (evite un innerHTML barbare)
 * @param parent Node Noeud ou ajouter le resultat de la compilation du template
 * @param template HTMLString Template HTML contenant des trous du type ${id}
 * @param obj Object Instance servant a remplir les trous du template
 * @see SweetDevRia.getHtmlString
 */
SweetDevRia.addTemplate = function (parent, template, obj) {
	var str = SweetDevRia.getHtmlString (template, obj);
	var temp = document.createElement ("div");
	temp.innerHTML = str;
	for (var i = 0; i < temp.childNodes.length; i++) {
		parent.appendChild (temp.childNodes[i]);
	}
};


SweetDevRia.removeKey = function(map, key) {
	var res = {};
	for (var i in  map) {
		if (i != key) {
			res [i] = map [i]; 
		}
	}
	
	return res;
};

/**
 * Ajoute toutes les proprietes contenues dans la map @properties dans l'instance @obj en appelant les setters s'ils existent
 * @param @obj Object Instance d'objet a enrichir
 * @param properties Map Contient les proprietes ou methode a ajouter a  l'objet. 
 */
SweetDevRia.setProperties = function (obj, properties) {
	for (var propName in properties) {
		var propValue = properties [propName];
		var setterName = "set"+ propName.charAt(0).toUpperCase() + propName.substring (1);

		var setter = obj [setterName];
		
		if (setter && (typeof(setter)+"").toLowerCase() == "function") {
			setter.call (obj, propValue);
		}
		else {
			obj [propName] = propValue;
		}
	}

};


