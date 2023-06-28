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
SweetDevRia.DD = function(id){
	superClass (this, SweetDevRia.RiaComponent, id, "SweetDevRia.DD");

	this.objDD = null;

	this.dropZoneIds = [];
	this.dragId = null;
	this.handleId = null;

	this.displayIcon = true;

	this.fakeMode = SweetDevRia.DD.CLONE;

	this.group = this.id+"_group";
	
	this.constraintType = null;
	this.constraintId = null;
	
	this.minX = null;
	this.maxX = null;
	this.minY = null;
	this.maxY = null;
	
	this.delta = false;
	this.canDrag = true;
	this.canDrop = true;
	
	this.insertMode = SweetDevRia.DD.NONE;

	this.hideDuringDrag = false;
	
	this.dragObjectClass = null;
	this.overBeforeClass = null;
	this.overAfterClass = null;

	this.applyDragCss = true;
	this.applyDropCss = true;
	
	this.allowDocumentDrop = false;
	this.documentDropZone = null;
	
	//Used to emulate singleton
	this.maskId = null;
};

extendsClass(SweetDevRia.DD, SweetDevRia.RiaComponent);

SweetDevRia.DD.CLONE = "clone";
SweetDevRia.DD.FAKE = "fake";
SweetDevRia.DD.NONE = "none";
SweetDevRia.DD.VERTICAL = "vertical";
SweetDevRia.DD.HORIZONTAL = "horizontal";

SweetDevRia.DD.VERTICAL_INSERT = "verticalInsert";
SweetDevRia.DD.HORIZONTAL_INSERT = "horizontalInsert";
SweetDevRia.DD.NONE_INSERT = "noneInsert";
SweetDevRia.DD.NONE = "none";

SweetDevRia.DD.MASK_ID = 'generic_mask';
SweetDevRia.DD.CONTAINER_ID = 'generic_container';

SweetDevRia.DD.prototype.setDragId = function (dragId) {
    this.dragId = dragId;
};

SweetDevRia.DD.prototype.setHandle = function (handleId) {
    this.handleId = handleId;
};

SweetDevRia.DD.prototype.addDropZone = function (dropZoneId) {
	this.dropZoneIds.add (dropZoneId);
};

SweetDevRia.DD.prototype.onStartDrag = function(){
	// To be overridden
};

SweetDevRia.DD.prototype.onDrag = function(){
	// To be overridden
};

SweetDevRia.DD.prototype.onDragEnter = function(dropZone){
	// To be overridden
};

SweetDevRia.DD.prototype.onDragOver = function(dropZone, dropPosition){
	// To be overridden
};

SweetDevRia.DD.prototype.onDragOut = function(dropZone){
	// To be overridden
};

SweetDevRia.DD.prototype.onDragDrop = function(dropZone, dropPosition){
	// To be overridden
};

SweetDevRia.DD.prototype.onEndDrag = function(){
	// To be overridden
};

SweetDevRia.DD.prototype.onDropEnter = function(dragObject){
	// To be overridden
};

SweetDevRia.DD.prototype.onDropOver = function(dragObject, dragPosition){
	// To be overridden
};

SweetDevRia.DD.prototype.getDropEnterIconClass = function(dragObject, dragPosition){
	return "ideo-dd-dropOverIcon";
	// To be overridden
};

SweetDevRia.DD.prototype.getDropOutIconClass = function(dragObject){
	return "ideo-dd-dropOutIcon";
	// To be overridden
};

SweetDevRia.DD.prototype.onDropOut = function(dragObject){
	// To be overridden
};

SweetDevRia.DD.prototype.onDrop = function(dragObject, dragPosition){
	// To be overridden
};

SweetDevRia.DD.prototype.setFakeMode  = function (fakeMode) {
	this.fakeMode = fakeMode;
};

// return the object id beneath which will be set the iframe
SweetDevRia.DD.prototype.getIFrameObjIdUnder = function () {
	return this.dragId;
};

/**
 * This method is automatically called at the page load
 * @private
 */
