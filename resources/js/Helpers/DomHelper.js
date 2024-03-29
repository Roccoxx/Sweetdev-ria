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

/* 
 * @class Helper to manipulate DOM
 * @constructor
 */ 
SweetDevRia.DomHelper = function() {
	null;
};

/** Static methods */

/**
 * Get the DOM object from the specified ID
 * @param {String} elementId Id of the searched element
 * @return DOM object for @elementId
 * @type HTMLElement 
 */ 
SweetDevRia.DomHelper.get = function(elementId) {
  return YAHOO.util.Dom.get (elementId);
};

/**
 * Get X position form a DOM object
 * @param {HTMLElement} element DOM Element
 * @return X position
 * @type int
 */ 
SweetDevRia.DomHelper.getX = function(element) {
  return YAHOO.util.Dom.getX (element);
};

/**
 * Get Y position form a DOM object
 * @param {HTMLElement} element DOM Element
 * @return Y position
 * @type int
 */ 
SweetDevRia.DomHelper.getY = function(element) {
  return YAHOO.util.Dom.getY (element);
};

/**
 * Get an array wich contains X and Y positions for a DOM object
 * @param {HTMLElement} element DOM Element
 * @return Array filled with X and Y positions
 * @type Array 
 */ 
SweetDevRia.DomHelper.getXY = function(element) {
  return [SweetDevRia.DomHelper.getX (element), SweetDevRia.DomHelper.getY (element)];
};

/**
 * Modify X position for a DOM object
 * @param {HTMLElement} element DOM Element
 * @param {int} x new X position
 */ 
SweetDevRia.DomHelper.setX = function(element, x) {
	 YAHOO.util.Dom.setX (element, x);
};

/**
 * Modify Y position for a DOM object
 * @param {HTMLElement} element DOM Element
 * @param {int} y new Y position
 */ 
SweetDevRia.DomHelper.setY = function(element, y) {
	 YAHOO.util.Dom.setY (element, y);
};

/**
 * Modify X and Y position for a DOM object
 * @param {HTMLElement} element DOM Element
 * @param {Array} xy array wich should contains X and Y positions
 */ 
SweetDevRia.DomHelper.setXY = function(element, xy) {
	 YAHOO.util.Dom.setXY (element, xy);
};


/**
 * Get a style property
 * @param {HTMLElement} element DOM Element
 * @param {String} propertyName Property name to get
 * @return Property value
 * @type Object
 */ 
SweetDevRia.DomHelper.getStyle = function(element, propertyName) {
  return YAHOO.util.Dom.getStyle (element, propertyName);
};

/**
 * Set a style property
 * @param {HTMLElement} element DOM Element
 * @param {String} propertyName Property name to set
 * @param {Object} propertyValue New value to set
 */ 
SweetDevRia.DomHelper.setStyle = function(element, propertyName, propertyValue) {
  YAHOO.util.Dom.setStyle (element, propertyName, propertyValue);
};

/**
 * Get intersection area between 2 elements
 * @param elemId1 First element ID
 * @param elemId2 Secound element ID
 * @return intersection area between 2 elements, null if no intersection
 * @type int
 */
SweetDevRia.DomHelper.getIntersect = function(elemId1, elemId2) {
	/** Get 2 elements */
	var elem1 = SweetDevRia.DomHelper.get (elemId1);
	var elem2 = SweetDevRia.DomHelper.get (elemId2);
	
	/** Compare 2 regions */
	var region1 = YAHOO.util.Region.getRegion (elem1);
	var region2 = YAHOO.util.Region.getRegion (elem2);

	/** Intersections calculations */
	var intersect = region1.intersect (region2);

	/** If intersection detected, area calculation */
	if (intersect !== null) {
		var area = intersect.getArea ();
		if (area && area > 0) {
			return area;
		}
		else {
			return null;			
		}
	}
	
	return null;
};

/**
 * Test if 2 elements have a common intersection
 * @param elemId1 First element ID
 * @param elemId2 Secound element ID
 * @return True if intersection area between 2 elements, else false
 * @type boolean
 */
SweetDevRia.DomHelper.isIntersect = function(elemId1, elemId2) {
	return (DomHelper_getIntersect (elemId1, elemId2) !== null);
};

