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
 * @class parent class of SweetDevRia components
 * @constructor
 * @private
 */ 
SweetDevRia.RiaComponent = function(id, className) {

	if (id) {
		this.id = id;
		this.className = className;

		this.baseRiaComponent = SweetDevRia.EventManager;
		this.baseRiaComponent ();
	
		this.contextId = SweetDevRia.ContextManager.getInstance().getActiveContext();
		this.portletId = SweetDevRia.PortletContextManager.getInstance().getActiveContext().id;
	
		/** components repository register */
		SweetDevRia.register (this);
		
		/** subcribe to keyListener events */
		SweetDevRia.KeyListener.getInstance().addEventListener (this);
		
		var sweetDevRiaProxy = SweetDevRiaProxy.getInstance ();
		this.addEventListener (sweetDevRiaProxy);
		
		sweetDevRiaProxy.addEventListener (this);
		
		this.parentComponentId = null;
		if (SweetDevRia.riaComponentParentIds && SweetDevRia.riaComponentParentIds.length) {
			this.parentComponentId = SweetDevRia.riaComponentParentIds [SweetDevRia.riaComponentParentIds.length - 1];
		}

		this.isRiaComponent = true;
		
		this.containerId = null;

		this.constraintId = null;

		this.borderType = null;

		SweetDevRia.toInitialize.push(id);

		this.load ();
	}
};

/**
 * This event type is fired when the ria component is rendered
 */
SweetDevRia.RiaComponent.RENDER_EVENT = "render";

/**
 * This event type is fired when the ria component is initialized
 */
SweetDevRia.RiaComponent.INIT_EVENT = "init";


SweetDevRia.RiaComponent.prototype = new SweetDevRia.EventManager;

SweetDevRia.RiaComponent.prototype.i18n = {};

SweetDevRia.RiaComponent.prototype.setActive = function (active) {
	if (active) {
		SweetDevRia.ActiveManager.setActiveComponent (this);
	} else {
		SweetDevRia.ActiveManager.removeComponent (this);
	}
};

SweetDevRia.RiaComponent.prototype.load = function () {
	null;
};

SweetDevRia.RiaComponent.prototype.isActive = function () {
	var activeComp = SweetDevRia.ActiveManager.getActiveComponent ();
	if (activeComp && (activeComp.id == this.id)) {
		return true;
	}
	return false;
};

SweetDevRia.RiaComponent.prototype.toString = function () {
	return this.id+" [ "+this.className+" ]";
};

/**
 * Destroy the component
 * Default does nothing.
 * @private
 */
SweetDevRia.RiaComponent.prototype.destroy = function () {
	
};

SweetDevRia.RiaComponent.prototype.addHash = function (hash) {
//	SweetDevRia.BackHelper.addHash (this.id, hash);
};

/**
 * Get the frame component associated to this component (if exist), null otherwize
 * @return the SweetDevRia.Frame component circling this component
 * @type Frame
 */
SweetDevRia.RiaComponent.prototype.getFrame = function(){
    return SweetDevRia.$(SweetDevRia.Frame.getFrameId(this.id));
};

/**
 * Create a frame for this component
 * @return the new SweetDevRia.Frame component created
 * @type Frame
 */
SweetDevRia.RiaComponent.prototype.createFrame = function(){
	SweetDevRia.ContextManager.getInstance().pushContext(this.contextId);
	
	var frame = new SweetDevRia.Frame (SweetDevRia.Frame.getFrameId(this.id));
	
	SweetDevRia.ContextManager.getInstance().popContext(this.contextId);
	
	frame.borderSize = this.borderSize;
	frame.cssClassBase = this.cssClassBase;

	if (this.borderType !=  null) {
		frame.borderType = this.borderType;
	}
	
	frame.constraintId = this.constraintId;
    return frame;
};

/**
 * Specify a parent id to constraint resize of the associated frame, if exist
 * @param {String} constraintId
 */
SweetDevRia.RiaComponent.prototype.setConstraintId = function(constraintId){
	var frame = this.getFrame ();
	if (frame) {
		frame.setConstraintId (constraintId);
	}
};

/**
 * Frame default border size
 * @type int
 */
SweetDevRia.RiaComponent.prototype.borderSize = 5;


SweetDevRia.RiaComponent.prototype.beforeInitialize  = function(){  /* override this */ return true;  };
SweetDevRia.RiaComponent.prototype.afterInitialize  = function(){  /* override this */};


/**
 * Frame default css class base
 * @type String
 */
SweetDevRia.RiaComponent.prototype.cssClassBase = "ideo-bdr-";

SweetDevRia.RiaComponent.prototype.setVisibility = function (visible) {
	var container = this.getContainer ();
	if (container) {
		SweetDevRia.DomHelper.setVisibility (container.id, visible);
	}
};

