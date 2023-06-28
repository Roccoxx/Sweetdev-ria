/**
 * 
 * TODO 
 * _ faire passer devant les autres sur un click
 */


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
 * This is the Border component class
 * @param {String} id Id of this list
 * @constructor
 * @extends SweetDevRia.DD
 * @base SweetDevRia.DD
 */
SweetDevRia.Frame = function(id){
	if (! id) {return}

	superClass (this, SweetDevRia.DD, id);

	this.contentId = null;
	this.showBorderOnOver = false;
	this.resizeMode = SweetDevRia.Frame.RESIZE_MODE_NONE;
	this.borderMode = SweetDevRia.Frame.BORDER_MODE_ALL;

	//@see RiaComponent
	//this.borderSize = 5;
	this.cssClassBase = "ideo-bdr-";
	
	this.borderType = SweetDevRia.Frame.BORDER_TYPE;

	// dragdrop
	this.dragId = id+"_border";  
	this.displayIcon = false;
	this.hideDuringDrag = true;
	this.canDrag = false;
	this.allowDocumentDrop = true;

	SweetDevRia.unregister (this);
	this.className = "SweetDevRia.Frame";
	SweetDevRia.register (this);

	// TODO  faire les attributs sur le tag
	this.minHeight = null;
	this.maxHeight = null;
	this.minWidth = null;
	this.maxWidth = null;
	this.constraintId = null;
	
	this.height = 0;
	this.width = 0;	
	
	
	this.maskId = this.id+'_mask';
};

extendsClass(SweetDevRia.Frame, SweetDevRia.DD);
extendsClass(SweetDevRia.Frame, SweetDevRia.FrameNude);

SweetDevRia.Frame.BORDER_TYPE = "fine";

SweetDevRia.Frame.RESIZE_MODE_NONE = 0;
SweetDevRia.Frame.RESIZE_MODE_ALL = 1;
SweetDevRia.Frame.RESIZE_MODE_SE = 2;

SweetDevRia.Frame.BORDER_MODE_NONE = 0;
SweetDevRia.Frame.BORDER_MODE_ALL = 1;
SweetDevRia.Frame.BORDER_MODE_SE = 2;

SweetDevRia.Frame.BORDER_IDS = {"north": "N", "south":"S", "east":"E", "west":"W", "southwest":"SW", "southeast":"SE", "northwest":"NW", "northeast":"NE"};

SweetDevRia.Frame.FRAME_SUFFIX = "_frame";


SweetDevRia.Frame.reloadAllFrames = function(){
	var frames = SweetDevRia.getInstances ("SweetDevRia.Frame");
	if (frames) {
		for(var i=0;i<frames.length;++i){
			var frame = SweetDevRia.$(frames[i]);
			
			if (frame.initialized) {
				frame.refreshBorders ();
			}
		}
	}
};

SweetDevRia.EventHelper.addListener (window, "load", function(){
					SweetDevRia.startLog ("Log.Onload",null, RiaTimer.SUM);
					SweetDevRia.Frame.reloadAllFrames();
					SweetDevRia.endLog ("Log.Onload");
				});
SweetDevRia.EventHelper.addListener (window, "resize", SweetDevRia.Frame.reloadAllFrames);



SweetDevRia.Frame.getFrameId = function(componentId){
	return componentId+SweetDevRia.Frame.FRAME_SUFFIX;
};

/**
 * To be overridden !!
 */
SweetDevRia.Frame.prototype.afterResizing = function () {
};

/**
 * To be overridden !!
 */
SweetDevRia.Frame.prototype.beforeResizing = function () {
};

/**
 * To be overridden !!
 */
SweetDevRia.Frame.prototype.onResize = function () {
};

/**
 * This event type is fired when resize the frame
 */
SweetDevRia.Frame.RESIZE_EVENT = "resize";


/**
 * To be overridden !!
 */
SweetDevRia.Frame.prototype.setWidth = function (width) {
	if (width >= 0) {
		var content = document.getElementById (this.contentId);
		content.style.width = width+"px"; 
		document.getElementById (this.id+"_scrollBorder").style.width = width+"px";
		document.getElementById (this.id+"_border").style.width = width+"px";
		
		this.width = width;
		
		return true; 
	}
	
	return false;
};

/**
 * To be overridden !!
 */
SweetDevRia.Frame.prototype.setHeight = function (height) {
	if (height >= 0) {
		var content = document.getElementById (this.contentId);
		content.style.height = height+"px"; 
		
		this.height = height;
		
		return true; 
	}
	
	return false;
};