SweetDevRia.DD.prototype.initialize = function () {
	var item = SweetDevRia.DomHelper.get (this.dragId);

	if (this.dragId != "#document") {
	    this.objDD = new YAHOO.util.DDProxy (this.dragId, this.group);
	    if(this.canDrag && !this.hideIFrame){
	    	null;
//			this.addIframeMask (); // srevel : cette ligne fait mechemment planter, ss ie 6 j ai un blanc ss les neoud draggable de l arbre qui correspond a l'iframe du mask
		}
	}
	else {
    	this.objDD = new YAHOO.util.DDTarget("#document", this.group);
	}

	function captureEvents(){
		return false;
	}
		
	if (this.handleId != null) {
		this.objDD.setHandleElId (this.handleId);
		item = SweetDevRia.DomHelper.get (this.handleId);
	}

	if (item != null) {
		item.onselectstart = captureEvents;
		item.onselect = captureEvents;
		item.ondblclick = captureEvents;
		//item.onmousedown = captureEvents;
	}

	var dragEl = SweetDevRia.DomHelper.get (this.dragId);
	if (dragEl) {
		dragEl.dd = this;
	}
	this.objDD.dd = this;

	this.objDD.setDragElId (this.id);

	var cloneContainer = document.getElementById(SweetDevRia.DD.CONTAINER_ID);
	if(cloneContainer==null){
		cloneContainer = document.createElement ("div");
		cloneContainer.setAttribute ("id", SweetDevRia.DD.CONTAINER_ID);
		cloneContainer.style.position = "absolute";
		cloneContainer.style.display = "none";
	}
	
	SweetDevRia.DomHelper.addClassName(cloneContainer, "ideo-dd-container");
	document.body.appendChild (cloneContainer);

	if (this.delta) {
		this.objDD.setDelta = function(iDeltaX, iDeltaY) {
		    this.deltaX = -20;
		    this.deltaY = -20;
		};
	}

	this.objDD.b4MouseDown = function(e) { 
		var el = this.getDragEl();
		var visibility = SweetDevRia.DomHelper.isVisible (el.id);
		if (!visibility) {
			SweetDevRia.DomHelper.setVisibility (el.id, true);
		}

	    var x = YAHOO.util.Event.getPageX(e);
	    var y = YAHOO.util.Event.getPageY(e);
	
	    this.autoOffset(x, y);
	    this.setDragElPos(x, y);

		if (!visibility) {
			SweetDevRia.DomHelper.setVisibility (el.id, false);
		}
	};
	
	this.objDD.getDragEl = function(){
		return document.getElementById(SweetDevRia.DD.CONTAINER_ID);
	};
	
	if (this.allowDocumentDrop) {
		var documentDropZone = new SweetDevRia.DD (this.id+"_documentDrop");
		documentDropZone.setDragId ("#document");  
		documentDropZone.canDrag = false;
		documentDropZone.canDrop = true;
		documentDropZone.group = this.group;
		documentDropZone.insertMode = SweetDevRia.DD.NONE_INSERT;

		this.addDropZone ("test_document");
	}


	this.objDD.startDrag = this.onStartDragGlobal (this);
	this.objDD.onDrag = this.onDragGlobal (this);
	this.objDD.onDragDrop = this.onDropGlobal (this);
	this.objDD.endDrag = this.onEndDragGlobal (this);
	this.objDD.onDragEnter = this.onDragEnterGlobal (this);
	this.objDD.onDragOver = this.onDragOverGlobal (this);
	this.objDD.onDragOut = this.onDragOutGlobal (this);
	
	for (var i = 0; i < this.dropZoneIds.length; i++) {
		var dropZoneId = this.dropZoneIds[i];
		var dropZone = SweetDevRia.$ (dropZoneId);
		if (dropZone && dropZone.objDD) {//TODO pourquoi fix ?
		    dropZone.objDD.removeFromGroup("default");
		    dropZone.objDD.addToGroup(this.group);
		}
	}
	
	if (! this.canDrag) {
        YAHOO.util.Event.removeListener(this.objDD.id, "mousedown", 
                this.objDD.handleMouseDown);
	}
	
	this.objDD.isTarget = this.canDrop;
	
	return true;
};

SweetDevRia.DD.prototype.setCanDrop = function(canDrop){
	this.canDrop = canDrop;
	if (this.objDD) {
		this.objDD.isTarget = this.canDrop;
	}
};