/**
 * Remove a child from a DOM element
 * @param {HTMLElement} elem Parent node
 * @param {String} childId Child node to remove
 * @return true if child node has been removed
 * @type boolean
 */
SweetDevRia.DomHelper.removeChild = function(elem, childId) {

	/** Get child */
	var child = SweetDevRia.DomHelper.getChild (elem, childId);
	
	if (child !== null) {
		/** if child has been found, removes it */
		elem.removeChild (child);
		return true;
	}

	return false;	
};

/**
 * Remove a node
 * @param {HTMLElement} elem Node to remove
 */
SweetDevRia.DomHelper.removeNode = function(elem) {
	elem.parentNode.removeChild (elem);
};

/**
 * Remove all child nodes
 * @param {Node} elem Parent node
 */
SweetDevRia.DomHelper.removeChildren = function(elem) {
	if (elem.childNodes !== null) {
		while (elem.childNodes.length) {
			SweetDevRia.DomHelper.removeNode (elem.childNodes [0]);
		}
	}
};


SweetDevRia.DomHelper.hasDocType = function() {
	var docType = document.body.parentNode.parentNode.childNodes[0].nodeValue;
	return ((docType != null) && (docType.toLowerCase().indexOf ("ctype html") >= 0));
};

/**
 * Get position number of a child node in a Tree
 * @param {HTMLElement} elem Parent node
 * @param {String} childId Child node ID
 * @param {boolean} textNode If true, textNode are used to find position, else not.
 * @return Get child node ID position, null if child node was not found
 * @type int
 */
SweetDevRia.DomHelper.getTreePos = function(elem, childId, textNode) {
	if (textNode === null) {
		textNode = false;
	}
	
	var pos = 0;		
	var children = elem.children;
	
	for (var i = 0; i < children.length; i++) {
		var child = children [i];

		/** for textNode */
		if ((child.nodeType != 3) || textNode) {
			if (child.id == childId) {
				return pos;
			}

			pos++;
		}
	}
	
	return null;
};

/**
 * Get position number of a child node in the Dom
 * @param {HTMLElement} elem Parent node
 * @param {String} childId Child node ID
 * @param {boolean} textNode If true, textNode are used to find position, else not.
 * @return Get child node ID position, null if child node was not found
 * @type int
 */
SweetDevRia.DomHelper.getDomPos = function(elem, childId, textNode) {
	if (textNode === null) {
		textNode = false;
	}
	
	var pos = 0;		
	var children = elem.childNodes;
	
	for (var i = 0; i < children.length; i++) {
		var child = children [i];

		/** for textNode */
		if ((child.nodeType != 3) || textNode) {
			if (child.id == childId) {
				return pos;
			}

			pos++;
		}
	}
	
	return null;
};

/**
 * Get a child node at a specific position
 * @param {HTMLElement} elem Parent node
 * @param {int} index the position required, starting from 0
 * @return child node, null if child node index is outofbounds
 * @type HTMLElement
 */
SweetDevRia.DomHelper.getChildAt = function(elem, index) {
	var pos = 0;
	var children = elem.childNodes;
	
	for (var i = 0; i < children.length; i++) {
		var child = children [i];

		if (child.nodeType != 3){
			if(pos == index) {
				return child;
			}
			pos++;
		}
	}
	
	return null;
};

/**
 * Get the specified child
 * @param {HTMLElement} elem Parent node
 * @param {String} childId Child node to get
 * @return return @childId
 * @type HTMLElement
 */
SweetDevRia.DomHelper.getChild = function(elem, childId) {

	/** Browse all childs */
	var children = elem.childNodes ;
	if (children !== null) {
		for (var i = 0; i < children.length; i++) {
			var child = children [i];
			
			if (child.id == childId)	 {
				return child;			
			}	
		}
	}	
	return null;	
};



/**
 * Retourne le premier fils de type @tagName
 */
SweetDevRia.DomHelper.getFirstChild = function(elem, tagName) {
	/** Browse all childs */
	var children = elem.childNodes ;
	if (children !== null) {
		for (var i = 0; i < children.length; i++) {
			var child = children [i];
			
			if (child.nodeName.toLowerCase () == tagName.toLowerCase ())	 {
				return child;			
			}	
		}
	}	
	return null;	
};

/**
 * Retourne le dernier fils de type @tagName
 */