SweetDevRia.Frame.prototype.getWidth = function (width) {
	return this.width;
};

SweetDevRia.Frame.prototype.getHeight = function (height) {
	return this.height;
};

SweetDevRia.Frame.prototype.getMain = function () {
	return document.getElementById (this.getMainAbsoluteId());
};

SweetDevRia.Frame.prototype.getMainAbsoluteId = function () {
	return this.id+"_border";
};

SweetDevRia.Frame.prototype.isNude = function(){
	return false;
};

SweetDevRia.Frame.prototype.getMinHeight =  function () {
	return this.minHeight;
};

SweetDevRia.Frame.prototype.getMaxHeight =  function () {
	return this.maxHeight;
};

SweetDevRia.Frame.prototype.getMinWidth =  function () {
	return this.minWidth;
};

SweetDevRia.Frame.prototype.getMaxWidth =  function () {
	return this.maxWidth;
};


SweetDevRia.Frame.prototype.superInitialize = SweetDevRia.DD.prototype.initialize;
/**
 * This method is automatically called at the page load
 * @private
 */
SweetDevRia.Frame.prototype.initialize = function () {
	var border = this;

	function startDragAction () {
		var borderElem = document.getElementById (border.getMainAbsoluteId()); 
		this.startX = SweetDevRia.DomHelper.getX (borderElem);
		this.startY = SweetDevRia.DomHelper.getY (borderElem);
		this.startHeight = SweetDevRia.DomHelper.getHeight (borderElem);
		this.startWidth = SweetDevRia.DomHelper.getWidth (borderElem);
		border.blockHiding = true;
		border.beforeResizing();
	}
	function endDragAction () {		
		this.startX = 0;
		this.startY = 0;
		this.isInit = false;
		border.blockHiding = false;

		this.fireEventListener (SweetDevRia.Frame.RESIZE_EVENT);

		border.afterResizing();
	}
	function dragAction () {
		this.specificDragAction ();
		border.refreshBorders ();
		YAHOO.util.DragDropMgr.locationCache = {};
		border.showBorders ();
		border.onResize();
		border.blockHiding = true;
	}
	function createBorderDrag (borderId, constraintType, specificDragAction) {
		var borderElem = document.getElementById (border.contentId+"_"+borderId); 
		if (borderElem) {
			var borderDrag = new SweetDevRia.DD (border.id+"drag"+borderId);

			//the iframe must be set under the main dragging element
			if(border.canDrag){
				borderDrag.getIFrameObjIdUnder = function () {
					return border.getMainAbsoluteId();
				};
			}
			borderDrag.setDragId (border.contentId+"_"+borderId);  
			borderDrag.setFakeMode (SweetDevRia.DD.NONE);
			borderDrag.constraintType = constraintType;
			borderDrag.onStartDrag = startDragAction;
			borderDrag.onEndDrag = endDragAction;
			borderDrag.onDrag = dragAction; 
			borderDrag.specificDragAction = specificDragAction;
			
			return borderDrag;
		}

		return null;
	}

	this.createBorder ();
	
	var borderSize = 0 - this.borderSize;

	var cadreScroll = document.getElementById (this.id+"_scrollBorder");

	this.superInitialize ();
	
	if (! this.canDrag) {
		var item = SweetDevRia.DomHelper.get (this.dragId);
		if (this.handleId != null) {
			item = SweetDevRia.DomHelper.get (this.handleId);
		}
		if (item) {
			item.onselectstart = null;
			item.onselect = null;
			item.ondblclick = null;
		}
	}

	if (this.resizeMode != SweetDevRia.Frame.RESIZE_MODE_NONE) {
		var aBorder = null;
		aBorder = createBorderDrag ("east",  SweetDevRia.DD.HORIZONTAL, function () {
			var newX = SweetDevRia.DomHelper.getX (this.objDD.getDragEl());
			var borderElem = document.getElementById (border.getMainAbsoluteId()); 
			if (document.all && borderElem.style.position != "absolute") {
				border.setWidth (newX - this.startX - (2*border.borderSize) )+"px";
			}
			else  {
				border.setWidth (newX - this.startX + borderSize )+"px";
			}
		});
		aBorder.getMinX = function () {var size = border.getMinWidth (); if (size == null) {return null;} else {return 	SweetDevRia.DomHelper.getX (cadreScroll) +size;}};
		aBorder.getMaxX = function () {var size = border.getMaxWidth (); if (size == null) {return null;} else {return 	SweetDevRia.DomHelper.getX (cadreScroll) + size;}};
		
		aBorder = createBorderDrag ("south",  SweetDevRia.DD.VERTICAL, function () {
			var newY = SweetDevRia.DomHelper.getY (this.objDD.getDragEl());
			border.setHeight (newY - this.startY + borderSize );
		});
		aBorder.getMinY = function () {var size = border.getMinHeight (); if (size == null) {return null;} else {return 	SweetDevRia.DomHelper.getY (cadreScroll) + size;}};
		aBorder.getMaxY = function () {var size = border.getMaxHeight (); if (size == null) {return null;} else {return 	SweetDevRia.DomHelper.getY (cadreScroll) + size;}};
		
		aBorder = createBorderDrag ("southeast",  SweetDevRia.DD.NONE, function () {
			var newX = SweetDevRia.DomHelper.getX (this.objDD.getDragEl());
			var newY = SweetDevRia.DomHelper.getY (this.objDD.getDragEl());
			border.setHeight (newY - this.startY + borderSize );
			var borderElem = document.getElementById (border.getMainAbsoluteId()); 
			if (document.all && borderElem.style.position != "absolute") {
				border.setWidth (newX - this.startX - (2*border.borderSize) )+"px";
			}
			else  {
				border.setWidth (newX - this.startX + borderSize );
			}
		});
		aBorder.getMinX = function () {var size = border.getMinWidth (); if (size == null) {return null;} else {return 	SweetDevRia.DomHelper.getX (cadreScroll) + size;}};
		aBorder.getMaxX = function () {var size = border.getMaxWidth (); if (size == null) {return null;} else {return 	SweetDevRia.DomHelper.getX (cadreScroll) + size;}};
		aBorder.getMinY = function () {var size = border.getMinHeight (); if (size == null) {return null;} else {return 	SweetDevRia.DomHelper.getY (cadreScroll) + size;}};
		aBorder.getMaxY = function () {var size = border.getMaxHeight (); if (size == null) {return null;} else {return 	SweetDevRia.DomHelper.getY (cadreScroll) +size;}};

		if (this.resizeMode == SweetDevRia.Frame.RESIZE_MODE_ALL) {
			aBorder = createBorderDrag ("north",  SweetDevRia.DD.VERTICAL, function () {
				var borderElem = document.getElementById (border.getMainAbsoluteId()); 
				var newY = SweetDevRia.DomHelper.getY (this.objDD.getDragEl());
				if(newY<0){
					newY=0;
				}
				var ex = border.setHeight (this.startHeight + this.startY - newY - (border.borderSize*2));
				if (ex) {
					SweetDevRia.DomHelper.setY (borderElem, newY);	
				}
			});
			aBorder.getMinY = function () {var size = border.getMaxHeight (); if (size == null) {return null;} else {return SweetDevRia.DomHelper.getY (cadreScroll) + SweetDevRia.DomHelper.getHeight (cadreScroll) - size + border.borderSize;}};
			aBorder.getMaxY = function () {var size = border.getMinHeight (); if (size == null) {return null;} else {return SweetDevRia.DomHelper.getY (cadreScroll) + SweetDevRia.DomHelper.getHeight (cadreScroll) - size + border.borderSize;}};

			aBorder = createBorderDrag ("west",  SweetDevRia.DD.HORIZONTAL, function () {
				var borderElem = document.getElementById (border.getMainAbsoluteId()); 
				var newX = SweetDevRia.DomHelper.getX (this.objDD.getDragEl());
				var ex = border.setWidth (this.startWidth + this.startX - newX - (border.borderSize*2));
				if (ex) {
					SweetDevRia.DomHelper.setX (borderElem, newX);
				}
			});
			aBorder.getMinX = function () {var size = border.getMaxWidth (); if (size == null) {return null;} else {return SweetDevRia.DomHelper.getX (cadreScroll) + SweetDevRia.DomHelper.getWidth (cadreScroll) - size + border.borderSize;}};
			aBorder.getMaxX = function () {var size = border.getMinWidth (); if (size == null) {return null;} else {return SweetDevRia.DomHelper.getX (cadreScroll) + SweetDevRia.DomHelper.getWidth (cadreScroll) - size + border.borderSize;}};

			aBorder = createBorderDrag ("northeast",  SweetDevRia.DD.NONE, function () {
				var borderElem = document.getElementById (border.getMainAbsoluteId()); 
				var newX = SweetDevRia.DomHelper.getX (this.objDD.getDragEl());
				var newY = SweetDevRia.DomHelper.getY (this.objDD.getDragEl());
				if(newY<0){
					newY=0;
				}
				border.setWidth (newX - this.startX + borderSize );
				var ex = border.setHeight (this.startHeight + this.startY - newY);
				if (ex) {
					SweetDevRia.DomHelper.setY (borderElem, newY);
				}
			});
			aBorder.getMinY = function () {var size = border.getMaxHeight (); if (size == null) {return null;} else {return SweetDevRia.DomHelper.getY (cadreScroll) + SweetDevRia.DomHelper.getHeight (cadreScroll) - size + border.borderSize;}};
			aBorder.getMaxY = function () {var size = border.getMinHeight (); if (size == null) {return null;} else {return SweetDevRia.DomHelper.getY (cadreScroll) + SweetDevRia.DomHelper.getHeight (cadreScroll) - size + border.borderSize;}};
			aBorder.getMinX = function () {var size = border.getMinWidth (); if (size == null) {return null;} else {return 	SweetDevRia.DomHelper.getX (cadreScroll) + size;}};
			aBorder.getMaxX = function () {var size = border.getMaxWidth (); if (size == null) {return null;} else {return 	SweetDevRia.DomHelper.getX (cadreScroll) + size;}};

			aBorder = createBorderDrag ("northwest",  SweetDevRia.DD.NONE, function () {
				var borderElem = document.getElementById (border.getMainAbsoluteId()); 
				var newX = SweetDevRia.DomHelper.getX (this.objDD.getDragEl());
				var newY = SweetDevRia.DomHelper.getY (this.objDD.getDragEl());
				if(newY<0){
					newY=0;
				}
				var ex = border.setWidth (this.startWidth + this.startX - newX);
				if (ex) {
					SweetDevRia.DomHelper.setX (borderElem, newX);
				}
				var ex = border.setHeight (this.startHeight + this.startY - newY);
				if (ex) {
					SweetDevRia.DomHelper.setY (borderElem, newY);
				}
			});
			aBorder.getMinY = function () {var size = border.getMaxHeight (); if (size == null) {return null;} else {return SweetDevRia.DomHelper.getY (cadreScroll) + SweetDevRia.DomHelper.getHeight (cadreScroll) - size + border.borderSize;}};
			aBorder.getMaxY = function () {var size = border.getMinHeight (); if (size == null) {return null;} else {return SweetDevRia.DomHelper.getY (cadreScroll) + SweetDevRia.DomHelper.getHeight (cadreScroll) - size + border.borderSize;}};
			aBorder.getMinX = function () {var size = border.getMaxWidth (); if (size == null) {return null;} else {return SweetDevRia.DomHelper.getX (cadreScroll) + SweetDevRia.DomHelper.getWidth (cadreScroll) - size + border.borderSize;}};
			aBorder.getMaxX = function () {var size = border.getMinWidth (); if (size == null) {return null;} else {return SweetDevRia.DomHelper.getX (cadreScroll) + SweetDevRia.DomHelper.getWidth (cadreScroll) - size + border.borderSize;}};

			aBorder = createBorderDrag ("southwest",  SweetDevRia.DD.NONE, function () {
				var borderElem = document.getElementById (border.getMainAbsoluteId()); 
				var newX = SweetDevRia.DomHelper.getX (this.objDD.getDragEl());
				var newY = SweetDevRia.DomHelper.getY (this.objDD.getDragEl());
				border.setHeight (newY - this.startY + borderSize );
				var ex = border.setWidth (this.startWidth + this.startX - newX);
				if (ex) {
					SweetDevRia.DomHelper.setX (borderElem, newX);
				}
			});
			aBorder.getMinY = function () {var size = border.getMinHeight (); if (size == null) {return null;} else {return 	SweetDevRia.DomHelper.getY (cadreScroll) + size;}};
			aBorder.getMaxY = function () {var size = border.getMaxHeight (); if (size == null) {return null;} else {return 	SweetDevRia.DomHelper.getY (cadreScroll) + size;}};
			aBorder.getMaxWidth = function () {var size = border.getMaxWidth (); if (size == null) {return null;} else {return SweetDevRia.DomHelper.getX (cadreScroll) + SweetDevRia.DomHelper.getWidth (cadreScroll) - size + border.borderSize;}};
			aBorder.getMaxX = function () {var size = border.getMinWidth (); if (size == null) {return null;} else {return SweetDevRia.DomHelper.getX (cadreScroll) + SweetDevRia.DomHelper.getWidth (cadreScroll) - size + border.borderSize;}};
		}
	}

	if (this.constraintId) {
		for (var id in SweetDevRia.Frame.BORDER_IDS) {
			if (SweetDevRia.$ (this.id+"drag"+id)) {
				SweetDevRia.$ (this.id+"drag"+id).constraintId = this.constraintId;
			}
		}
	}

	this.initialized = true;
};