SweetDevRia.DD.prototype.setCanDrag = function(canDrag){
	this.canDrag = canDrag;
	if (this.objDD) {
		if (! this.canDrag) {
	        YAHOO.util.Event.removeListener(this.objDD.id, "mousedown", 
	                this.objDD.handleMouseDown);
		}
		else {
	       	SweetDevRia.EventHelper.addListener(this.objDD.id, "mousedown", 
                                          this.objDD.handleMouseDown, this.objDD, true);
		}
	}
};




SweetDevRia.DD.prototype.getMinX =  function () {
	return this.minX;
};
SweetDevRia.DD.prototype.getMaxX =  function () {
	return this.maxX;
};
SweetDevRia.DD.prototype.getMinY =  function () {
	return this.minY;
};
SweetDevRia.DD.prototype.getMaxY =  function () {
	return this.maxY;
};


SweetDevRia.DD.prototype.applyConstraint = function(){
	this.objDD.resetConstraints ();

	var minX = this.getMinX ();
	var maxX = this.getMaxX ();
	var minY = this.getMinY ();
	var maxY = this.getMaxY ();
	var box = YAHOO.util.Region.getRegion (this.getEl());
	if (minX != null && maxX != null) {
		var toLeft = box.left - minX;
		var toRight = maxX - box.left;

		this.objDD.setXConstraint (toLeft, toRight);
	}

	if (minY != null && maxY != null) {
		var toTop = box.top - minY;
		var toBottom = maxY - box.top;

		this.objDD.setYConstraint (toTop, toBottom);
	}

	if (this.constraintId) {
		var parent = document.getElementById (this.constraintId); 
		if (parent) {
			var parentBox = YAHOO.util.Region.getRegion (parent);
			var box = YAHOO.util.Region.getRegion (this.getEl());
			
			var toLeft = box.left - parentBox.left;
			if (toLeft < 0) {toLeft = 0;}
			var toRight = parentBox.right - box.right;
			if (toRight < 0) {toRight = 0;}
			var toTop = box.top - parentBox.top;
			if (toTop < 0) {toTop = 0;}
			var toBottom = parentBox.bottom - box.bottom;
			if (toBottom < 0) {toBottom = 0;}
			
			this.objDD.setXConstraint (toLeft, toRight);
			this.objDD.setYConstraint (toTop, toBottom);
		}
	}

	if (this.constraintType == SweetDevRia.DD.VERTICAL) {
		this.objDD.setXConstraint (0, 0);
	}
	else if (this.constraintType == SweetDevRia.DD.HORIZONTAL) {
		this.objDD.setYConstraint (0, 0);
	}
};


// to override
SweetDevRia.DD.prototype.createClone = function(node){
	var clone = node.cloneNode (true);
	SweetDevRia.DomHelper.addClassName(clone, "ideo-dd-clone");
	
	this.cleanAllIds (clone);
	
	return clone;
};

SweetDevRia.DD.prototype.cleanAllIds = function(node){
	if (node.removeAttribute) {
		node.removeAttribute ("id");
		node.removeAttribute ("name");//mandatory for iframes
	}
	
	//id = null;
	var children = node.childNodes;
	for (var i = 0; i < children.length; i++) {
		this.cleanAllIds (children[i]);
	}	
};


// to override
SweetDevRia.DD.prototype.createFake = function(node){
	var width = SweetDevRia.DomHelper.getWidth (node);
	var height = SweetDevRia.DomHelper.getHeight (node);

	var fake = document.createElement ("div");
	fake.style.width = width+"px";
	fake.style.height = height+"px";
	SweetDevRia.DomHelper.addClassName(fake, "ideo-dd-fake");
	return fake;
};


SweetDevRia.DD.prototype.addIframeMask = function () {
// TODO Ajouter l iframe de mask pour le probleme des select ss ie6. Il semble qu il y ait un probleme de zindex, du coup l iframe semble passer dessus
	var obj = SweetDevRia.DomHelper.get (this.getIFrameObjIdUnder());
	if(!this.maskId){
		SweetDevRia.LayoutManager.addMaskIFrame(SweetDevRia.DD.MASK_ID,document.body);
		SweetDevRia.LayoutManager.hideTransparentIFrame(SweetDevRia.DD.MASK_ID);
	}
	else{
		SweetDevRia.LayoutManager.addMaskIFrame(this.maskId, obj);
	}
};