SweetDevRia.RiaComponent.prototype.priorityHandleEvent = function (evt) {
	if (evt.type == SweetDevRia.RiaEvent.INIT_TYPE) {
		var res = true;
		if (this.initialize && ! this.initialized) {
			SweetDevRia.ContextManager.getInstance().pushContext(this.contextId);

			if (this.beforeInitialize ()) {
				res = this.initialize ();

				this.fireEventListener (SweetDevRia.RiaComponent.INIT_EVENT);

				this.afterInitialize ();
			}

			SweetDevRia.ContextManager.getInstance().popContext(this.contextId);
		}
		this.initialized = true;//TODO are we sure we cannot cycle the initialization ?
		return res;
	}
	else if (evt.idSrc == this.id) {
		var type = evt.type;

		if (type && type.length) {
			var functionName = "on"+type.substring(0, 1).toUpperCase() + type.substring(1, type.length);

			if (this [functionName]) {
				return 	this[functionName].call (this, evt);
			}
		}
	}
	
	return true;
};


SweetDevRia.RiaComponent.prototype.updateServerModel = function (attrName, attrValue) {
	if (! SweetDevRia.ComHelper.isJsfPage ()){
		return;
	}
	var evt = new SweetDevRia.RiaEvent (SweetDevRia.RiaEvent.SETTER_TYPE, this.id, {"name":attrName, "value":attrValue, "sendServer": true});
	this.fireEvent(evt);
};


SweetDevRia.RiaComponent.prototype.updateServerModelStatic = function (srcId, attrName, attrValue) {
	if (! SweetDevRia.ComHelper.isJsfPage ()){
		return;
	}
	
	var evt = new SweetDevRia.RiaEvent (SweetDevRia.RiaEvent.SETTER_TYPE, srcId, {"name":attrName, "value":attrValue, "sendServer": true});

	var sweetDevRiaProxy = SweetDevRiaProxy.getInstance ();
	sweetDevRiaProxy.handleEvent(evt);
};



/**
 * This method is called before Render this menu
 * To be overriden !!
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.RiaComponent.prototype.beforeRender = function (){  /* override this */ return true;  };

/**
 * This method is called after Render this menu
 * To be overriden !!
 */
SweetDevRia.RiaComponent.prototype.afterRender = function (){  /* override this */ };

/**
 * Return the component container
 */
SweetDevRia.RiaComponent.prototype.getContainer = function(){
	if (this.containerId == null){
		this.containerId = this.id+"_container";
	}

	return document.getElementById (this.containerId);
};

/**
 * Render this component if exist a template
 * @private
 */
SweetDevRia.RiaComponent.prototype.render = function(){
	
	SweetDevRia.startLog ("Log.Render_"+this.id, this);
	
	if (this.beforeRender ())  {
		if (this.template) {
			var container = this.getContainer ();
			if (container) {
				if (this.bodyContent == null) {
					this.bodyContent = container.innerHTML;
				}
				
				var str =  this.getRenderString (this.template);
				container.innerHTML = str;
			}
			else {
				SweetDevRia.log.error("RiaComponent render : container is null !");
			}
		}
	
		this.fireEventListener (SweetDevRia.RiaComponent.RENDER_EVENT);

		this.afterRender ();
	}	

	SweetDevRia.endLog ("Log.Render_"+this.id, this, 1);

};


SweetDevRia.RiaComponent.prototype.getRenderString = function(template){
	if (template) {
		var str =  TrimPath.processDOMTemplate(template, this);
		return str;
	}
	
	return null;
};



/**
 * Return a message contained in the i18n map from a key
 * @param {String} key The message key inside the i18n map
 * @private
 */
SweetDevRia.RiaComponent.prototype.getMessage =  function (key) {
	if (this.i18n) {
		return this.i18n  [key];
	}
	
	return null;
};


SweetDevRia.RiaComponent.prototype.fireEventListener =  function (eventType, evtParam) {
	var ria = SweetDevRia.getInstance ();
	
	if (ria.listeners [this.id] && ria.listeners [this.id][eventType]) {
		var listeners = ria.listeners [this.id][eventType];

		for (var i = 0; i < listeners.length; i++) {
			var listener = listeners [i];
			var handler = listener [0];
			var param = listener [1];
			
			handler.call (this, param, evtParam);
		}
	}			
};

SweetDevRia.RiaComponent.prototype.asyncCallIAction =  function (action, params, callback) {
	return SweetDevRia.ComHelper.asyncCallIAction(action, params, callback, this.contextId);	
};

SweetDevRia.RiaComponent.prototype.synchCallIAction =  function (action, params) {
	return SweetDevRia.ComHelper.synchCallIAction(action, params, this.contextId);	
};

SweetDevRia.RiaComponent.prototype.createClosure = function (func){
	var comp = this;
	return function(){
		var args = [];
		for(var i=0;arguments[i];i++){
			args[i] = arguments[i];
		}
		func.apply(comp,args);
	};
};