SweetDevRia.Frame.prototype.setConstraintId = function (constraintId) {
	this.constraintId = constraintId;
};

SweetDevRia.Frame.prototype.refreshBorder = function (id, width, height, top, left) {
	var border = document.getElementById (this.contentId+"_"+id); 

	//fix bug on IE : getting width and height from display:'none' elements.
	if (border && width!=null && height!=null) {
		border.style.width = width+"px";
		border.style.height = height+"px";
		border.style.top = top+"px";
		border.style.left = left+"px";
		
		this.refreshIframeMask();
	}
};

//TODO chercher un autre moyen de differencier la height a utiliser (getHeight pour Frame et scroll pour Grid)
SweetDevRia.Frame.prototype.refreshBorders = function (grid) {
	var content = document.getElementById (this.contentId);
	
	var width = content.offsetWidth; // SWTRIA-1040
	if(width == null){
		width = SweetDevRia.DomHelper.getWidth (content) ;	
	}
	
	//var width = SweetDevRia.DomHelper.getWidth (content) ;
	var height = 0;
	if(!grid){
		height = SweetDevRia.DomHelper.getHeight (content);
	}
	else{
		height = content.scrollHeight;
	}

	this.refreshBorder ("north", width, this.borderSize, 0, this.borderSize);
	this.refreshBorder ("south", width, this.borderSize, height+this.borderSize, this.borderSize);
	this.refreshBorder ("east", this.borderSize, height, this.borderSize, width + this.borderSize);
	this.refreshBorder ("west", this.borderSize, height, this.borderSize, 0);
	this.refreshBorder ("southwest", this.borderSize, this.borderSize, height + this.borderSize, 0);
	this.refreshBorder ("southeast", this.borderSize, this.borderSize, height + this.borderSize, width + this.borderSize);
	this.refreshBorder ("northwest", this.borderSize, this.borderSize, 0, 0);
	this.refreshBorder ("northeast", this.borderSize, this.borderSize, 0, width + this.borderSize);
	
	if(document.getElementById(this.id+"_border")!=null){
		
		document.getElementById(this.id+"_border").style.height = height + "px"; // SWTRIA-1251
		//document.getElementById(this.id+"_border").style.width  = document.getElementById(this.contentId).scrollWidth  + "px"; //Bug SWTRIA-924 
	}
};