SweetDevRia.DD.prototype.refreshIframeMask = function () {
// TODO Ajouter l iframe de mask pour le probleme des select ss ie6. Il semble qu il y ait un probleme de zindex, du coup l iframe semble passer dessus
	var obj = SweetDevRia.DomHelper.get (this.getIFrameObjIdUnder());
	if (obj) {
		SweetDevRia.LayoutManager.moveIFrame(this.maskId?this.maskId:SweetDevRia.DD.MASK_ID, obj);
	}
};

SweetDevRia.DD.prototype.removeIframeMask = function () {
// TODO Ajouter l iframe de mask pour le probleme des select ss ie6. Il semble qu il y ait un probleme de zindex, du coup l iframe semble passer dessus
	var obj = SweetDevRia.DomHelper.get (this.getIFrameObjIdUnder());
	if (obj) {
		SweetDevRia.LayoutManager.removeTransparentIFrame(this.maskId?this.maskId:SweetDevRia.DD.MASK_ID, obj);
	}
};


SweetDevRia.DD.prototype.onStartDragGlobal = function(dd){
	return function(x, y){

		dd.onB4StartDrag (x, y);

		
		document.onselectstart = function() { return false; };

		var cloneContainer = document.getElementById (SweetDevRia.DD.CONTAINER_ID);
		
		this._domRef = null; //refresh cache de yahoo, pr recreer un vrai clone
		dd.dragObject = this.getEl();
		dd.overObject = null;

		//SWTRIA-1365
		//cette methode utilise un cache et ne tiens pas compte du #ygddfdiv(z-index:999)
		cloneContainer.style.zIndex = SweetDevRia.DisplayManager.getInstance().getTopZIndex();
		if(!dd.maskId){
			SweetDevRia.LayoutManager.restoreTransparentIFrame(SweetDevRia.DD.MASK_ID);
		}
		
		cloneContainer.innerHTML = "";
		if (dd.fakeMode != SweetDevRia.DD.NONE) {
			var copy = null;

			var width = SweetDevRia.DomHelper.getWidth (dd.dragObject);
			var height = SweetDevRia.DomHelper.getHeight (dd.dragObject);

			if (dd.fakeMode == SweetDevRia.DD.CLONE) {
				copy = dd.createClone (dd.dragObject);
				copy.id = dd.dragObject.id+"_clone";
				
				copy.style.top = "0px";
				copy.style.left = "0px";
			}
			if (dd.fakeMode == SweetDevRia.DD.FAKE) {
				copy = dd.createFake (dd.dragObject);
			}

			if (dd.displayIcon) {
			    var divIcon = document.createElement("div");
			 	divIcon.id = dd.id+"_icon"; // SWTRIA-911
			 	divIcon.className = "ideo-dd-icon ";
			    divIcon.innerHTML = "&nbsp;";
				cloneContainer.appendChild (divIcon);
			}
			
			cloneContainer.style.width = width+"px"; 
			cloneContainer.style.height = height+"px"; 

			cloneContainer.appendChild (copy);
			
			if(dd.hideIFrame){
				SweetDevRia.LayoutManager.addMaskIFrame(dd.maskId?dd.maskId:SweetDevRia.DD.MASK_ID, cloneContainer);
				SweetDevRia.$(dd.dockedId).refreshWindowsBorders();
			}
			
			//TODO Bastien en cours
			/*var iframe = document.getElementById((dd.maskId?dd.maskId:SweetDevRia.DD.MASK_ID)+'-iframe-mask');
			dd.zIndex = iframe.style.zIndex;
			iframe.style.zIndex = 50000;*/
		}
		else {
			cloneContainer.style.width = "0px"; 
			cloneContainer.style.height = "0px"; 
		}
		
	
		if (dd.hideDuringDrag==true) {
			dd.dragObject.style.display = "none";
		}
	
		if (dd.applyDragCss) {
			SweetDevRia.DomHelper.addClassName(dd.dragObject, "selected");
			if (dd.dragObjectClass != null) {
				SweetDevRia.DomHelper.addClassName(dd.dragObject, dd.dragObjectClass);
			}
		}
		cloneContainer.style.display = "";

		dd.width = SweetDevRia.DomHelper.getWidth(cloneContainer);
		dd.height = SweetDevRia.DomHelper.getHeight(cloneContainer);

 		dd.applyConstraint ();

		dd.onStartDrag ();
	};
};

