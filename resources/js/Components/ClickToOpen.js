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
 * @class ClickToOpen.
 * @constructor
 * @param {String} id 	the id of the clickToOpen
 * @param {int} shiftX 	the number of pixels to shift the tooltip on X's from the link
 * @param {int} shiftY 	the number of pixels to shift the tooltip on Y's from the link
 */ 
SweetDevRia.ClickToOpen = function(id, shiftX, shiftY) {
	superClass (this, SweetDevRia.RiaComponent, id, "SweetDevRia.ClickToOpen");
	superClass (this, SweetDevRia.Hookable, id);
	superClass (this, SweetDevRia.Hooker, id);

    this.frame = SweetDevRia.DomHelper.get(id);
    this.shiftX = shiftX;
    this.shiftY = shiftY;
    this.opened = false;
    this.useFixedZIndex = false;
    this.zIndex = 0;

    /**
     * Do I need to harm the timer to check if referer link has moved ?
     */
    this.autoClose = true;

	/**
	 * Timer ID wich check if referer has moved.
	 * @type Timer
	 */
    this.refererTimerChecker = 0;
    
    /**
     * Initial referer X position.
     * @type int
     */
    this.refererPosX = null;

    /**
     * Initial referer Y position.
     * @type int
     */
    this.refererPosY = null;

    /* ************************* *
     * ******** IE HACK ******** *
     * ************************* *
     * Width problem if parent is a TD on IE, so changing parent.
     */
	if (browser.isGecko) {
		if (this.frame.parentNode && this.frame.parentNode.nodeName) {
			var parentNode = this.frame.parentNode.nodeName;
			/* Warning : if parentNode is a FORM and parent is changed, IE can't open the page ! (fatal error) */
			if (parentNode == "TD") {
				var body = document.getElementsByTagName("BODY")[0];
				body.appendChild(this.frame);
			}
		}
	}
};

extendsClass(SweetDevRia.ClickToOpen, SweetDevRia.RiaComponent);
extendsClass(SweetDevRia.ClickToOpen, SweetDevRia.Hookable);
extendsClass(SweetDevRia.ClickToOpen, SweetDevRia.Hooker);

/**
 * This method is called before opening the tooltip. 
 * To be overridden !!
 * @param {HTMLElement} aLink 	Referring link used to calculate position where open tooltip.
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.ClickToOpen.prototype.beforeOpen  = function(aLink){  /* override this */ return true;  };

/**
 * This method is called after opening the tooltip. 
 * To be overridden !!
 * @param {HTMLElement} aLink 	Referring link used to calculate position where open tooltip.
 */
SweetDevRia.ClickToOpen.prototype.afterOpen = function(aLink){  /* override this */ };

/**
 * This method is called before closing the tooltip. 
 * To be overridden !!
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.ClickToOpen.prototype.beforeClose  = function(){  /* override this */ return true;  };

/**
 * This method is called after closing the tooltip. 
 * To be overridden !!
 */
SweetDevRia.ClickToOpen.prototype.afterClose = function(){  /* override this */ };

/**
 * This event type is fired when open the clicktoopen component
 */
SweetDevRia.ClickToOpen.OPEN_EVENT = "open";


/**
 * This event type is fired when close the clicktoopen component
 */
SweetDevRia.ClickToOpen.CLOSE_EVENT = "close";



/**
 * Initialise the ClickToOpen component
 */
SweetDevRia.ClickToOpen.prototype.initialize = function() {
	var hookerId = SweetDevRia.HookedComp.getInstance().getHooker(this.id);
	if(hookerId){
		this.hookerId = hookerId;
		SweetDevRia.$(this.hookerId).hook(this.id);
	}
};

/**
 * Open a ClickToOpen.
 * @param {HTMLElement} aLink 	Referring link used to calculate position where open tooltip.
 * @return True if the element has been opened, false if it has been closed
 * @type boolean
 */