SweetDevRia.Frame.prototype.showBorder = function (id) {
	var border = document.getElementById (this.contentId+"_"+id); 
	if (border) {
		SweetDevRia.DomHelper.addClassName(border, this.cssClassBase+this.borderType+SweetDevRia.Frame.BORDER_IDS [id]);
		border.style.display="";
	}
};

SweetDevRia.Frame.prototype.showBorders = function () {
	for (var id in SweetDevRia.Frame.BORDER_IDS) {
		if (id != "toJSONString") {
			this.showBorder (id);
		}
	}
	var cadre = document.getElementById (this.id+"_border");
	if(cadre){
		cadre.style.padding = this.borderSize+"px"; // TODO ajouter le potentiel padding existant !!
	}
};

SweetDevRia.Frame.prototype.hideBorder = function (id) {
	if (this.blockHiding) {
		return;
	}

	var border = document.getElementById (this.contentId+"_"+id); 
	if (border) {
		SweetDevRia.DomHelper.removeClassName(border, this.cssClassBase+this.borderType+SweetDevRia.Frame.BORDER_IDS [id]);
		border.style.display="none";
	}
};

SweetDevRia.Frame.prototype.hideBorders = function () {
	if (this.blockHiding) {
		return;
	}

	for (var id in SweetDevRia.Frame.BORDER_IDS) {
		if (id != "toJSONString") {
			this.hideBorder (id);
		}
	}
	var cadre = document.getElementById (this.id+"_border");
	if(cadre){
		cadre.style.padding = "0px"; // TODO ajouter le potentiel padding existant !!
	}
};