SweetDevRia.DD.prototype.onB4StartDrag = function(x, y){
	// To be overridden
};

SweetDevRia.DD.prototype.onDragGlobal = function(dd){
	return function(e){
		dd.onDrag ();
		//no clone, the iframe remain under the id 
		if(dd.fakeMode == SweetDevRia.DD.NONE){
			SweetDevRia.LayoutManager.moveIFrame(dd.maskId?dd.maskId:SweetDevRia.DD.MASK_ID, document.getElementById (dd.getIFrameObjIdUnder()));
		}
		else if(dd.hideIFrame){
			var cloneContainer = document.getElementById (SweetDevRia.DD.CONTAINER_ID);
			SweetDevRia.LayoutManager.moveIFrame(dd.maskId?dd.maskId:SweetDevRia.DD.MASK_ID, cloneContainer);
		}
		else{//clone !, the iframe moves under the clone 
			var cloneContainer = document.getElementById (SweetDevRia.DD.CONTAINER_ID);
			SweetDevRia.LayoutManager.moveIFrame(dd.maskId?dd.maskId:SweetDevRia.DD.MASK_ID, cloneContainer);
		}
	};
};


SweetDevRia.DD.prototype.onEndDragGlobal = function(dd){
	return function(e){
	    var node = this.getEl();

		if (dd.hideDuringDrag) {
			node.style.display = "block";
		}

		if (dd.applyDragCss) {
			SweetDevRia.DomHelper.removeClassName(node, "selected");
			if (this.dragObjectClass != null) {
				SweetDevRia.DomHelper.removeClassName(node, this.dragObjectClass);
			}
		}
		
		if(!dd.maskId){
			SweetDevRia.LayoutManager.hideTransparentIFrame(SweetDevRia.DD.MASK_ID);
		}
		
		var cloneContainer = document.getElementById (SweetDevRia.DD.CONTAINER_ID);
		cloneContainer.style.display = "none";
		
		if(dd.hideIFrame){
			SweetDevRia.LayoutManager.removeTransparentIFrame(dd.maskId?dd.maskId:SweetDevRia.DD.MASK_ID, cloneContainer);
			SweetDevRia.$(dd.dockedId).refreshWindowsBorders();
		}
		
		/*var iframe = document.getElementById((dd.maskId?dd.maskId:SweetDevRia.DD.MASK_ID)+'-iframe-mask');
		iframe.style.zIndex = dd.zIndex;*/

		dd.onEndDrag ();

		if (dd.enterClass != null) {
			SweetDevRia.DomHelper.removeClassName(cloneContainer, dd.enterClass);
			dd.enterClass = null;
		}
		if (dd.outClass != null) {
			SweetDevRia.DomHelper.removeClassName(cloneContainer, dd.outClass);
			dd.outClass = null;
		}

		dd.dropId = null;
		dd.dropZone = null;

		document.onselectstart = function() { return true; };

	};
};