SweetDevRia.DomHelper.getLastChild = function(elem, tagName) {
	/** Browse all childs */
	var children = elem.childNodes ;
	var last =  null;
	if (children !== null) {
		for (var i = 0; i < children.length; i++) {
			var child = children [i];
			
			if (child.nodeName.toLowerCase () == tagName.toLowerCase ())	 {
				last = child;			
			}	
		}
	}	
	return last;	
};


/**
 * Retourne le nieme fils de type @tagName
 */
SweetDevRia.DomHelper.getChildByTagName = function(elem, index, tagName) {
	/** Browse all childs */
	var children = elem.childNodes ;
	var cpt = 0;
	if (children !== null) {
		for (var i = 0; i < children.length; i++) {
			var child = children [i];
			
			if (child.nodeName.toLowerCase () == tagName.toLowerCase ())	 {
				if (cpt == index) {
					return child;
				}

				cpt ++;
			}	
		}
	}	
	return null;	
};

/**
 * Add a child to a node on a specified index
 * @param {HTMLElement} parentNode Parent node
 * @param {HTMLElement} childtoAdd Child node to add
 * @param {int} index where add the child node
 */
SweetDevRia.DomHelper.insertChildAtIndex = function(parentNode, childtoAdd, index) {
	var children = parentNode.childNodes;

	if (index < 0){
		index = 0;
	}

	/** index checks */
	if (children !== null) {
		if (index >= children.length) {
			/** If node hasn't been added, add node at the end */
			parentNode.appendChild (childtoAdd);			
		}
		else {
			/** Browse all child nodes */
			for (var i = 0; i < children.length; i++) {
				var child = children [i];

				if (index == i) {
					parentNode.insertBefore(childtoAdd, child);			
				}	
			}
		}
	}
	else {
		parentNode.appendChild (childtoAdd);			
	}
};

/**
 * Insert a child node after a given child node
 * @param {HTMLElement} parentNode Parent node
 * @param {HTMLElement} childtoAdd Child node to add
 * @param {HTMLElement} afterChild Child node to insert after
 * @return true if child node has been added, else false.
 * @type boolean
 */
SweetDevRia.DomHelper.insertAfter = function(parentNode, childtoAdd, afterChild) {
	if(!parentNode || !childtoAdd){
		return false;
	}
	
	if(afterChild.nextSibling){
		parentNode.insertBefore(childtoAdd,afterChild.nextSibling);
	}
	else{
		parentNode.appendChild(childtoAdd);
	}
	return true;
};

/**
 * Add a child node at last position
 * @param {HTMLElement} parentNode Parent node
 * @param {HTMLElement} childtoAdd Child node to add
 * @return true if child node has been added, else false.
 * @type boolean
 */
SweetDevRia.DomHelper.insertChild = function(parentNode, childtoAdd) {
	parentNode.appendChild (childtoAdd);
	return true;
};

/**
 * Add a child node at first position
 * @param {HTMLElement} parentNode Parent node
 * @param {HTMLElement} childtoAdd Child node to add
 * @return true if child node has been added, else false.
 * @type boolean
 */
SweetDevRia.DomHelper.insertChildAtFirst = function(parentNode, childtoAdd) {
	return SweetDevRia.DomHelper.insertChildAtIndex (parentNode, childtoAdd, 0);
};

/**
 * Get parent node
 * @param {HTMLElement} elem Child node
 * @return Return parent node
 * @type HTMLElement
 */
SweetDevRia.DomHelper.getParent = function(elem) {
	return elem.parentNode;
};

/**
 * Check if an ancestor exist with the given id
 * @param {HTMLElement} Child element
 * @param {string} Id to look for
 * @return boolean
 */
SweetDevRia.DomHelper.hasAncestor = function(elem,id) {
	if(elem && elem.parentNode!=null && elem.parentNode){
		var parent = elem.parentNode;
		
		while(parent!=null && parent.id!=id && parent!=document.body){
			parent = parent.parentNode;
		}
		
		return (parent && parent!=document.body);
	}
};

/**
 * Check if an ancestor exist with the given id
 * @param {HTMLElement} Child element
 * @param {string} Id to look for
 * @return boolean
 */