SweetDevRia.Frame.prototype.isVisible = function () {
	var visible = false;

	for (var id in SweetDevRia.Frame.BORDER_IDS) {
		var border = document.getElementById (this.contentId+"_"+id); 
		if (border) {
			visible = visible || (border.style.display != "none");
		}
	}

	return visible;
};



SweetDevRia.Frame.prototype.createBorder = function () {

	function createDiv (divParent, divId, divClass) {
		var div = document.createElement ("div");
		div.id = divId;
		div.style.position = "absolute";
		div.className = divClass;
		div.innerHTML = "&nbsp;";
		divParent.appendChild (div);
		return div;
	}

	var content = document.getElementById (this.contentId);

	if(!content){
		SweetDevRia.log.error('The id provided as content of the Frame is invalid :'+this.contentId);
		return;
	}

	var cadre = document.createElement ("div");
	cadre.id = this.id+"_border";
	
	var cadreScroll = document.createElement ("div");
	cadreScroll.id = this.id+"_scrollBorder";

	cadre.style.position = content.style.position;
	if (content.style.position == "") {
		cadre.style.position = "relative"; 	
	}

	cadre.style.top = content.style.top;
	cadre.style.left = content.style.left;
	//SWTRIA-1243
	//le z-index augmente pour chaque nouvelle Frame
	var zIndex = content.style.zIndex;
	if(!zIndex){
		zIndex = SweetDevRia.DisplayManager.getInstance().getTopZIndex();
	}
	cadre.style.zIndex = zIndex;
	
	//cadre.style.display="inline-block"; //SWTRIA-924

	content.parentNode.insertBefore (cadre, content);

	content.style.position = "relative";
	content.style.top = "0px";
	content.style.left = "0px";		
	
	cadreScroll = cadre.appendChild (cadreScroll);	

	content = cadreScroll.appendChild (content);	

	for (var id in SweetDevRia.Frame.BORDER_IDS) {
		if (id != "toJSONString") {
	
			// We display only borders specified by the borderMode property
			if (
				(this.borderMode == SweetDevRia.Frame.BORDER_MODE_ALL) || 
				(this.borderMode == SweetDevRia.Frame.BORDER_MODE_SE && (id == "south" || id == "east" || id == "southeast")) ) {
				var cssClass = "ideo-bdr-main ";
		
				// We display the dragdrop cursor only on borders specified by the resizeMode property
				if (
					(this.resizeMode == SweetDevRia.Frame.RESIZE_MODE_ALL) || 
					(this.resizeMode == SweetDevRia.Frame.RESIZE_MODE_SE && (id == "south" || id == "east" || id == "southeast")) ) {
					cssClass += "ideo-bdr-"+id;
				}
				
				var div = createDiv (cadre, this.contentId+"_"+id, cssClass);
		
				if (this.showBorderOnOver) {
					var border = this;
					SweetDevRia.EventHelper.addListener (div, "mouseover", function () {
						border.showBorders ();
					});
					SweetDevRia.EventHelper.addListener (div, "mouseout", function () {
						border.hideBorders ();
					});
				}
			}
		}
	}
	
	if (! this.showBorderOnOver) {
		this.showBorders ();
	}
	
	cadre.style.padding = this.borderSize + "px"; // TODO ajouter le potentiel padding existant !!
	cadre.style.zoom = "1";
	cadre.className = "ideo-bdr-borders";
	if (browser.isIE && (browser.version < 7  || !SweetDevRia.DomHelper.hasDocType ()) ) {
//	if (browser.isIE && ! SweetDevRia.DomHelper.hasDocType ()) {
		//cadreScroll.style.paddingLeft = this.borderSize + "px"; // TODO ajouter le potentiel padding existant !!
		null;
	}

	var contentWidth = content.style.width;
	cadre.style.width = contentWidth;
	if (contentWidth.indexOf ("%") > 0) {
		content.style.width = "100%";
	}

	var contentHeight = content.style.height;
	if(contentHeight==""){
		cadre.style.height = content.clientHeight+"px";
	}
	else{
		cadre.style.height = contentHeight;
	}
	if (contentHeight.indexOf ("%") > 0) {
		content.style.height = "100%";
	}
	
	if (content.style.display == "inline" || content.nodeName.toLowerCase() == "span") {
	 	cadre.style.display = "inline";
		cadreScroll.style.display = "inline";
	}

	//cadre.style.width = content.style.width;
	//content.style.width = "100%";

	this.refreshBorders ();
};	