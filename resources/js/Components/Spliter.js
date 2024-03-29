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
* @class Spliter
* @constructor
* @param {String} id 		the id of the spliter
* @param {String} minSize 	the minimal size for this spliter
* @private
*/
SweetDevRia.Spliter = function(id,minSize,height){
	this.id = id;
    this.node = null;
    this.previousNode = null;
    this.nextNode = null;
    this.minimalSize = minSize;

	this.customHeight = "100%";
	if(this.customHeight!=undefined){
    	this.customHeight = height;  
    }  	
	
	this.layoutId = null;
	
	// if shift is true, the splitter shift the nextNode, if false, the splitter will decrease the nextNode height
	this.shift = false;
	
	this.init(id);
	superClass (this, SweetDevRia.RiaComponent, id, SweetDevRia.Spliter.prototype.className);	
};
YAHOO.extend(SweetDevRia.Spliter, YAHOO.util.DragDrop);
extendsClass(SweetDevRia.Spliter, SweetDevRia.RiaComponent);

/**
* Override this function triggered on resize start
*/
SweetDevRia.Spliter.prototype.onSplitStart = function(){
};

/**
* Override this function triggered on resize
*/
SweetDevRia.Spliter.prototype.onSplit = function(){
};

/**
* Override this function triggered on resize end
*/
SweetDevRia.Spliter.prototype.onSplitEnd = function(){
};


SweetDevRia.Spliter.prototype.className = "SweetDevRia.Spliter";

/**
* Return the main html node of this component
* @return the main html node of this component
* @type HTMLElement
* @private
*/
SweetDevRia.Spliter.prototype.getNode = function() {
    if(this.node===null){
    	this.node = document.getElementById(this.id);
    }
    return this.node;
};

/**
* Return the previous html node from this component (previousSibling)
* @return the previous html node from this component 
* @type HTMLElement
* @private
*/
SweetDevRia.Spliter.prototype.getPreviousNode = function() {
    if(this.previousNode===null) {
        this.previousNode = this.getNode().previousSibling;
        while(this.previousNode.tagName == undefined){
            this.previousNode = this.previousNode.previousSibling;
        }
    }
    return this.previousNode;
};

/**
* Return the next html node from this component (nextSibling)
* @return the next html node from this component 
* @type HTMLElement
* @private
*/
SweetDevRia.Spliter.prototype.getNextNode = function() {
	
	if (this.shift){
		return null;
	}
	
    if(this.nextNode===null) {
        this.nextNode = this.getNode().nextSibling;
        while(this.nextNode.tagName == undefined){
            this.nextNode = this.nextNode.nextSibling;
        }
    }
    return this.nextNode;
};

//SweetDevRia.Spliter.prototype.minimalSize = 50;
SweetDevRia.Spliter.prototype.formatJSFId = function (id){
	return id.substr(0,id.length-5);
};

/**
* @class VerticalSpliter
* @constructor
* @param {String} id 		the id of the vertical spliter
* @param {String} minSize 	the minimal size for this vertical spliter
* @private
*/
SweetDevRia.VSpliter = function(id,minSize,height){
    SweetDevRia.VSpliter.superclass.constructor.call(this, id , minSize, height);
};
YAHOO.extend(SweetDevRia.VSpliter, SweetDevRia.Spliter);
/**
* @private
*/
SweetDevRia.VSpliter.prototype.onMouseDown = function(e) {
    this.startPosX = SweetDevRia.DomHelper.getX(this.getNode());  
	this.previousNode = this.getPreviousNode();
	
	this.previousBorder = parseInt(SweetDevRia.DomHelper.getStyle(this.getPreviousNode(),"borderRightWidth").split('px')[0], 10)+
		parseInt(SweetDevRia.DomHelper.getStyle(this.getPreviousNode(),"borderLeftWidth").split('px')[0], 10);
	
	if( isNaN(this.previousBorder) ){
		this.previousBorder = 0;	
	}	
	
	this.previousWidth = parseInt(this.previousNode.offsetWidth, 10);

	if (! this.shift) {
		this.nextNode = this.getNextNode();
		
		this.nextBorder = parseInt(SweetDevRia.DomHelper.getStyle(this.getNextNode(),"borderRightWidth").split('px')[0], 10) + 
			parseInt(SweetDevRia.DomHelper.getStyle(this.getNextNode(),"borderLeftWidth").split('px')[0], 10);
    			
    	if( isNaN(this.nextBorder) ){
			this.nextBorder = 0;
		}
		
		this.nextWidth = parseInt(this.nextNode.offsetWidth, 10);
	}

    this.onSplitStart();
};

/**
* @private
*/
SweetDevRia.VSpliter.prototype.onDrag = function(e) {
    var newPosX = YAHOO.util.Event.getPageX(e);
    var offsetX = newPosX - this.startPosX - this.scrollLeft;
    
	// srevel : si on laisse le scrollleft, tt est decale lors du scroll
	offsetX = newPosX - this.startPosX;

	var previousSize = this.previousWidth + offsetX;


//SweetDevRia.log.debug ("onDrag :: "+previousSize+" :: "+this.minimalSize);

    if(previousSize < this.minimalSize) {
    	previousSize = this.minimalSize;
    }
    
	if (! this.shift) {
		var nextNode = this.getNextNode();
		var nextSize = this.nextWidth - offsetX;
	    if(nextSize>this.minimalSize){
	        this.nextNode.style.width = nextSize + "px";
	        this.previousNode.style.width = previousSize + "px";
		}
	}
	else {
        this.previousNode.style.width = previousSize + "px";
	}

	
    this.onSplit();
};