SweetDevRia.DomHelper.getAncestorByType = function(elem,type) {
	if(elem && elem.parentNode!=null && elem.parentNode){
		type = type.toUpperCase();
		var parent = elem.parentNode;
		
		while(parent!=null && parent.nodeName!=type && parent!=document.body){
			parent = parent.parentNode;
		}
		
		return parent!=document.body?parent:null;
	}
	return null;
};

/**
 * Get the first RIA component if it exists
 * @param {HTMLElement} Child element
 * @return boolean
 */
SweetDevRia.DomHelper.getAncestorCompId = function(elem) {
	if(elem) {
		if (elem.id && SweetDevRia.$(elem.id)){
			return SweetDevRia.$(elem.id);
		}
	
		if(elem.parentNode){
			return SweetDevRia.DomHelper.getAncestorCompId (elem.parentNode);
			
/*			
			while(parent!=null && parent.id && SweetDevRia.$(parent.id)==null && SweetDevRia.$(parent.id.split("_container")[0])==null && parent!=document.body){
				parent = parent.parentNode;
			}
			
			if(parent && parent.id){
				var comp = SweetDevRia.$(parent.id) || SweetDevRia.$(parent.id.split("_container")[0]);
				if(comp){
					return comp.id;
				}
			}
*/
		}
	}
	
	return null;
};

/**
 * Remove 'px' and get numeric value (i.e. '12px' => 12)
 * @param {String} value Value to parse
 * @return numeric value
 * @type int
 */
SweetDevRia.DomHelper.parsePx = function(value) {
	if (typeof (value) == "string") {
		value = value.toLowerCase ();
		var index = value.indexOf ("px");
		if (index >= 0) {
			value = value.substring(0, index);				
		}
		value = parseFloat (value, 10);
	}
	
	return value;
};


SweetDevRia.DomHelper.parseEx = function(value) {
	if (typeof (value) == "string") {
		value = value.toLowerCase ();
		var index = value.indexOf ("ex");
		if (index >= 0) {
			value = value.substring(0, index);				
		}
		value = parseInt (value, 10);
	}
	
	return value;
};

/**
 * Remove '%' and get numeric value (i.e. '12%' => 12)
 * @param {String} value Value to parse
 * @return numeric value
 * @type int
 */
SweetDevRia.DomHelper.parsePercent = function(value) {
	if (typeof (value) == "string") {
		value = value.toLowerCase ();
		var index = value.indexOf ("%");
		if (index >= 0) {
			value = value.substring(0, index);				
		}
		value = parseInt (value, 10);
	}
	
	return value;
};

/**
 * Adds a class name to a given element or collection of elements
 * @param {String/HTMLElement/Array} element The element or collection to add the class to
 * @param {String} className the class name to add to the class attribute
 */
SweetDevRia.DomHelper.addClassName = function(element, className) {
	YAHOO.util.Dom.addClass(element, className);
};

/**
 * Removes a class name from a given element or collection of elements
 * @param {String/HTMLElement/Array} element The element or collection to remove the class from
 * @param {String} className the class name to remove from the class attribute
 */
SweetDevRia.DomHelper.removeClassName = function(element, className) {
	YAHOO.util.Dom.removeClass(element, className);
};

/**
 * Determines whether an HTMLElement has the given className
 * @param {String/HTMLElement/Array} el The element or collection to test
 * @param {String} className the class name to search for
 * @return {boolean/Array} A boolean value or array of boolean values
 */
SweetDevRia.DomHelper.hasClassName = function(element, className) {
	return YAHOO.util.Dom.hasClass(element, className);
};

/**
* Returns a array of HTMLElements with the given class.
* For optimized performance, include a tag and/or root node when possible.
* @method getElementsByClassName
* @param {String} className The class name to match against
* @param {String} tag (optional) The tag name of the elements being collected
* @param {String | HTMLElement} root (optional) The HTMLElement or an ID to use as the starting point
* @return {Array} An array of elements that have the given class name
 */
SweetDevRia.DomHelper.getElementsByClassName = function(className, tag, root) {
	return YAHOO.util.Dom.getElementsByClassName(className, tag, root);
};