SweetDevRia.DD.prototype.onDropGlobal = function(dd){
	return function(e, id){
	    var node = this.getEl();

		var cloneContainer = document.getElementById (SweetDevRia.DD.CONTAINER_ID);

		// si on drop sur une drop zone
			
		e = SweetDevRia.EventHelper.getEvent (e);
		
		dd.dropId = id;
		var dropEl = null;//SweetDevRia.DomHelper.get (id);
		var insertMode = null;
		dd.dropZone = YAHOO.util.DragDropMgr.getDDById (id).dd;
		if (id == "#document") {
			dropEl = document;	
			insertMode = SweetDevRia.DD.NONE_INSERT;
		}
		else {
			dropEl = dd.dropZone.getEl();
			insertMode = dd.dropZone.insertMode;
		}

		var mouseX = YAHOO.util.Event.getPageX(e);
		if(YAHOO.util.Dom.getX(dropEl)){
			mouseX = mouseX - YAHOO.util.Dom.getX(dropEl);
		}
		var mouseY = YAHOO.util.Event.getPageY(e);
		if(YAHOO.util.Dom.getY(dropEl)){
			mouseY = mouseY - YAHOO.util.Dom.getY(dropEl);
		}

		var dragEl = this.getEl();

		if (dd.hideDuringDrag) {
			dragEl.style.display = "block";
		}

		var el = dropEl;//dd.dropZone.getEl();
		var parent = node.parentNode;
		if (dd.applyDropCss) {
			if (dd.overBeforeClass != null &&  dd.overAfterClass != null) {
				el.style.paddingTop = "0px";
				SweetDevRia.DomHelper.removeClassName(el, dd.overBeforeClass);
				
				el.style.paddingBottom = "0px";
				SweetDevRia.DomHelper.removeClassName(el, dd.overAfterClass);
			}
		}

		if (insertMode == SweetDevRia.DD.HORIZONTAL_INSERT) {
			var width = SweetDevRia.DomHelper.getWidth (el);
	
			if (mouseX < width/2) {
				parent.insertBefore (dragEl, el);
			}
			else {
				var nextNode = el.nextSibling;
				while(nextNode && nextNode.nodeName.toLowerCase() != el.nodeName.toLowerCase()) {nextNode = nextNode.nextSibling;}
				if (nextNode) {
					parent.insertBefore (dragEl, nextNode);
				}
				else {
					parent.appendChild (dragEl);
				}
			}
		}
		else if (insertMode == SweetDevRia.DD.VERTICAL_INSERT) {
			var height = SweetDevRia.DomHelper.getHeight (el);
	
			if (mouseY < height/2) {
				parent.insertBefore (dragEl, el);
			}
			else {
				var nextNode = el.nextSibling;
				while(nextNode && nextNode.nodeName.toLowerCase() != el.nodeName.toLowerCase()) {nextNode = nextNode.nextSibling;}
				if (nextNode) {
					parent.insertBefore (dragEl, nextNode);
				}
				else {
					parent.appendChild (dragEl);
				}
			}
		}
		else if (insertMode == SweetDevRia.DD.NONE_INSERT) {
			if(parent!=dragEl.parentNode){
				parent.appendChild (dragEl);
			}
			var xy = SweetDevRia.DomHelper.getXY (cloneContainer);
			SweetDevRia.DomHelper.setXY (dragEl, xy);
			//SWTRIA-1365
			//cette methode utilise un cache et ne tiens pas compte du #ygddfdiv(z-index:999) 
			dragEl.style.zIndex = SweetDevRia.DisplayManager.getInstance().getTopZIndex();
		}
		else if (insertMode == SweetDevRia.DD.NONE) {
			null;//JSLint null
		}
	
		var xy = [mouseX, mouseY]; //SweetDevRia.DomHelper.getXY (cloneContainer);
		dd.onDragDrop (dd.dropZone, xy);
		
		if (dd.dropZone) {
			dd.dropZone.onDrop (dd, xy);
		}
		cloneContainer.style.display = "none";//JSLINT ok ?
	};
	//cloneContainer.style.display = "none";//JSLINT ok ?
};

SweetDevRia.DD.prototype.onDragEnterGlobal = function(dd){
	return function(e, id){
		e = SweetDevRia.EventHelper.getEvent (e);

		var dropEl = SweetDevRia.DomHelper.get (id);
		dd.dropZone = YAHOO.util.DragDropMgr.getDDById (id).dd;

		var mouseX = YAHOO.util.Event.getPageX(e) - YAHOO.util.Dom.getX(dropEl);
		var mouseY = YAHOO.util.Event.getPageY(e) - YAHOO.util.Dom.getY(dropEl);

		var iconContainer = document.getElementById (dd.id+"_icon");

		if (dd.outClass != null) {
			SweetDevRia.DomHelper.removeClassName(iconContainer, dd.outClass);
			dd.outClass = null;
		}
		
		dd.onDragEnter (dd.dropZone);
		
		if (dd.dropZone) {
			dd.dropZone.onDropEnter (dd);
		}
		
	};
};

