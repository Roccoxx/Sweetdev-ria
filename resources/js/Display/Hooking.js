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
* This is the Hookable component "interface" 
* @param {String} id Id of this hookable SweetDEV RIA component
* @constructor
*/
SweetDevRia.Hookable = function(id){
	this.hookerId = null;
	this.hooker = null;
};

/**
* Every hookable component MUST override this method to get closed on parent request
*/
SweetDevRia.Hookable.prototype.close = function(){
	SweetDevRia.log.error("Component id "+this.id+" does not override the close function (called by any container component).");
};

/**
* Every hookable component MUST override this method to get moved on parent request
* @param {int} dx delta X to move the component to
* @param {int} dy delta Y to move the component to
*/
SweetDevRia.Hookable.prototype.move = function(dx, dy){
	SweetDevRia.log.error("Component id "+this.id+" does not override the move function (called by any container component).");
};

/**
* Return the hooker of a component, or null if none have been computed or found
* @type RiaComponent
* @return the container component for this one, or null if none have been found or computed yet 
*/
SweetDevRia.Hookable.prototype.getHooker = function(){
	return this.hooker;
};

/**
* Return the hooker id of a component, or null if none have been computed or set yet.
* @type String
* @return the hooker id of a component, or null if none have been computed or set yet. 
*/
SweetDevRia.Hookable.prototype.getHookerId = function(){
	return this.hookerId;
};

/**
* Set a custom component id as hooker for this component (if not computable on server side).
* This id will then be initialized on next tryHooking call.
* @param {String} id the id of the SweetDEV RIA component hooking this one
*/
SweetDevRia.Hookable.prototype.setHookerId = function(id){
	this.hookerId = id;
};


/**
* Function trying to hook (initializing the hook)
*/
SweetDevRia.Hookable.prototype.tryHooking = function(){
	if(!this.hooker){
		if(this.hookerId){
			this.hooker = SweetDevRia.$(''+this.hookerId);
			this.hooker.hook(this.id);
		}
	}
};

/**
* Function checking if a component is hooked or not (PopupManager)
*/
SweetDevRia.Hookable.prototype.hasHookedComp = function(compId){
	if(this.hookedIds && this.hookedIds.length>0){	
		var index = 0;
		var childId = this.hookedIds[index];
		var child = null;
		
		while(childId!=null){
			if(childId==compId){
				return true;
			}
			
			child = SweetDevRia.$(childId);
			
			if(child.hookedIds && child.hookedIds.length>0){
				if(child.hasHookedComp(compId)){
					return true;
				}
			}
			index = index + 1;
			childId = this.hookedIds[index];
			if(!childId){
				return false;
			}

		}
	}
	return false;
};


/**
* This is the Hooker component class 
* @constructor
*/
SweetDevRia.Hooker = function(){
	this.hookedIds = new Array();
};

/**
* Hook a SweetDEV RIA component to this hooker
* @param {String} id the id of the SweetDEV RIA component
*/
SweetDevRia.Hooker.prototype.hook = function(id){
	this.hookedIds.push(id);
};

SweetDevRia.Hooker.prototype.isHooked = function(id){
	var res = this.hookedIds.contains(id);

	if (! res) {
		for (var i = 0; i < this.hookedIds.length && ! res; i++) {
			var comp = SweetDevRia.$ (this.hookedIds [i]);
			res = comp.isHooked (id);
		}
	}
	
	return res;
	
};

/**
* Close all the SweetDEV RIA components hooked to this one.
* MUST BE CALLED by the implementing component to be triggered.
*/
SweetDevRia.Hooker.prototype.closeHooked = function(){
 	for(var i=0;i<this.hookedIds.length;++i){
		var id=this.hookedIds[i]; 
		if(SweetDevRia.$(id)){
			SweetDevRia.$(id).close();
		}
	}
};

/**
* Move all the SweetDEV RIA components hooked to this one.
* MUST BE CALLED by the implementing component to be triggered.
* @param {int} dx delta X to move the component to
* @param {int} dy delta Y to move the component to
*/
SweetDevRia.Hooker.prototype.moveHooked = function(dx, dy){
	for(var i=0;i<this.hookedIds.length;++i){
		var id=this.hookedIds[i]; 
		if(SweetDevRia.$(id)){
			SweetDevRia.$(id).onContainerMove(dx, dy);
		}
	}
};

/**
* This is the Hooker component class 
* @constructor
*/
SweetDevRia.HookedComp = function() {
	this.hookedComp = new Array();
};

/**
 * Singleton.
 */
SweetDevRia.HookedComp._instance = new SweetDevRia.HookedComp();

/**
 * get the Instance of HookedComp.
 * @return Instance of HookedComp.
 * @type HookedComp object.
 */
SweetDevRia.HookedComp.getInstance = function() {
	return SweetDevRia.HookedComp._instance;
};

SweetDevRia.HookedComp.prototype.toHook = function(compId,hookerId) {
	this.hookedComp[compId] = hookerId;
};

SweetDevRia.HookedComp.prototype.getHooker = function(compId) {
	if(this.hookedComp[compId]){
		var result = this.hookedComp[compId];
		this.hookedComp[compId] = undefined;
		return result;
	}
	return null;
};