function getAllSheets(){
	if( document.getElementsByTagName ) {
		var Lt = document.getElementsByTagName('LINK');
		var St = document.getElementsByTagName('STYLE');
	} else {
		// browser minori - restituisce array vuoto
		return []; 
	}
	//per tutti i tag link ...
	for( var x = 0, os = []; Lt[x]; x++ ) {
		var rel = null;
		//controlla l'attributo rel per vedere se contiene 'style'
		if( Lt[x].rel ) {
			rel = Lt[x].rel;
		} else if( Lt[x].getAttribute ) {
			rel = Lt[x].getAttribute('rel');
		} else {
			rel = '';
		}
		if(typeof(rel)=='string'&&rel.toLowerCase().indexOf('style')+1){
			//riempe la variabile os con i stylesheets linkati
			os[os.length] = Lt[x];
		}
	}
	//include anche tutti i tags style e restituisce l'array
	for( var x2 = 0; St[x2]; x2++ ) {
		os[os.length] = St[x2];
	}
	return os;
};


/**
 *
 */
SweetDevRia.DomHelper.isArray = function(element) {
	if (element.length) {
		return true;
	}
};


/********************************* --- CSS --- ***********************************/

document.cssStyles = null;

SweetDevRia.DomHelper.indexCssStyles = function() {
	
	function isScreenMedia (styleSheets) {
		var medias = styleSheets.media;
		if (medias.item) {
			for (var i = 0; i < medias.length; i++) {
				if (medias.item(i) == "screen") {
					return true;
				}
			}
		}
		else {
			return (medias.indexOf ("screen") > -1);
		}
		
		return false;
	}
	
	if (document.cssStyles === null) {
		document.cssStyles = {};
		var styleSheets = document.styleSheets;
		
		if (styleSheets === null) {
			styleSheets = getAllSheets(); 
		}

		for (var i = 0; i < styleSheets.length; i++) {
			if ( isScreenMedia (styleSheets [i]) ) {
			
				try {
					var cssRules = styleSheets [i].cssRules;
				} catch (e) {
					cssRules = styleSheets [i].rules;
				}
				if (! cssRules) {
					cssRules = styleSheets [i].rules;
				}
	
				if (cssRules) {
					for (var j = 0; j < cssRules.length; j++) {
						var style = cssRules [j];
						
						if (document.cssStyles [style.selectorText] == null) {
							document.cssStyles [style.selectorText] = [];
						}

						document.cssStyles [style.selectorText].add (style);
							
					}
				}
			}
		}
	}
};

/**
* Returns true if the given css class exist in the document
* @param {String} cssClassName the class name to test
* @return true if the specified css class is present in the document
* @type boolean
 */
SweetDevRia.DomHelper.cssClassExist = function(cssClassName) {
	SweetDevRia.DomHelper.indexCssStyles ();
	var styleClass = document.cssStyles [cssClassName];
	return ((styleClass !== null) && (styleClass != 'undefined'));
};

/**
* Returns the z index property of a class name, cross browser
* @param {String} className the class name to get the zindex from.
* @return the zindex for this class name
* @type int
 */
SweetDevRia.DomHelper.getZIndexProperty = function(className){
	var zindex = SweetDevRia.DomHelper.getProperty (className, "zIndex");
	if(!zindex){
		zindex = SweetDevRia.DomHelper.getProperty (className, "z-index");
	}
	return zindex;
};

/**
* Returns the property's value for a class name
* @param {String} className the class name to get the property from.
* @param {String} propertyName the property name to get.
* @return the property value
* @type String
 */
SweetDevRia.DomHelper.getProperty = function(className, propertyName) {
	SweetDevRia.DomHelper.indexCssStyles ();
	var propertyValue = null;

	var cssClass = document.cssStyles ["."+className];
	if (cssClass) {

		for (var k = 0; k < cssClass.length; k++) {
			var clazz = cssClass [k];
			var value = null;
			if (clazz.style.getPropertyValue){
				value = clazz.style.getPropertyValue (propertyName);
			}	
			else {
				value = clazz.style[propertyName];	
			}

			if (propertyValue == null || value != "") {
				propertyValue = value;
			}
		}
	}
	
	return propertyValue;
};

/**
 * Changes the cursor style
 * @param {String} cursorType 	The type to set for the cursor 
 */
SweetDevRia.DomHelper.setCursor = function(cursorType){
	 document.body.style.cursor = cursorType;
};



/**
 * Return the element width
 * @param {HtmlElement} element 	Element to get width
 * @return element width
 * @type int
 */