SweetDevRia.DD.prototype.onDragOverGlobal = function(dd){
	return function(e, id){
		e = SweetDevRia.EventHelper.getEvent (e);

		var dropEl = SweetDevRia.DomHelper.get (id);
		dd.dropZone = YAHOO.util.DragDropMgr.getDDById (id).dd;

		var mouseX = YAHOO.util.Event.getPageX(e) - YAHOO.util.Dom.getX(dropEl);
		var mouseY = YAHOO.util.Event.getPageY(e) - YAHOO.util.Dom.getY(dropEl);

		if (dd.dropZone) {
			var iconClass = dd.dropZone.getDropEnterIconClass (dd, [mouseX, mouseY]);
		}
		var iconContainer = document.getElementById (dd.id+"_icon");

		if (dd.outClass != null) {
			SweetDevRia.DomHelper.removeClassName(iconContainer, dd.outClass);
			dd.outClass = null;
		}
		if (dd.enterClass != null) {
			SweetDevRia.DomHelper.removeClassName(iconContainer, dd.enterClass);
			dd.enterClass = null;
		}
		if (! SweetDevRia.DomHelper.hasClassName(iconContainer, iconClass)) {
			SweetDevRia.DomHelper.addClassName(iconContainer, iconClass);
			dd.enterClass = iconClass;
		}
		
		if (dd.dropZone) {
			if (dd.dropZone.insertMode == SweetDevRia.DD.HORIZONTAL_INSERT) {
				var el = dd.dropZone.getEl();
				var width = SweetDevRia.DomHelper.getWidth (el);
		
				if (dd.overBeforeClass != null &&  dd.overAfterClass != null) {
					if (mouseX < width/2) {
						SweetDevRia.DomHelper.addClassName(el, dd.overBeforeClass);
						SweetDevRia.DomHelper.removeClassName(el, dd.overAfterClass);
					}
					else {
						SweetDevRia.DomHelper.addClassName(el, dd.overAfterClass);
						SweetDevRia.DomHelper.removeClassName(el, dd.overBeforeClass);
					}
				}
			}
			else if (dd.dropZone.insertMode == SweetDevRia.DD.VERTICAL_INSERT) {
				var el = dd.dropZone.getEl();
				var height = SweetDevRia.DomHelper.getHeight (el);
		
				if (dd.overBeforeClass != null &&  dd.overAfterClass != null) {
					if (mouseY < height/2) {
						el.style.paddingTop = (dd.height/2)+"px";
						el.style.paddingBottom = "0px";
						SweetDevRia.DomHelper.addClassName(el, dd.overBeforeClass);
						SweetDevRia.DomHelper.removeClassName(el, dd.overAfterClass);
					}
					else {
						el.style.paddingTop = "0px";
						el.style.paddingBottom = (dd.height/2)+"px";
						SweetDevRia.DomHelper.addClassName(el, dd.overAfterClass);
						SweetDevRia.DomHelper.removeClassName(el, dd.overBeforeClass);
					}
				}
			}
		
			dd.onDragOver (dd.dropZone, [mouseX, mouseY]);
		
			dd.dropZone.onDropOver (dd, [mouseX, mouseY]);
		}
	};
};


SweetDevRia.DD.prototype.onDragOutGlobal = function(dd){
	return function(e,id){
		e = SweetDevRia.EventHelper.getEvent (e);

		var dropEl = SweetDevRia.DomHelper.get (id);
		dd.dropZone = YAHOO.util.DragDropMgr.getDDById (id).dd;

		var el = dd.dropZone.getEl();

		var iconClass = dd.dropZone.getDropOutIconClass (dd);
		var iconContainer = document.getElementById (dd.id+"_icon");

		if (dd.enterClass != null) {
			SweetDevRia.DomHelper.removeClassName(iconContainer, dd.enterClass);
			dd.enterClass = null;
		}
				
		if (! SweetDevRia.DomHelper.hasClassName(iconContainer, iconClass)) {
			SweetDevRia.DomHelper.addClassName(iconContainer, iconClass);
			dd.outClass = iconClass;
		}

		if (dd.dropZone.insertMode == SweetDevRia.DD.VERTICAL_INSERT || dd.insertMode == SweetDevRia.DD.HORIZONTAL_INSERT) {
			if (dd.overBeforeClass != null &&  dd.overAfterClass != null) {
				el.style.paddingTop = "0px";
				el.style.paddingBottom = "0px";
				SweetDevRia.DomHelper.removeClassName(el, dd.overBeforeClass);
				SweetDevRia.DomHelper.removeClassName(el, dd.overAfterClass);
			}
		}

		dd.onDragOut (dd.dropZone);

		dd.dropZone.onDropOut (dd);

		dd.dropZone = null;
	};
};

SweetDevRia.DD.prototype.getEl = function(dd){
	return this.objDD.getEl();
};