SweetDevRia.ClickToOpen.prototype.open = function(aLink) {
    if (this.opened) {
	    this.close();
        return false;
    }
    
    if(this.beforeOpen(aLink)){
	    
	    this.tryHooking();
		
		SweetDevRia.LayoutManager.moveNodeTo(this.frame.id, document.body);
	
		/**
		 * SRL : Hack for correct  
		 */
		if (this.frame.parentNode != document.body) {
			document.body.appendChild (this.frame);
		} 
	
	    var top = parseInt(SweetDevRia.DomHelper.getY(aLink), 10);
	    var left = parseInt(SweetDevRia.DomHelper.getX(aLink), 10);
	    var topScroll = top - SweetDevRia.DomHelper.getScrolledTop();
	    var leftScroll = left - SweetDevRia.DomHelper.getScrolledLeft();
	    var smartPosition = true;
	
	    if (!isNaN(this.shiftY) && (parseInt(this.shiftY, 10) !== 0)) {
	        top += parseInt(this.shiftY, 10);
	        smartPosition = false;
	    }
	
	    if (!isNaN(this.shiftX) && (parseInt(this.shiftX, 10) !== 0)) {
	        left += parseInt(this.shiftX, 10);
	        smartPosition = false;
	    }
		
		// TT 287
		document.body.appendChild (this.frame);
		
	    this.frame.style.display = 'block';
		
	    if (smartPosition) {
	        // Getting browser's width and height
	        var frameWidth = YAHOO.util.Dom.getClientWidth();
	        var frameHeight = YAHOO.util.Dom.getClientHeight();
	        
	        var element = document.getElementById(this.id+"_table");
	        if(element === null){
	        	element = document.getElementById(this.id);
	        }
	        
	        var tooltipWidth = parseInt(SweetDevRia.DomHelper.getWidth(element), 10);
			var tooltipHeight = parseInt(SweetDevRia.DomHelper.getHeight(this.frame), 10)-(this.getFrame()?this.getFrame().borderSize*2:0);

			if (this.getFrame()) {
				this.getFrame().setWidth (tooltipWidth);
				this.getFrame().setHeight (tooltipHeight);
			}
			
	        // Processing offsets
	        var     offsetRight = frameWidth - (leftScroll + tooltipWidth),
	                offsetLeft = (leftScroll + aLink.offsetWidth - tooltipWidth),
	                offsetBottom = frameHeight - (topScroll + aLink.offsetHeight + tooltipHeight),
	                offsetTop = (topScroll - tooltipHeight);
		
	        // Align right (by default) or left
	        if (offsetRight > 0) {
	          null;
	        } 
	        else if (offsetLeft > offsetRight) {
	            left -= tooltipWidth - aLink.scrollWidth;
	        }
	
	        // Align bottom (by default) or top
	        if (offsetBottom > 0) {
	            // If it's some space under the link
	            top += aLink.scrollHeight + 2;
	        } else if (offsetTop > offsetBottom){
	            // If it's some space over the link
	            top -= tooltipHeight;
	        } else {
	            // If it isnt some space, forcing under the link
	            top += aLink.scrollHeight + 2;
	        }
	    }
	
		/** SRL ::  Mandatory for datagrid scrolling  */
		if (browser.isGecko) {
			var parentScrollTop = 0;
			var parent = this.frame.parentNode;
			while (parent !== null && parent != document.body) {
				parentScrollTop += parent.scrollTop;
				parent=  parent.parentNode;
			}
		}
	
		SweetDevRia.DomHelper.setY(this.frame, top);
		SweetDevRia.DomHelper.setX(this.frame, left);
	
		//see if it works applying it up
	    if (this.useFixedZIndex) {
	      this.frame.style.zIndex = this.zIndex;
	    } else {
			var zindex = SweetDevRia.DisplayManager.getInstance().getTopZIndex (true);
			this.frame.style.zIndex = zindex;
	    }

	    this.setActive(true);
	    this.opened = true;

	    /* BUG FIX IE SELECT */
	    /* On IE 5.5, hide all selects */
	    SweetDevRia.LayoutManager.changeSelectVisibility(document, false);
	    /* On IE 6, apply a transparent iframe on each window */
	    SweetDevRia.LayoutManager.addMaskIFrame(this.id, this.frame);
	
		/* This is the only way to make it work in IE (and, of course, Firefox) */
		if (this.autoClose) {
		    this.refererTimerChecker = window.setInterval("checkReferer('"+this.id+"','"+aLink.id+"',"+parseInt(SweetDevRia.DomHelper.getY(aLink), 10)+","+parseInt(SweetDevRia.DomHelper.getX(aLink), 10)+")", 500);
		}

		if(this.getFrame()){//false for calendar
			this.getFrame().refreshBorders();
		}
	
		this.fireEventListener (SweetDevRia.ClickToOpen.OPEN_EVENT);

		this.afterOpen(aLink);
	}
	
	return true;
};


/**
 * Compare old and new position from HTML referer (link).
 * Different positions means that the referer has moved from initial position and that the tooltip is no more well set on page.
 * And so, we must close it.
 * @param {String} tooltip Tooltip JavaScript object Id.
 * @param {String} refererLink HTML referer link Id to calculate new position.
 * @param {String} oldTop Old HTML referer link Y position.
 * @param {String} oldLeft Old HTML referer link X position.
 */
function checkReferer (tooltip, refererLink, oldTop, oldLeft) {
    var top = parseInt(SweetDevRia.DomHelper.getY(refererLink), 10);
    var left = parseInt(SweetDevRia.DomHelper.getX(refererLink), 10);

	if (oldTop != top || oldLeft != left) {
		SweetDevRia.getComponent(tooltip).close();
	}
}