SweetDevRia.DomHelper.getWidth = function(element){
	if (element && ! element.clientWidth) {
		var region = YAHOO.util.Dom.getRegion(element);
		if (! region || region.right == null || region.left == null) {
			return null;
		}
		else {
			return (region.right - region.left);
		}
	}
	else{
		if (element) {
			return element.clientWidth;
		}
		return null;
	}
};



/**
 * Return the element height
 * @param {HtmlElement} element 	Element to get height
 * @return element height
 * @type int
 */
SweetDevRia.DomHelper.getHeight = function(element){
	if (element) {
		var region = YAHOO.util.Dom.getRegion(element);

		if (! region || region.bottom == null || region.top == null) {
			return null;
		}
		else {
			return (region.bottom - region.top);
		}
	}
};


/**
 * Return the width of the vertical scroller of this element
 * @param {HtmlElement} element Element which we need the vertical scroller width
 * @return width of the vertical scroller of this element
 * @type int
 */
SweetDevRia.DomHelper.getScrollerWidth = function(element){
	//Sous IE6 si aucune width n'est definit, parfois cet attribut vaut 0
	var width = element.clientWidth;
	if(element.clientWidth==0){
		width = element.offsetWidth;
	}
	return (element.offsetWidth - width);

};

/**
 * Return the height of the horizontal scroller of this element
 * @param {HtmlElement} element Element which we need the horizontal scroller height
 * @return height of the vertical scroller of this element
 * @type int
 */
SweetDevRia.DomHelper.getScrollerHeight = function(element){
	return (element.offsetHeight - element.clientHeight);
};

/**
 * Return the height scrolled of the viewport, DOCTYPE free (bug IE)
 * @return height scrolled
 * @type int
 */
SweetDevRia.DomHelper.getScrolledTop = function(){
	if(browser.isIE){
		return Math.max(document.documentElement.scrollTop, document.body.scrollTop);
	}else{
		return window.pageYOffset;
	}
};

/**
 * Return the width scrolled of the viewport, DOCTYPE free (bug IE) 
 * @return width scrolled
 * @type int
 */
SweetDevRia.DomHelper.getScrolledLeft = function(){
	if(browser.isIE){
		return Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
	}else{
		return window.pageXOffset;
	}
};

/**
 * Return the client width
 * @return the client width
 * @type int
 */
SweetDevRia.DomHelper.getClientWidth = function(){
	return YAHOO.util.Dom.getClientWidth();
};

/**
 * Return the client height
 * @return the client height
 * @type int
 */
SweetDevRia.DomHelper.getClientHeight = function(){
	return YAHOO.util.Dom.getClientHeight();
};

/**
 * Return the x location of an event
 * @return the x location of an event
 * @type int
 */
SweetDevRia.DomHelper.getEventX = function(e){
	var x =  YAHOO.util.Event.getPageX(e);
	return x;
};

/**
 * Return the y location of an event
 * @return the y location of an event
 * @type int
 */
SweetDevRia.DomHelper.getEventY = function(e){
	var y =  YAHOO.util.Event.getPageY(e);
	return y;
};


/**
 * Return the Text value (after trim) of a node
 * @param {HtmlElement} element Element which we need the text value
 * @return the Text value (after trim) of a node
 * @type String
 */
SweetDevRia.DomHelper.getTextValue = function(element){
	var res = "";

	if (element.nodeType == 3) {
		res += element.nodeValue;
	}

	var children = element.childNodes;
	for (var i = 0; i < children.length; i++) {
		var child = children[i];
		
		res += SweetDevRia.DomHelper.getTextValue (child);
	}
	
	return res;
};

/**
 * Clears the current text selected
 * Removes the Firefox DIV border on control click 
 */
SweetDevRia.DomHelper.clearSelection = function() {
    var sel ;
    if(document.selection && document.selection.empty){
      document.selection.empty() ;
    } else{ 
    	if(window.getSelection) {
      		sel=window.getSelection();
      		if(sel && sel.removeAllRanges){
        		sel.removeAllRanges(); // Removes the Firefox DIV border on control click AND cancel text
        	}
        }
    }
};

/**
 * Select the a range of charaters in an input. If selectionStart and selectionEnd are equal, just positionate the input.
 * @param {HTMLElement} input the input element to act on
 * @param {int} selectionStart the first index of selection
 * @param {int} selectionEnd the last index of selection 
 */