/**
* @private
*/
SweetDevRia.VSpliter.prototype.onMouseUp = function(e) {
    var width = parseInt(this.getNode().parentNode.offsetWidth, 10);
    
    var previousNodeValue =  Math.round( parseInt(((parseInt(this.getPreviousNode().offsetWidth, 10)-this.previousBorder) / width) * 10000 - 1, 10) / 100 );
    var nextNodeValue =  Math.round( parseInt(((parseInt(this.getNextNode().offsetWidth, 10)-this.nextBorder) / width) * 10000 - 1, 10) / 100 );
 
    this.getPreviousNode().style.width = previousNodeValue + "%";
	
	if (! this.shift){
		while(previousNodeValue+nextNodeValue>=98){//TODO compute the 98
			nextNodeValue --;
		}
		this.getNextNode().style.width = nextNodeValue + "%";
	}
	
    var oldId = this.id;
    this.id = this.formatJSFId(this.getPreviousNode().id);
    this.updateServerModel ("width", this.getPreviousNode().style.width);
	
	if (! this.shift) {
	    this.id = this.formatJSFId(this.getNextNode().id);
	    this.updateServerModel ("width", this.getNextNode().style.width);
	}
	
    this.id = oldId;

    this.onSplitEnd();    
};


SweetDevRia.VSpliter.prototype.scrollLeft = 0;

SweetDevRia.VSpliter.prototype.getScrollLeft = function(){
	return this.scrollLeft;
};

SweetDevRia.VSpliter.prototype.setScrollLeft = function(scrollLeft){
	this.scrollLeft = scrollLeft;
};

SweetDevRia.VSpliter.prototype.resizeAllSpliters  = function() {
	if ( this.layoutId && this.customHeight.indexOf("%")!=-1 ){
		var height = (SweetDevRia.DomHelper.getClientHeight ()*(parseInt(this.customHeight.split('%')[0], 10)/100))+"px";
	}
	else {
		var height = SweetDevRia.DomHelper.getClientHeight ()+"px";
	}

	if ( this.layoutId ) {
		var spliterLayout = SweetDevRia.DomHelper.get(this.layoutId);
		spliterLayout.style.height = height;
	}
};

SweetDevRia.VSpliter.prototype.initialize = function(){
	var spliter = this;
	
	if (SweetDevRia.VSpliter.areAllResized != true && SweetDevRia.VSpliter.mainSplitter == this.layoutId) {
		SweetDevRia.EventHelper.addListener (window, "resize", function () {
			spliter.resizeAllSpliters ();
		});
		
		spliter.resizeAllSpliters ();
		
		SweetDevRia.VSpliter.areAllResized = true;
	}
};

/**
* @class HorizontalSpliter
* @constructor
* @param {String} id 		the id of the horizontal spliter
* @param {String} minSize 	the minimal size for this horizontal spliter
* @private
*/
SweetDevRia.HSpliter = function(id,minSize){
    SweetDevRia.HSpliter.superclass.constructor.call(this, id , minSize);
};
YAHOO.extend(SweetDevRia.HSpliter, SweetDevRia.Spliter);
/**
* @private
*/
SweetDevRia.HSpliter.prototype.onMouseDown = function(e) {
    this.startPosY = SweetDevRia.DomHelper.getY(this.getNode());  
	this.previousNode = this.getPreviousNode();
	this.previousHeight = parseInt(this.previousNode.offsetHeight, 10);
	
	if (! this.shift) {
		this.nextNode = this.getNextNode();
		this.nextHeight = parseInt(this.nextNode.offsetHeight, 10);
	}

    this.onSplitStart();
};

SweetDevRia.HSpliter.prototype.onDrag = function(e) {
    var newPosY = YAHOO.util.Event.getPageY(e);
    var offsetY = newPosY - this.startPosY - this.scrollTop;

	var previousSize = this.previousHeight + offsetY;
    if(previousSize < this.minimalSize) {
	    previousSize = this.minimalSize;
    }

	if (! this.shift) {
		var nextNode = this.getNextNode();
		var nextSize = this.nextHeight - offsetY;

	    if(nextSize>this.minimalSize){
	        this.nextNode.style.height = nextSize + "px";
	        this.previousNode.style.height = previousSize + "px";
		}
	}
	else {
        this.previousNode.style.height = previousSize + "px";
	}

    this.onSplit();
};


/**
* @private
*/
SweetDevRia.HSpliter.prototype.onMouseUp = function(e) {
    var height = parseInt(this.getNode().parentNode.offsetHeight, 10);
    
    this.getPreviousNode().style.height = parseInt((parseInt(this.getPreviousNode().offsetHeight, 10) / height) * 10000, 10) / 100 + "%";
	
	if (! this.shift){
    	this.getNextNode().style.height = parseInt((parseInt(this.getNextNode().offsetHeight, 10) / height) * 10000, 10) / 100 + "%";
    }
    
    var oldId = this.id;
    this.id = this.formatJSFId(this.getPreviousNode().id);
    this.updateServerModel("height", this.getPreviousNode().style.height);
	if (! this.shift) {
	    this.id = this.formatJSFId(this.getNextNode().id);
	    this.updateServerModel ("height", this.getNextNode().style.height);
	}
	
    this.id = oldId;

    this.onSplitEnd();    
};


SweetDevRia.HSpliter.prototype.scrollTop = 0;

SweetDevRia.HSpliter.prototype.getScrollTop = function(){
	return this.scrollTop;
};

SweetDevRia.HSpliter.prototype.setScrollTop = function(scrollTop){
	this.scrollTop = scrollTop;
};