/**
 * Closing callback function called by EventHelper.addListener.
 * @param {Event} e event.
 * @param {Object} tooltip Click to open tooltip.
 */
SweetDevRia.ClickToOpen.prototype.doClose = function(e, tooltip) {
	tooltip.close();
	return false;
};


/**
 * Moving method.
 * @param {int} dx delta X to move the component to
 * @param {int} dy delta Y to move the component to
 */
SweetDevRia.ClickToOpen.prototype.onContainerMove = function(dx, dy) {
	SweetDevRia.DomHelper.setX(this.frame, SweetDevRia.DomHelper.getX(this.frame) + dx);
	SweetDevRia.DomHelper.setY(this.frame, SweetDevRia.DomHelper.getY(this.frame) + dy);
};

/**
 * Method called by the popup manager. To override if the behaviour has to be changed.
 */
SweetDevRia.ClickToOpen.prototype.closePopup = function(originalTarget){

	var original = SweetDevRia.DomHelper.getAncestorCompId(originalTarget);
	var hooker = SweetDevRia.HookedComp.getInstance();


	if(originalTarget &&
		 (
			 ( 
				 (originalTarget.id != "tooltipLink"+this.id ) && // si l objet clique est mon lien d ouverture, je me ferme
				 (originalTarget.parentNode.id != "openCalendarTooltip"+this.id.substring(0,this.id.length-7) ) &&// si l objet clique est mon lien d ouverture, je me ferme
				 (!SweetDevRia.DomHelper.hasAncestor(originalTarget,this.id)) && // si l objet clique n est pas un de mes fils, je me ferme
				 (!original || ! this.isHooked (original.id)) // si l objet clique n est pas un de mes fils hooke je me ferme aussi
			 )
			 || (originalTarget == document.body)
		)
	){
		this.close();
	}
};

/**
 * Closing function.
 */
SweetDevRia.ClickToOpen.prototype.close = function() {
	if (!this.opened) {
        return false;
    }

	if(this.beforeClose()){

		this.closeHooked();
	    this.frame.style.zIndex = 0;
	    this.frame.style.display = 'none';
	    this.opened = false;
	
	   	this.setActive (false);
	
	    // Bug on Firefox 1.0.7
	    if (navigator.userAgent.indexOf("Firefox/1.0") != -1) {
	        SweetDevRia.DomHelper.get('closeLinkCTO' + this.id).onmouseout();
	    }
	
	    /** BUG FIX IE SELECT */
	//    if (SweetDevRia.size(this.className) === 0) {
	        /* On IE 5.5, show all select boxes precedently hidden */
	        SweetDevRia.LayoutManager.changeSelectVisibility(document, true);
	//    }
	    /* On IE 6, remove IFRAME */
	    SweetDevRia.LayoutManager.removeTransparentIFrame(this.id, this.frame);
	
		if (this.autoClose) {
			window.clearInterval(this.refererTimerChecker);
			this.refererTimerChecker = 0;
		}
	
	/*	if(this.referenceNode){ // it has been popup, we must close it and replace it into the page.
			this.referenceNode.parentNode.insertBefore(this.frame, this.referenceNode);
			this.frame.parentNode.removeChild(this.referenceNode);
			this.referenceNode = undefined;
		}*/
		
		SweetDevRia.LayoutManager.restoreMovedNode(this.frame.id);

		this.fireEventListener (SweetDevRia.ClickToOpen.CLOSE_EVENT);
	
		this.afterClose();
	}
	
    return true;
};

/**
 * Set a fixed z index on tooltip.
 * @param {int} zIndex Z-Index to set on tooltip.
 */
SweetDevRia.ClickToOpen.prototype.setFixedZIndex = function(zIndex) {
    this.useFixedZIndex = true;
    this.zIndex = zIndex;
};

/**
 * Handle keyboard event.
 * @param {Event} evt Event.
 * @return {boolean} true if event is not active, false if component was closed.
 */
SweetDevRia.ClickToOpen.prototype.handleEvent = function(evt) {
	if (!this.isActive()) {
		return true;
	}

	if (evt && evt.type) {
		if (evt.type == SweetDevRia.RiaEvent.KEYBOARD_TYPE) {
			if (evt.keyCode == SweetDevRia.KeyListener.ESCAPE_KEY) {
				this.close();
				SweetDevRia.EventHelper.stopPropagation(evt.srcEvent);
				SweetDevRia.EventHelper.preventDefault(evt.srcEvent);
				return false;
			}
		}
	}
};

SweetDevRia.ClickToOpen.prototype.destroy = function(){
	this.close();
};