SweetDevRia.DomHelper.setSelectionRange = function(input, selectionStart, selectionEnd) {
	if (input.createTextRange) {
		var range = input.createTextRange();
		range.collapse(true);
		range.moveEnd('character', selectionEnd);
		range.moveStart('character', selectionStart);
		range.select();
	}
	else{ 
		if (input.setSelectionRange) {
		//	input.focus();
			input.setSelectionRange(selectionStart, selectionEnd);
		}
	}
};

/**
 * Show a DOM component
 * @param {String} id Id of component to show
 * @private
 */
SweetDevRia.DomHelper.show = function (id) {
	var comp = SweetDevRia.DomHelper.get (id);
	if (comp) {
		comp.style.display = "block";
	}	
};

/**
 * Hide a DOM component
 * @param {String} id Id of component to hidde
 * @private
 */
SweetDevRia.DomHelper.hide = function (id) {
	var comp = SweetDevRia.DomHelper.get (id);
	if (comp) {
		comp.style.display = "none";
	}	
};

/**
 * Test the visibility of a DOM component
 * @param {String} id Id of component to test
 * @return true if this component is visible, else false
 * @type Boolean
 * @private
 */
SweetDevRia.DomHelper.isVisible = function (id) {
	var comp = SweetDevRia.DomHelper.get (id);
	if (comp) {
		return (comp.style.display == "block" || comp.style.display == "");
	}	
};

/**
 * Swap the visibility of a DOM component
 * @param {String} id Id of the component to swap visibility
 * @private
 */
SweetDevRia.DomHelper.swapVisibility = function (id) {
	SweetDevRia.DomHelper.setVisibility (id, ! SweetDevRia.DomHelper.isVisible(id));
};

/**
 * Set the visibility of a DOM component
 * @param {String} id Id of the component to set the visibility
 * @param {Boolean} visibility the visibility to set
 * @private
 */
SweetDevRia.DomHelper.setVisibility = function (id, visibility) {
	if (visibility) {
		SweetDevRia.DomHelper.show (id);
	}
	else {  
		SweetDevRia.DomHelper.hide (id);
	}
};


/**
 * Display an object with a vertical animation
 * @param {DOM Object} comp Object to display
 * @param {float} duration Animation duration in seconds
 * @param {Function} onComplete Function to trigger on animation complete 
 * @param {Function} onTween Function to trigger on animation processing. Multiple times calls !  
 */
SweetDevRia.DomHelper.verticalShow = function(comp, duration, onComplete, onTween) {
	comp.style.visibility = "hidden";

	SweetDevRia.DomHelper.show (comp.id);

	var height = SweetDevRia.DomHelper.getHeight(comp)-2;//BorderHACK


	//comp.style.overflow = "hidden";//suggest needs scroll 
	var defaultOverFlow = "";
	if(comp.style.overflow){
		defaultOverFlow = comp.style.overflow; 
	}
	comp.style.overflow = "hidden";//IE show
    comp.style.visibility = "visible";
    comp.style.height = "1px";

	var attributes = {
	    height : {from : 1, to : height},
    	opacity : { from : 0.5 , to : 1}
	};

	var anim = new YAHOO.util.Anim(comp.id, attributes, duration, YAHOO.util.Easing.easeNone);
	if(onComplete){
		anim.onComplete.subscribe(onComplete);
	}

	anim.onComplete.subscribe(function(){comp.style.overflow=defaultOverFlow;});
	
	if(onTween){
		anim.onTween.subscribe(onTween);
	}
	anim.animate ();

};

/**
 * Hide an object with a vertical animation
 * @param {DOM Object} comp Object to hide
 * @param {float} duration Animation duration 
 * @param {Function} onComplete Function to trigger on animation complete 
 * @param {Function} onTween Function to trigger on animation processing. Multiple times calls !  
 */
SweetDevRia.DomHelper.verticalHide = function(comp, duration, onComplete, onTween) {
	var height = SweetDevRia.DomHelper.getHeight(comp)-2;//BorderHACK
	if (height) {
		var attributes = {
			height : {from :height, to : 1},
			opacity : {from :1, to : 0.5}
		};
	
		var defaultOverFlow = "";
		if(comp.style.overflow){
			defaultOverFlow = comp.style.overflow; 
		}
		comp.style.overflow = "hidden";//IE hide
		
		var anim = new YAHOO.util.Anim(comp.id, attributes, duration, YAHOO.util.Easing.easeNone);
		
		anim.onComplete.subscribe(function () {
			comp.style.height = height + "px";
			SweetDevRia.DomHelper.hide (comp.id); 
		}); 
		anim.onComplete.subscribe(function(){comp.style.overflow=defaultOverFlow;});

		if(onComplete){
			anim.onComplete.subscribe(onComplete);
		}
		
		if(onTween){
			anim.onTween.subscribe(onTween);
		}
		
		anim.animate ();
	}
};


SweetDevRia.DomHelper.getElementsBy = function(method, tag, root) {
	 return YAHOO.util.Dom.getElementsBy(method, tag, root);
};

/**
* Get position number of a child node in the Dom, concerning nodes with the @clazz value
* @param {HTMLElement} elem Parent node
* @param {String} childId Child node ID
* @param {String} clazz CSS class of counted nodes 
* @param {boolean} textNode If true, textNode are used to find position, else not.
* @return Get child node ID position, null if child node was not found
* @type int
*/
SweetDevRia.DomHelper.getDomPosWithClass = function(elem, childId, clazz, textNode) {
	if (textNode === null) {
		textNode = false;
	}
	
	var pos = 0;		
	var children = elem.childNodes;
	
	for (var i = 0; i < children.length; i++) {
		var child = children [i];

		/** for textNode */
		if ((child.nodeType != 3) || textNode) {
			
			if (! clazz || SweetDevRia.DomHelper.hasClassName (child, clazz)) {
				
				if (child.id == childId) {
					return pos;
				}
	
				pos++;
			}
		}
	}
	
	return null;
};

SweetDevRia.DomHelper.setSizeByClassName = function(clazz, width, height, tag, root){
	if (width != null) {
		SweetDevRia.DomHelper.setPropertyByClassName (clazz, "width", width + "px", tag, root);
	}
	if (height != null) {
		SweetDevRia.DomHelper.setPropertyByClassName (clazz, "height", height + "px", tag, root);
	}
};

SweetDevRia.DomHelper.setPropertyByClassName = function(clazz, propertyName, propertyValue, tag, root){
	var nodes = SweetDevRia.DomHelper.getElementsByClassName (clazz, tag, root);
	
	for (var i = 0; i < nodes.length; i++) {
		var node = nodes [i];
		SweetDevRia.DomHelper.setStyle (node, propertyName, propertyValue);
	}
};

/**
* Recupere les proprietes css en fonction d'une classe
*/
SweetDevRia.DomHelper.getDefaultValue = function(clazz, property, root){
	var propertyValue = null;
	var nodes = SweetDevRia.DomHelper.getElementsByClassName (clazz, "div", root);
	if (nodes && nodes.length) {
		var node = nodes [0];
		if (property == "width") {
			propertyValue = SweetDevRia.DomHelper.getWidth (node);
		}
		else if (property == "height") {
			propertyValue = SweetDevRia.DomHelper.getHeight (node);
		}
		else {
			propertyValue = SweetDevRia.DomHelper.getStyle (node, property);
		}
		
		if (propertyValue.indexOf && propertyValue.indexOf ("px") > 0) {
			propertyValue = SweetDevRia.DomHelper.parsePx (propertyValue);
		}
	}
	
	// TODO 
	if (propertyValue == "medium") {propertyValue = 0;}	
	return propertyValue;
};

SweetDevRia.DomHelper.getDefaultValueByNode = function(node, property){
	var propertyValue = null;
	if (node) {
		if (property == "width") {
			propertyValue = SweetDevRia.DomHelper.getWidth (node);
		}
		else if (property == "height") {
			propertyValue = SweetDevRia.DomHelper.getHeight (node);
		}
		else {
			propertyValue = SweetDevRia.DomHelper.getStyle (node, property);
		}
		
		if (propertyValue.indexOf && propertyValue.indexOf ("px") > 0) {
			propertyValue = SweetDevRia.DomHelper.parsePx (propertyValue);
		}
	}
	
	// TODO 
	if (propertyValue == "medium") {
		propertyValue = 0;
	}
	
	return propertyValue;
};