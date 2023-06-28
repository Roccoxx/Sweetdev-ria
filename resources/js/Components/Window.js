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
SweetDevRia.Coords = function(x,y,width,height){
	this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
};

/**
 * @class Window
 * @constructor
 * @param {String} 	id Identifier of the window
 * @param {int}		x Left position of the Window
 * @param {int} 	y Top position of the window
 * @param {int} 	width Width of the window
 * @param {int} 	height Height of the window
 * @param {int} 	minWidth Minimal width of the window
 * @param {int} 	minHeight Minimal height of the window 
 * @param {int} 	maxWidth Maximal width of the window
 * @param {int} 	maxHeight Maximal height of the window 
 * @param {String} 	url Url to display in the window
 * @param {boolean} modal Is the window modal  
 */ 
SweetDevRia.Window = function(id,x,y,width,height,minWidth,minHeight,maxWidth,maxHeight,url,modal, openAtStartup, loadAtStartup){

	superClass (this, SweetDevRia.RiaComponent, id, SweetDevRia.Window.prototype.className);
//	superClass (this, SweetDevRia.Frame, id);
	superClass (this, SweetDevRia.Hookable, id);
	superClass (this, SweetDevRia.Hooker, id);

//	this.parentWindowId = this.parentComponentId;
	this.parentWindow = null; //this.parentComponentId == null ? SweetDevRia.container : SweetDevRia.$ (this.parentComponentId);
	this.nestedWindows = [];
	this.isNestedWindow = SweetDevRia.container != null || this.parentComponentId != null;

	this.indexId = SweetDevRia.Window.prototype.indexIdCounter;
	SweetDevRia.Window.prototype.indexIdCounter = SweetDevRia.Window.prototype.indexIdCounter + 1;

	if (modal == null) {modal = false;}
	if (openAtStartup == null) {openAtStartup = false;}
	if (x == null) {x = -1;}
	if (y == null) {y = -1;}
	if (minWidth == null) {minWidth = 20;}
	if (minHeight == null) {minHeight = 20;}
	this.title = "  ";
	this.message = null;
	this.isResizable = true;
	this.canMaximize = true;
	this.canMinimize = true;
	this.canClose = true;

    this.coords = new SweetDevRia.Coords(x,y,width,height);
    this.minWidth = minWidth;
    this.minHeight = minHeight;
    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;
    this.url = url;
    this.modal = modal;
    this.isOpen = openAtStartup;
    this.isLoaded = loadAtStartup;
    
    this.style = "";
    this.styleClass = "";
	
	this.asIframe = true;//default. initialized in vm
	
	this.loadNow = SweetDevRia.toInit;

	this.showTitleIcon = true;
	this.showCorner = true;
	this.displayTitleBar = true;
	
	this.parent = document.body;
	this.dragDockedY = null;
	
	this.maskId = this.id+'_mask';

	// html id of component who call open method
	this.callerId = null;  //SWTRIA-1019
};

extendsClass(SweetDevRia.Window, SweetDevRia.RiaComponent);
extendsClass(SweetDevRia.Window, SweetDevRia.Frame); // NIS
extendsClass(SweetDevRia.Window, SweetDevRia.Hookable);
extendsClass(SweetDevRia.Window, SweetDevRia.Hooker);

/**
 * This event type is fired when the window is opened
 * @static
 */
SweetDevRia.Window.OPEN_EVENT = "open";

/**
 * This event type is fired when the window is closed
 * @static
 */
SweetDevRia.Window.CLOSE_EVENT = "close";

/**
 * This event type is fired when the window is maximized
 * @static
 */
SweetDevRia.Window.MAXIMIZE_EVENT = "maximize";

/**
 * This event type is fired when the window is minimized
 * @static
 */
SweetDevRia.Window.MINIMIZE_EVENT = "minimioze";

/**
 * This event type is fired when the window is restored
 * @static
 */
SweetDevRia.Window.RESTORE_EVENT = "restore";

/**
 * Name of the class
 * @type String
 */
SweetDevRia.Window.prototype.className = "Window";
SweetDevRia.Window.prototype.dom = {};
SweetDevRia.Window.prototype.dom.title = "title";
SweetDevRia.Window.prototype.dom.panel = "panel";
SweetDevRia.Window.prototype.dom.state = "state";
SweetDevRia.Window.prototype.dom.minimize = "minimize";
SweetDevRia.Window.prototype.dom.restore = "restore";
SweetDevRia.Window.prototype.dom.maximize = "maximize";
SweetDevRia.Window.prototype.dom.close = "close";
SweetDevRia.Window.prototype.dom.menu = "menu";
SweetDevRia.Window.prototype.dom.corner = "corner";
SweetDevRia.Window.prototype.dom.titleLabel = "titleLabel";
SweetDevRia.Window.prototype.dom.stateLabel = "stateLabel";
SweetDevRia.Window.prototype.dom.invisiblePanel = "invisiblePanel";
SweetDevRia.Window.prototype.dom.invisibleWindow = "invisibleWindow";
SweetDevRia.Window.prototype.dom.invisibleWindowPanel = "invisibleWindowPanel";

SweetDevRia.Window.prototype.docked = false;
SweetDevRia.Window.prototype.dockedWidth = "96%";
SweetDevRia.Window.prototype.dockedMargin = "2%";
SweetDevRia.Window.prototype.dockedPosition = "relative";
SweetDevRia.Window.prototype.dockedX = "0px";
SweetDevRia.Window.prototype.dockedY = "0px";

SweetDevRia.Window.prototype.modalWindow = null;

/**
 * Instance counter
 * @type int
 */
SweetDevRia.Window.prototype.indexIdCounter = 0;
/**
 * Width of the window when it's minimized (default : 100px)
 * @type int
 */
SweetDevRia.Window.prototype.minimizeWidth = 100;
/**
 * Maximum width of the Window (default : 800px)
 * @type int
 */
SweetDevRia.Window.prototype.maxWidth = -1;
/**
 * Maximum height of the Window (default : 800px)
 * @type int
 */
SweetDevRia.Window.prototype.maxHeight = -1;
/**
 * Is window maximized (default : false)
 * @type boolean
 */
SweetDevRia.Window.prototype.isMaximize = false;
/**
 * Is window minimized (default : false)
 * @type boolean
 */
SweetDevRia.Window.prototype.isMinimize = false;
/**
 * Is window open (default : true)
 * @type boolean
 */
SweetDevRia.Window.prototype.isOpen = true;
/**
 * Is statebar visible (default : true)
 * @type boolean
 */
SweetDevRia.Window.prototype.isStateBar = true;

/**
 * Is window resizable (default : true)
 * @type boolean
 */
SweetDevRia.Window.prototype.isResizable = true;
SweetDevRia.Window.prototype.active = null;
SweetDevRia.Window.prototype.zIndex = null;
/**
 * Is window modal (default : false)
 * @type boolean
 */
SweetDevRia.Window.prototype.modal = false;
SweetDevRia.Window.prototype.instanceByZIndex = {};
SweetDevRia.Window.prototype.baseZindex = null;

/**
 * Window default border size
 * @type int
 */
//SweetDevRia.Window.prototype.borderSize = 10;

/**
 * Window default css class base
 * @type String
 */
//SweetDevRia.Window.prototype.cssClassBase = "ideo-bdr-";


/**
 * Public APIs
 *
 */

/**
 * This method is called before opening a window
 * To be overridden !!
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Window.prototype.beforeOpen = function(){ return true; };

/**
 * This method is called after opening a window
 * To be overridden !!
 */
SweetDevRia.Window.prototype.afterOpen = function(){};


/**
 * This method is called before closing a window
 * To be overridden !!
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Window.prototype.beforeClose = function(){ return true; };

/**
 * This method is called after closing a window
 * To be overridden !!
 */
SweetDevRia.Window.prototype.afterClose = function(){};

/**
 * This method is called before maximizing a window
 * To be overridden !!
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Window.prototype.beforeMaximize = function(){ return true; };

/**
 * This method is called after maximizing a window
 * To be overridden !!
 */
SweetDevRia.Window.prototype.afterMaximize = function(){};

/**
 * This method is called before minimizing a window
 * To be overridden !!
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Window.prototype.beforeMinimize = function(){ return true; };

/**
 * This method is called after minimizing a window
 * To be overridden !!
 */
SweetDevRia.Window.prototype.afterMinimize = function(){};

/**
 * This method is called before restoring a window
 * To be overridden !!
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Window.prototype.beforeRestore = function(){ return true; };

/**
 * This method is called after restoring a window
 * To be overridden !!
 */
SweetDevRia.Window.prototype.afterRestore = function(){};

/**
 * Return window dom fragment
 * @type Node
 */
SweetDevRia.Window.prototype.getView = function(){
    return document.getElementById(this.id);
};

/**
 * Return real window internal subElement name
 * @param {String} name 	Generic name of a subElement of the window (Example : SweetDevRia.Window.prototype.dom.menu)
 * @type String
 */
SweetDevRia.Window.prototype.getViewName = function(name){
    if(name === undefined){
		return this.id;
	}
    return this.id + "_" + name;
};

SweetDevRia.Window.prototype.initFrame = function(){
	var win = this;
	var frame = this.createFrame();
	if(!frame.isNude()){
		frame.contentId = this.id+"_borderContainer";
		frame.resizeMode = SweetDevRia.Frame.RESIZE_MODE_ALL;
		frame.borderMode = SweetDevRia.Frame.BORDER_MODE_ALL;
		frame.canDrop = false;
		frame.showBorderOnOver = false;
		frame.canDrag = true;
		frame.dragId = this.id;
		frame.handleId = this.id+"_title";
		frame.fakeMode = SweetDevRia.DD.FAKE;
		frame.hideDuringDrag = false;
		
		if(this.docked){
			frame.hideIFrame = true;
			frame.dockedId = this.dockedId;
		}
		
		frame.setWidth = function (width) {
			if( win.minWidth<width ){
				win.setWidth (width);
				return true;
			}
			else{
				return false;
			}
		};
		
		frame.setHeight = function (height) {
			if( !win.isMinimize ){
				win.setHeight (height);
				return true;
			}
			else{
				return false;
			}
		};
		
		frame.getMainAbsoluteId = function(){
			return win.id;
		};
		
		//forbid drop at under top of the browser
		frame.onDragDrop = function(dropZone, xy){
			if (win.docked) {
				var column = SweetDevRia.DomHelper.get (dropZone.dragId);
				// TODO je parcours tous les fils de la colonnes pour trouver en kelle position je dois l inserer
				var next = null;
				for (var i = 0; i< column.childNodes.length; i++) {
					var child = column.childNodes [i];
	
					// if it s a window, we calculte its position
					if (child.nodeType!= 3 && SweetDevRia.DomHelper.hasClassName(child, "ideo-win-main")) {
						var y = SweetDevRia.DomHelper.getY (child);
						var height = SweetDevRia.DomHelper.getHeight (child);
						if (y + (height/2) > xy[1]) {
							next = child;
							break;
						}
					}
				}
	
				if (next) {
					// We insert the new window before this window
					column.insertBefore (win.getView (), next);
				}
				else {
					// There is no window in this column, so we add the new window
					column.appendChild (win.getView ());
				}
	
				var frame =  win.getFrame();
				if (frame.initialized) {
					frame.refreshBorders();
				}
			}
			else if(xy[1] <0){
				SweetDevRia.DomHelper.setY (this.getEl(), 0);
			}
		};
		
		frame.onStartDrag = function(){
			win.setActive();
			win.closeHooked();
		};
		

		var win = this;
		// srevel : sur un resize de la fenetre du browser, on resize la window lorsqu elle est maximisee
		SweetDevRia.EventHelper.addListener (window, "resize", function () {
				if (win.isMaximize) {
				    win.moveTo(SweetDevRia.DomHelper.getScrolledLeft (), SweetDevRia.DomHelper.getScrolledTop());
				    win.resizeTo(win.getMaxWidth() ,win.getMaxHeight() );
				}		
		});
		// srevel : sur un scroll de la fenetre du browser, on repositionne la window lorsqu elle est maximisee
		SweetDevRia.EventHelper.addListener (window, "scroll", function () {
				if (win.isMaximize) {
				    win.moveTo(SweetDevRia.DomHelper.getScrolledLeft (), SweetDevRia.DomHelper.getScrolledTop());
				}		
		});
	
	}

};

/**
 * Return window internal subElement dom
 * @param {String} id 	Generic name of a subElement of the window (Example : SweetDevRia.Window.prototype.dom.menu)
 * @type HTMLElement
 */
SweetDevRia.Window.prototype.getDomView = function(id){
    //return document.getElementById(SweetDevRia.Window.prototype.className + "_" + id + "@" + this.indexId);
	return document.getElementById(this.id + "_" + id);
};

/**
 * Drag & Drop resizepanel for resize
 * @private
 */
SweetDevRia.Window.prototype.resizePanel= function (){

	if (! this.isInitialized) {
		return;
	}

	var window = this.getView();
    var windowTitle = this.getDomView(SweetDevRia.Window.prototype.dom.title);
    var windowPanel = this.getDomView(SweetDevRia.Window.prototype.dom.panel);
    var windowInvisiblePanel = this.getDomView(SweetDevRia.Window.prototype.dom.invisiblePanel);
    var stateBar = this.getDomView(SweetDevRia.Window.prototype.dom.state);
    var stateBarHeight = 0;
    if(stateBar){
    	stateBarHeight = stateBar.offsetHeight;
    }
	var frame = this.getFrame();
	var frameSize = 2 * frame.borderSize;

	var border = document.getElementById (frame.contentId+"_north"); 
	if (border && border.style.display == "none") {
		//Evite que les ascenceur apparaissent quand on maximize
		//Ca laisse un blanc a droite et en bas par contre, mais sous FF si
		//c'est plus petit, et qu'on utilise une iframe pour le contenu alors
		//les ascenceur apparaissent.
		frameSize = 5;
	}

	if (! frame.isVisible ()) {
		frameSize = 0;
	}

    var height = (SweetDevRia.DomHelper.parsePx(window.style.height) - (SweetDevRia.DomHelper.parsePx(windowTitle.offsetHeight)) - (parseInt(stateBarHeight, 10)) - frameSize);
	if (height < 0) {height = 0;}
	height = height + "px";
		
    var width = (SweetDevRia.DomHelper.parsePx(window.style.width) - frameSize);

    windowPanel.style.height = height;
    windowInvisiblePanel.style.height = height;
    //Evite que les ascenceur apparaissent quand on maximize
    if (border && border.style.display == "none") {
		window.style.height = height;
	}
	
	if (! isNaN (width)) {
		//Evite que les ascenceur apparaissent quand on maximize
		if (border && border.style.display == "none") {
			width = width + "px";
			window.style.width = width;
		}
	}
	
	if (frame.initialized) {
//srevel		frame.refreshBorders();
		null;
	}
	
	if(!frame.isNude()){
    	frame.refreshIframeMask();
    }
};


SweetDevRia.Window.prototype.processRestore = function(){
	var restorePosition = true;
	var elementToFocus;
	
	//the click on the second button is not a maximize but actually a restore
	if(!this.getFrame().isNude() && this.isMaximize){
		this.getFrame().setCanDrag(true);
	}
	
	if(this.isMaximize){
		elementToFocus = document.getElementById(this.id+"_maximize");
		this.isMaximize = !this.isMaximize;		
		this.updateServerModel ("state_maximize", this.isMaximize);
	}else if(this.isMinimize){
		elementToFocus = document.getElementById(this.id+"_minimize");
		restorePosition = false;
		this.isMinimize = !this.isMinimize;
		this.updateServerModel ("state_minimize", this.isMinimize);
	}
	
	if (this.canMinimize) {
		var minimizeIcon = this.getDomView(SweetDevRia.Window.prototype.dom.minimize);
		minimizeIcon.style.display = "";
	}
	if (this.canMaximize) {
		var maximizeIcon = this.getDomView(SweetDevRia.Window.prototype.dom.maximize);
    	maximizeIcon.style.display = "";
    }
	var restoreIcon = this.getDomView(SweetDevRia.Window.prototype.dom.restore);
	restoreIcon.style.display = "none";
	
	if(!this.getFrame().isNude()){
		this.getFrame().showBorders();
	}
	this.restore(restorePosition);
    this.resizePanel();

    if (elementToFocus) {
    	elementToFocus.focus();
    }

    return;
};

/**
 * Maximize window : 2nd button
 */
SweetDevRia.Window.prototype.maximize = function(){	
	if(this.beforeMaximize()){

	    //not the minimized state : save the coords before processing the maximize
	    if(!this.isMinimize){		
			this.saveCoords();
		}else{
			this.restore(true);
		}
	   
	    this.isMaximize = true;
	    var maximizeIcon = this.getDomView(SweetDevRia.Window.prototype.dom.maximize);
	    //maximizeIcon.className = "ideo-win-maxRestoreIcon";
	    maximizeIcon.style.display = "none";
	    
	    if (this.canMinimize) {
		    var minimizeIcon = this.getDomView(SweetDevRia.Window.prototype.dom.minimize);
		    minimizeIcon.style.display = "";
		}
	    
	    var restoreIcon = this.getDomView(SweetDevRia.Window.prototype.dom.restore);
	    restoreIcon.className = "ideo-win-maxRestoreIcon"; 
	    restoreIcon.style.display = "";    

	    this.moveTo(SweetDevRia.DomHelper.getScrolledLeft (), SweetDevRia.DomHelper.getScrolledTop());

	    if(! this.isNestedWindow && this.maxWidth ==-1 && this.maxHeight ==-1 && !this.getFrame().isNude()){
			this.getFrame().hideBorders();
		}

	    this.resizeTo(this.getMaxWidth() ,this.getMaxHeight() );

	    this.centerOnScreen();
	
//   		this.resizePanel();
	
		this.updateServerModel ("state_maximize", this.isMaximize);
		this.updateServerModel ("x", this.getCoordX());
		this.updateServerModel ("y", this.getCoordY());
		this.updateServerModel ("height", this.coords.height);
		this.updateServerModel ("width", this.coords.width);
	
		var restoreElement = document.getElementById(this.id+"_restore");
		restoreElement.focus();	
	
		if(!this.getFrame().isNude()){
			this.getFrame().setCanDrag(false);
		}
	
		var restoreElement = document.getElementById(this.id+"_restore");  //SWTRIA-1019
		restoreElement.focus();

		this.fireEventListener (SweetDevRia.Window.MAXIMIZE_EVENT);

		this.afterMaximize();
	}	
};

/**
 * Minimize window : 1st button from left side
 */
SweetDevRia.Window.prototype.minimize = function(){
	if(this.beforeMinimize()){        
		this.isMinimize = !this.isMinimize;
	    
	    if(!this.getFrame().isNude() && this.isMaximize){
			this.getFrame().setCanDrag(true);
		}
	    
	    //it is not maximized : we process a real minimize
	    if(!this.isMaximize){
			this.saveCoords();
		}
	    else{//else we restore the coords before minimizing
	    	this.restore(true);
		}
		
	    this.isMinimize = true;
	    var minimizeIcon = this.getDomView(SweetDevRia.Window.prototype.dom.minimize);
	    minimizeIcon.style.display = "none";
	    
	    if (this.canMaximize) {
		    var maximizeIcon = this.getDomView(SweetDevRia.Window.prototype.dom.maximize);
		    maximizeIcon.style.display = "";
		}
	    
	    var restoreIcon = this.getDomView(SweetDevRia.Window.prototype.dom.restore);
	    restoreIcon.className = "ideo-win-minRestoreIcon";
	    restoreIcon.style.display = "";
	    
	    if(!this.getFrame().isNude()){
		    var nBorder = document.getElementById(this.getFrame().contentId+"_north");
		    if(nBorder){
		    	nBorder.style.cursor = "default";
		    }
		    var sBorder = document.getElementById(this.getFrame().contentId+"_south");
		    if(sBorder){
		    	sBorder.style.cursor = "default";
		    }
		}
		
	    var nodeWindow = this.getView();
	    var nodePanel = this.getDomView(SweetDevRia.Window.prototype.dom.panel);
	    var nodeState = this.getDomView(SweetDevRia.Window.prototype.dom.state);
	    var nodeTitle = this.getDomView(SweetDevRia.Window.prototype.dom.title);
	    if(this.docked){
		  nodeWindow.style.width = SweetDevRia.Window.prototype.dockedWidth;
		  nodeWindow.style.marginLeft = SweetDevRia.Window.prototype.dockedMargin;
		}
		
	    nodeWindow.style.height = nodeTitle.offsetHeight + "px";
	    nodePanel.style.display = "none";
		if (nodeState) {
		    nodeState.style.display = "none";
		}
		
	   // YAHOO.util.Event.purgeElement(this.getView(),false,'mousedown');
		if(!this.getFrame().isNude()){
			this.getFrame().showBorders();
		}
		
//		this.resizePanel();
		
		this.getFrame().refreshBorders();
	
	    this.updateServerModel ("state_minimize", this.isMinimize);
		this.updateServerModel ("x", this.getCoordX());
		this.updateServerModel ("y", this.getCoordY());
		this.updateServerModel ("height", this.coords.height);
		this.updateServerModel ("width", this.coords.width);
	
		var restoreElement = document.getElementById(this.id+"_restore");
		restoreElement.focus();
	
		this.fireEventListener (SweetDevRia.Window.MINIMIZE_EVENT);

		this.afterMinimize();
	}
};

/**
 * Open window
 *  SWTRIA-1019
 */
SweetDevRia.Window.prototype.open = function(callerId) {
	if(this.beforeOpen()){
		if(this.isOpen && this.getView().style.display != 'none'){
			return;
		}
	
		this.callerId = callerId;

	   	SweetDevRia.LayoutManager.moveNodeTo(this.getView().id, this.parent);

	    this.getView().style.display = "";
		this.getView().style.top= "0px";
		this.getView().style.left= "0px";
	
		//lazy load
		if(!this.isLoaded){
			if(this.url!=undefined && this.asIframe){
				this.setUrl(this.getUrl());
			}else{
				SweetDevRia.$(this.id+"_zone").callServer();
			}
			this.isLoaded = true;
		}
		else{
			/* SWTRIA-964 & SWTRIA-965 */
			var iframe = document.getElementById (this.id+"_panel");
			iframe.src = this.url; //SWTRIA-965
			this.addIFrameEventLoad();
			/* SWTRIA-964 & SWTRIA-965 */
		}
		
	    this.isOpen = true;

	    this.tryHooking();
	    
	    if(!this.getFrame().isNude()){
	    	this.getFrame().showBorders();
	    }

	    //this line place the window correctly 
	    this.restore(true);

//	    this.moveTo(this.getCoordX(),this.getCoordY());

	    this.setActive();
//	    this.resizePanel();

	    this.updateServerModel ("rendered", true);
	    
//	    SweetDevRia.hideWaitingMessage ();

		this.fireEventListener (SweetDevRia.Window.OPEN_EVENT);

		if(!this.getFrame().isNude && !this.docked){
			this.getFrame().addIframeMask();
		}
		

        var divFirstElement = document.getElementById(this.id + "_first");
        divFirstElement.focus();		
		
//		this.getFrame().refreshBorders();
		// Focus on first window element  SWTRIA-1019
        var divFirstElement = document.getElementById(this.id + "_first");
        divFirstElement.focus();
        
		this.afterOpen();	
	}


};

/** SWTRIA-964
 * Add Listener on Iframe when this is loaded
 */
SweetDevRia.Window.prototype.addIFrameEventLoad = function(){
	var iframe = document.getElementById (this.id+"_panel");
	var event = YAHOO.util.Event.getListeners(iframe,"load");
	if(event==null){
		if(iframe.src!=""){
			YAHOO.util.Event.addListener(iframe.id,"load",this.loadIframe);
		}	
	}
};

/**
 * Moving method.
 * @param {int} dx delta X to move the component to
 * @param {int} dy delta Y to move the component to
 * @private
 * @see Hookable.
 */
SweetDevRia.Window.prototype.onContainerMove = function(dx, dy) {
	// do nothing as it is contained, not popped up 
};

/**
 * Close window
 */
SweetDevRia.Window.prototype.close = function(){
	if(this.beforeClose()){	
		if(!this.isOpen){//function not idempotent !!!
			return;
		}
				
		this.closeHooked();
	    SweetDevRia.Window.prototype.active = null;
	    if( this.getView() ){
	    	this.getView().style.display = "none";
	    }
	
	    this.isOpen = false;
	    
	    if(!this.isMaximize && !this.isMinimize){
	    	this.saveCoords();
	    }
	    
	    if (this.isModal() && this.parentWindow == null) {
		   	var _modalPanel = SweetDevRia.ModalPanel.getInstance();
		 	_modalPanel.hide ();
		
		    var node = this.getView();
		    node.style.zIndex = this.zIndex;
		}
		else if(this.isModal() && this.parentWindow != null){
			SweetDevRia.DomHelper.removeNode(SweetDevRia.DomHelper.get(this.parentWindow.id+"_modal"));
		}
		
		//replace the window
		
		var iframe = document.getElementById (this.id+"_panel"); //SWTRIA-965
		YAHOO.util.Event.removeListener(iframe.id,"load");       //SWTRIA-964
		iframe.src = "";										 //SWTRIA-965
		SweetDevRia.LayoutManager.restoreMovedNode(this.getView().id);
		if(!this.getFrame().isNude() && this.getFrame()){
			this.getFrame().removeIframeMask();
   	}
	    SweetDevRia.Window.prototype.updateActiveWindow();
	    this.updateServerModel ("rendered", false);
	    
		this.fireEventListener (SweetDevRia.Window.CLOSE_EVENT);
		
		if (this.callerId) {  //SWTRIA-1019
		    var callerElement = document.getElementById(this.callerId);
		    callerElement.focus();
		}

		this.afterClose();
	}
};

/**
 * Event call when user click on the menu button (abstract). Override this to have a custom behavior.
 */
SweetDevRia.Window.prototype.menu = function(){
    SweetDevRia.log.debug("Add your event !");
};    

/**
 * Restore the window (not maximized and not minimized)
 * @param {boolean} restorePosition if true, restore the position before the modification
 */
SweetDevRia.Window.prototype.restore = function(restorePosition){

	if(this.beforeRestore()){
	    this.isMinimize = false;
	    this.isMaximize = false;
	    var minimizeIcon = this.getDomView(SweetDevRia.Window.prototype.dom.minimize);
		if(minimizeIcon) {
		    minimizeIcon.className = "ideo-win-minIcon";
		}
	    var maximizeIcon = this.getDomView(SweetDevRia.Window.prototype.dom.maximize);
		if(maximizeIcon) {
	    	maximizeIcon.className = "ideo-win-maxIcon";
		}
		
		if(!this.getFrame().isNude()){
			var nBorder = document.getElementById(this.getFrame().contentId+"_north");
			if(nBorder){
		    	nBorder.style.cursor = "n-resize";
		    }
		    var sBorder = document.getElementById(this.getFrame().contentId+"_south");
		    if(sBorder){
		    	sBorder.style.cursor = "n-resize";	
		    }
		}
		
	    var nodeWindow = this.getView();
	    var nodePanel = this.getDomView(SweetDevRia.Window.prototype.dom.panel);
	    var nodeState = this.getDomView(SweetDevRia.Window.prototype.dom.state);
	    nodePanel.style.display = "";
	    if (nodeState) {
			nodeState.style.display = "";	
		}
	    if(!this.docked){
		    this.resizeTo(restorePosition?this.coords.width:null,this.coords.height);
			
			if( restorePosition ){
		    	this.moveTo(this.getCoordX(),this.getCoordY());
		    }
		}
		else{
			nodeWindow.style.position = SweetDevRia.Window.prototype.dockedPosition;
			nodeWindow.style.top = "30px";
	
			this.setHeight(this.coords.height);		
		}

//	    this.resizePanel();

		this.getFrame().refreshBorders();

	    this.updateForIE();
	    this.setStateBar(this.isStateBar);
	    //this.updateServerModel ("minimize", this.isMinimize);
	    //this.updateServerModel ("maximize", this.isMaximize);
	
		this.fireEventListener (SweetDevRia.Window.RESTORE_EVENT);

		this.afterRestore();
	}

};

/**
 * Return if the window is resizable
 * @type boolean
 */
SweetDevRia.Window.prototype.getReziable = function(){
    return this.isResizable;
};

/**
 * Set if the window is resizable
 * @param {boolean} bool 	The new resizable type.
 */
SweetDevRia.Window.prototype.setReziable = function(bool){
    this.isResizable = bool;
};

/**
 * Show borders of the window for resize
 */
SweetDevRia.Window.prototype.showBorders = function(){
	//TODO
};
/**
 * Hide borders of the window for resize
 */
SweetDevRia.Window.prototype.hideBorders = function(){
   //TODO
};

/**
 * Save window's coordinates and size
 */
SweetDevRia.Window.prototype.saveCoords = function(){
    var node = this.getView();
    this.coords.x = parseInt(node.style.left, 10);
    this.coords.y = parseInt(node.style.top, 10);
    this.coords.width = parseInt(SweetDevRia.DomHelper.parsePx(SweetDevRia.DomHelper.getStyle(node, "width")), 10);
    this.coords.height = parseInt(SweetDevRia.DomHelper.parsePx(SweetDevRia.DomHelper.getStyle(node, "height")), 10);
};


/**
 * SWTRIA-964
 * This method is called after load iframe
 * To be overridden !!
 */
SweetDevRia.Window.prototype.loadIframe = function(){};

/**
 * @private
 */
SweetDevRia.Window.prototype.initialize = function(){

	this.initFrame();

	if (this.parentWindow == null) {
		this.parentWindow = this.parentComponentId == null ? SweetDevRia.container : SweetDevRia.$ (this.parentComponentId);
	}

	if (this.parentWindow != null) {
		this.parentWindow.nestedWindows.add (this);
	}

	if (this.parentWindow != null) {
		this.parent = this.parentWindow.getPanel ();// document.getElementById (this.parentWindow.id+"_panel");

	}
	else {
		this.parent = document.body;
	}

	if (this.docked && !this.getFrame().isNude()) {	
		this.getFrame().group = this.dockingId;
		this.getFrame().allowDocumentDrop = false;
	}

	var panel;
	if (this.url == null || this.asIframe == false) {
		panel = document.getElementById (this.id+"_panel");
		if (this.content) {
			panel.innerHTML =  this.content;
		}
		else {
			var content = document.getElementById (this.id+"_content");
			panel.appendChild(content);
		}
	}
	else if (this.reload ) {
		var iframe = document.getElementById (this.id+"_panel");
		iframe.src = this.url;
		if(iframe.src!=""){
			this.addIFrameEventLoad(); // SWTRIA-964
		}	
	}
	
	if(!this.getFrame().isNude()){
		this.getFrame().resizeMode = (this.isResizable)?SweetDevRia.Frame.RESIZE_MODE_ALL:SweetDevRia.Frame.RESIZE_MODE_NONE;
	}
//	this.getFrame().refreshBorders(); => SREVEL : cette ligne ne serta  rien, la frame sera rafraicit lors de son propre init

	if (this.isMinimize){ this.minimize(); }
	else if (this.isMaximize){ this.maximize(); }

	this.restore(true);

	this.init();

	if (this.parentWindow != null && !this.getFrame().isNude()) {
		this.getFrame().setConstraintId (this.parentWindow.id+"_panel");
	}

	this.tryHooking();

	this.isInitialized = true;

	this.resizePanel ();

	if (this.docked) {
		var container = SweetDevRia.DomHelper.get (this.id+"_container");
		if (container) {
			var win = document.getElementById (this.id);
			container.parentNode.appendChild (win);
			SweetDevRia.DomHelper.addClassName(win, "ideo-win-docked");
			SweetDevRia.DomHelper.removeNode (container);
		}
	}
	else if (! this.isNestedWindow && this.getView().parentNode !=  this.parent) {
		// with firefox, when you move an iframe, this iframe is reloaded, you loose its content.
		// So we can't move the window as a body child in a url case.
		//this.parent.appendChild(this.getView());
		
//		SweetDevRia.showWaitingMessage ("", "ideo-ndg-waitingMessage", false);
		
		SweetDevRia.LayoutManager.moveNodeTo(this.getView().id, this.parent);

	}
	
	/*
	 *  srevel : cette ligne permet de corriger un bug IE en mode iframe.
	 *  Ss IE, en mode !openAtStartup et !loadAtStartup l iframe deborde sur la droite !	
	 */
	 
	if ((this.url != null) && this.asIframe)  {

	    var iframe = this.getPanel ();
		if (iframe.attachEvent){
			var win = this;
			iframe.attachEvent("onload", function () {
				if (browser.isIE) {
				    var iframe = win.getPanel ();
					// SWTRIA-997
					var width = SweetDevRia.DomHelper.getWidth(iframe.parentNode.id);
					// Suppression de la variable delta : correction SREVEL integree
					if (width) {
						iframe.style.width = width + "px";
					}
					// SWTRIA-997
				}
			});
		}

		//SWTRIA-1019
	    var iframe = this.getPanel ();
		if (iframe.attachEvent){
			var win = this;
			iframe.attachEvent("onload", function () {
				if (browser.isIE) {
				    var iframe = win.getPanel ();
					// SWTRIA-997
					var width = SweetDevRia.DomHelper.getWidth(iframe.parentNode.id);
					// Suppression de la variable delta : correction SREVEL integree
					if (width) {
						iframe.style.width = width + "px";
					}
					// SWTRIA-997
				}
			});
		}

		/* Bug SWTRIA-965 */
		if(this.isOpen || this.isLoaded){
			if(iframe == undefined || iframe == null){
				var iframe = document.getElementById (this.id+"_panel");
			}
			iframe.src = this.url;  //Bug SWTRIA-965
			this.addIFrameEventLoad(); //SWTRIA-964
		}
		/* Bug SWTRIA-965 */
	}

};



/**
 * Set good borders size, invisible panel and good z-index for the window at startup
 */
SweetDevRia.Window.prototype.init = function() {
	//TODO border size ?
    this.getDomView(SweetDevRia.Window.prototype.dom.invisiblePanel).style.display = "none";

    this.initZIndex();

	this.setInactive();

    if(this.modal && this.isOpen){
        SweetDevRia.Window.prototype.modalWindow = this;
	}

	//TT 355
    if(this.indexId == (SweetDevRia.Window.prototype.indexIdCounter-1)){
    	SweetDevRia.Window.prototype.updateActiveWindow();
    	if (SweetDevRia.Window.prototype.modalWindow != null) {
        	SweetDevRia.Window.prototype.modalWindow.setActive();
        }
    }

	this.moveTo(this.getCoordX(),this.getCoordY());


};

/**
* Compute the position 0,0 of the window in the X axis to center the window vertically
* @type int
* @return the y coord to center the window in the X axis
* @private
*/
SweetDevRia.Window.prototype.getCenterOnScreenX = function(){
	var clientWidth = null;
	
	var winwidth = SweetDevRia.DomHelper.get(this.id).offsetWidth; 

	if (this.isNestedWindow && this.parentWindow ) {
		
		if (this.parentWindow.url == null) {
			var parentPanel = SweetDevRia.DomHelper.get(this.parentWindow.id+"_panel");
			clientWidth = SweetDevRia.DomHelper.getWidth(parentPanel);
			if(clientWidth < winwidth) {
				clientWidth = winwidth;
			}

			return (SweetDevRia.DomHelper.getScrolledLeft() + ((clientWidth - winwidth) /2));
		}
		else {
			
			var parentPanel = this.parent;
			clientWidth = this.parentWindow.getWidth ();//SweetDevRia.parentWin.SweetDevRia.DomHelper.getClientWidth();

			if(clientWidth < winwidth) {
				clientWidth = winwidth;
			}
	
			return (SweetDevRia.parentWin.SweetDevRia.DomHelper.getScrolledLeft() + ((clientWidth - winwidth) /2));
		}
	}
	else {
		clientWidth = SweetDevRia.DomHelper.getClientWidth();
		if(clientWidth < winwidth) {
			clientWidth = winwidth;
		}

		return (SweetDevRia.DomHelper.getScrolledLeft() + ((clientWidth - winwidth) /2));
	}
};

/**
* Compute the position 0,0 of the window in the Y axis to center the window vertically
* @type int
* @return the y coord to center the window in the Y axis
* @private
*/
SweetDevRia.Window.prototype.getCenterOnScreenY = function(){
	var clientHeight = null;

	var winheight = SweetDevRia.DomHelper.get(this.id).offsetWidth; 

	if (this.isNestedWindow && this.parentWindow ) {
		
		if (this.parentWindow.url == null) {
			var parentPanel = SweetDevRia.DomHelper.get(this.parentWindow.id+"_panel");
			clientHeight = SweetDevRia.DomHelper.getHeight(parentPanel);
			if(clientHeight < winheight) {
				clientHeight = winheight;
			}
	
			return (SweetDevRia.DomHelper.getScrolledTop() + ((clientHeight - winheight) /2));
		}
		else {
			var parentPanel = this.parent;
			clientHeight = this.parentWindow.getHeight ();//SweetDevRia.parentWin.SweetDevRia.DomHelper.getClientHeight();

			if(clientHeight < winheight) {
				clientHeight = winheight;
			}
	
			return (SweetDevRia.parentWin.SweetDevRia.DomHelper.getScrolledTop() + ((clientHeight - winheight) /2));
		}
	}
	else {
		clientHeight = SweetDevRia.DomHelper.getClientHeight();
		if(clientHeight < winheight) {
			clientHeight = winheight;
		}

		return (SweetDevRia.DomHelper.getScrolledTop() + ((clientHeight - winheight) /2));
	}
};

/**
* Center the window in the screen
*/
SweetDevRia.Window.prototype.centerOnScreen = function(){
	this.moveTo(this.getCenterOnScreenX(), this.getCenterOnScreenY());
};


/**
* Return the last saved X coordinate of the window, or compute it as the center on the screen
* @return the last saved X coordinate of the window
* @type int
*/
SweetDevRia.Window.prototype.getCoordX = function(){
	if (!this.docked && this.coords.x == -1) {
		return this.getCenterOnScreenX();
	}
	
    return this.coords.x;
};

/**
* Return the last saved Y coordinate of the window, or compute it as the center on the screen
* @return the last saved Y coordinate of the window
* @type int
*/
SweetDevRia.Window.prototype.getCoordY = function(){
	if (!this.docked && this.coords.y == -1) {
		return this.getCenterOnScreenY();
	}
    return this.coords.y;
};


SweetDevRia.Window.prototype.getPanel = function(){
	return document.getElementById (this.id+"_panel");
};


/**
 * Return width of the window
 * @type int
 */
SweetDevRia.Window.prototype.getWidth = function(){
    var nodeWindow = this.getView();
 	
	return SweetDevRia.DomHelper.getWidth (nodeWindow);
};

/**
 * Set width of the window
 * @param {int} width 	New width of the window
 */
SweetDevRia.Window.prototype.setWidth = function(width){
    var nodeWindow = this.getView();

    if(width<this.minWidth){
    	width = this.minWidth;
    }
    else{
    	if(width>this.getMaxWidth()){
    		width = this.getMaxWidth();
    	}
    }

	nodeWindow.style.width = width + "px";
 
	var iframe = this.getPanel ();
	iframe.style.width = "";
 
	for (var i = 0; i < this.nestedWindows.length; i ++) {
		var nested = this.nestedWindows[i];
		if (nested.isMaximize) {
			nested.setWidth (width);
		}
	}
	
    this.resizePanel();
	this.updateServerModel ("width", width);
};

/**
 * Return height of the window
 * @type int
 */
SweetDevRia.Window.prototype.getHeight = function(){
    var nodeWindow = this.getView();
	
	return SweetDevRia.DomHelper.getHeight (nodeWindow);
};

/**
 * Set height of the window
 * @param {int} height New height of the window
 */
SweetDevRia.Window.prototype.setHeight = function(height){
    var nodeWindow = this.getView();
    if(height<this.minHeight){
    	height = this.minHeight;
    }
    else{
    	if(height>this.getMaxHeight()){
    		height = this.getMaxHeight();
    	}
    }
	
	nodeWindow.style.height = height + "px";
		
	for (var i = 0; i < this.nestedWindows.length; i ++) {
		var nested = this.nestedWindows[i];
		if (nested.isMaximize) {
			nested.setHeight (height);
		}
	}
	
    this.resizePanel();
	this.updateServerModel ("height", height);
};
/**
 * Return X position of the window
 * @type int
 */
SweetDevRia.Window.prototype.getX = function(){
    var nodeWindow = this.getView();
    return parseInt(nodeWindow.style.left, 10);
};
/**
 * Set X position of the window
 * @param {int} x 	New X position of the window
 */
SweetDevRia.Window.prototype.setX = function(x){
    var nodeWindow = this.getView();
    nodeWindow.style.left = x + "px";
	this.updateServerModel ("x", x);
};
/**
 * Return Y position of the window
 * @type int
 */
SweetDevRia.Window.prototype.getY = function(){
    var nodeWindow = this.getView();
    return parseInt(nodeWindow.style.top, 10);
};
/**
 * Set Y position of the window
 * @param {int} y 	New Y position of the window
 */
SweetDevRia.Window.prototype.setY = function(y){
    var nodeWindow = this.getView();
    nodeWindow.style.top = y + "px";
	this.updateServerModel ("y", y);
};

/**
 * Resize window to a new size
 * @param {int} width 	New width of the window
 * @param {int} height 	New height of the window
 */
SweetDevRia.Window.prototype.resizeTo = function(width,height){
 
    var nodeWindow = this.getView();
    if(width){
	    if(width>this.minWidth){
	    	nodeWindow.style.width = width + "px";
	    }
	    else{
	    	nodeWindow.style.width = this.minWidth + "px";
	    }
    }
    if(height>this.minHeight){
    	nodeWindow.style.height = height + "px";
    }
    else{
    	nodeWindow.style.height = this.minHeight + "px";
    }
	
    this.resizePanel();
	
	for (var i = 0; i < this.nestedWindows.length; i ++) {
		var nested = this.nestedWindows[i];
		if (nested.isMaximize) {
			nested.maxWidth = -1;
			nested.maxHeight = -1;
			nested.resizeTo(nested.getMaxWidth(),nested.getMaxHeight());
		}
	}

	var panel = this.getPanel ();
	panel.style.width = "100%";

	this.updateServerModel ("width", parseInt(width, 10));
	this.updateServerModel ("height", height);

};

/**
 * Move window to a new position
 * @param {int} x 	New X position of the window
 * @param {int} y 	New Y position of the window
 */
SweetDevRia.Window.prototype.moveTo = function(x,y){
    var nodeWindow = this.getView();
	
	nodeWindow.style.top = y + "px";
    nodeWindow.style.left = x + "px";

	this.updateServerModel ("x", x);
	this.updateServerModel ("y", y);
};
/**
 * Return smallest width that the window can be
 * @type int
 */
SweetDevRia.Window.prototype.getMinWidth = function(){
    return this.minWidth;
};
/**
 * Set smallest width that the window can be
 * @param {int} width 	New smallest width
 */
SweetDevRia.Window.prototype.setMinWidth = function(width){
    this.minWidth = width;
    if(this.minWidth>this.getWidth()){
    	this.setWidth(this.minWidth);
    }
	this.updateServerModel ("minWidth", width);
};
/**
 * Return smallest height that the window can be
 * @type int
 */
SweetDevRia.Window.prototype.getMinHeight = function(){
    return this.minHeight;
};
/**
 * Set smallest height that the window can be
 * @param {int} height 	New smallest height
 */
SweetDevRia.Window.prototype.setMinHeight = function(height){
    this.minHeight = height;
    if(this.minHeight>this.getHeight()){
    	this.setHeight(this.minHeight);
    }
	this.updateServerModel ("minHeight", height);
};

/**
 * Return greatest width that the window can be
 * @type int
 */
SweetDevRia.Window.prototype.getMaxWidth = function(){
	if (this.maxWidth == -1){
		if (this.isNestedWindow && this.parentWindow && this.parentWindow.url == null) {
			var parentPanel = SweetDevRia.DomHelper.get(this.parentWindow.id+"_panel");
			return SweetDevRia.DomHelper.getWidth (parentPanel);
		}
		else {
			//return YAHOO.util.Dom.getDocumentWidth();
			return YAHOO.util.Dom.getViewportWidth();
		}
	}
    return this.maxWidth;
};
/**
 * Set greatest width that the window can be
 * @param {int} width 	New greatest width
 */
SweetDevRia.Window.prototype.setMaxWidth = function(width){
    this.maxWidth = width;
    if(this.maxWidth<this.getWidth()){
    	this.setWidth(this.maxWidth);
    }
	this.updateServerModel ("maxWidth", width);
};
/**
 * Return greatest height that the window can be
 * @type int
 */
SweetDevRia.Window.prototype.getMaxHeight = function(){
	if (this.maxHeight == -1){
		if (this.isNestedWindow && this.parentWindow && this.parentWindow.url == null) {
			var parentPanel = SweetDevRia.DomHelper.get(this.parentWindow.id+"_panel");
			return SweetDevRia.DomHelper.getHeight (parentPanel);
		}
		else {
			return YAHOO.util.Dom.getViewportHeight();
		}
	}
    return this.maxHeight;
};
/**
 * Set greatest height that the window can be
 * @param {int} height 	New greatest height
 */
SweetDevRia.Window.prototype.setMaxHeight = function(height){
    this.maxHeight = height;
    if(this.maxHeight<this.getHeight()){
    	this.setHeight(this.maxHeight);
    }
	this.updateServerModel ("maxHeight", height);
};
/**
 * Return width of the window when it's minimized
 * @type int
 */
SweetDevRia.Window.prototype.getMinimizeWidth = function(){
    return this.minimizeWidth;
};
/**
 * Set width of the window when it's minimized
 * @param {int} width 	New width of the window when it's minimized
 */
SweetDevRia.Window.prototype.setMinimizeWidth = function(width){
    this.minimizeWidth = width;
	this.updateServerModel ("minimizeWidth", width);
};
/**
 * Return title of the window
 * @type String
 */
SweetDevRia.Window.prototype.getTitle = function(){
    return this.getDomView(SweetDevRia.Window.prototype.dom.titleLabel).innerHTML;
};
/**
 * Set title of the window
 * @param {String} label 	New title of the window
 */
SweetDevRia.Window.prototype.setTitle = function(label){
    this.getDomView(SweetDevRia.Window.prototype.dom.titleLabel).innerHTML = label;
	this.updateServerModel ("title", label);
};
/**
 * Return message of the statebar
 * @type String
 */
SweetDevRia.Window.prototype.getMessage = function(){
    return this.getDomView(SweetDevRia.Window.prototype.dom.stateLabel).innerHTML;
};
/**
 * Set message of the state bar
 * @param {String} label 	New message of the state bar
 */
SweetDevRia.Window.prototype.setMessage = function(label){
    this.getDomView(SweetDevRia.Window.prototype.dom.stateLabel).innerHTML = label;
	this.updateServerModel ("message", label);
};
/**
 * Return if the state bar is visible
 * @type boolean
 */
SweetDevRia.Window.prototype.isStateBar = function(){
    return this.isStateBar;
};
/**
 * Set if the state bar is visible
 * @param {boolean} bool New state bar visibility
 */
SweetDevRia.Window.prototype.setStateBar = function(bool){
    if(bool){
    	this.showStateBar();
    }
    else{
    	this.hideStateBar();
    }
};



/**
 * Show the state bar
 */
SweetDevRia.Window.prototype.showStateBar = function(){
    this.isStateBar = true;
    var state = this.getDomView(SweetDevRia.Window.prototype.dom.state);
	if (state) {
		state.style.display = "";
	}
	
    this.resizePanel();            
};
/**
 * Hide the state bar
 */
SweetDevRia.Window.prototype.hideStateBar = function(){
    this.isStateBar = false;
    this.getDomView(SweetDevRia.Window.prototype.dom.state).style.display = "none";
    this.resizePanel();            
};

/**
 * IE Hack for positioning
 * @private
 */
SweetDevRia.Window.prototype.updateForIE = function(){
	if(this.isOpen && browser.isIE){//TT 354
	    var window = this.getView();

		//JUM : Does not work on IE 7 !!
	 	/*   
	 	window.style.width = (parseInt(SweetDevRia.DomHelper.parsePx(window.offsetWidth), 10)-3) + "px";
	    window.style.width = (parseInt(SweetDevRia.DomHelper.parsePx(window.offsetWidth), 10)-1) + "px";
	   */
	    if(this.docked){
			window.style.width = SweetDevRia.Window.prototype.dockedWidth;
			window.style.marginLeft = SweetDevRia.Window.prototype.dockedMargin;
			var frame =  this.getFrame();
			if (frame.initialized) {
				frame.refreshBorders();
			}
	    }
    }
};


/**
 * Render the invisible panel size
 * @private
 */
SweetDevRia.Window.prototype.renderInvisiblePanelSize = function(){
    var nodeInvisiblePanel = this.getDomView(SweetDevRia.Window.prototype.dom.invisiblePanel);
    nodeInvisiblePanel.style.display = "";

//    nodeInvisiblePanel.style.zIndex = SweetDevRia.DisplayManager.getInstance().getTopZIndex (true);

    var nodePanel = this.getDomView(SweetDevRia.Window.prototype.dom.panel);
    //nodeInvisiblePanel.style.height = parseInt(nodePanel.style.height) + "px";
    nodeInvisiblePanel.style.height = parseInt(nodePanel.offsetHeight, 10) + "px";
};
/**
 * Hide the invisible panel
 * @private
 */
SweetDevRia.Window.prototype.hideInvisiblePanel = function(){
    var nodeInvisiblePanel = this.getDomView(SweetDevRia.Window.prototype.dom.invisiblePanel);
    nodeInvisiblePanel.style.display = "none";
};
/**
 * Set the window inactive
 */
SweetDevRia.Window.prototype.setInactive = function(){

	for (var i = 0; i < this.nestedWindows.length; i ++) {
		var nested = this.nestedWindows[i];
		nested.setInactive();
	}
	
	this.closeHooked();
	
	if (SweetDevRia.Window.prototype.active == this) {
   	    SweetDevRia.Window.prototype.active.updateServerModel ("active", false);
	    SweetDevRia.Window.prototype.active = null;
	}

	SweetDevRia.DomHelper.addClassName( this.getView(), "ideo-win-inactive");
	SweetDevRia.DomHelper.removeClassName( this.getView(), "ideo-win-active");
//TODO    
	this.renderInvisiblePanelSize();
    
	
	this.hideBorders();
};

/**
 * Set window z-index
 * @param {int} zIndex 	New z-index for the window
 */
SweetDevRia.Window.prototype.setZindex = function(zIndex){

    this.zIndex = zIndex;
    var node = this.getView();
    node.style.zIndex = this.zIndex;
	
	if(!this.getFrame().isNude() && !this.docked){
		this.getFrame().addIframeMask ();
	}
	
};
/**
 * Return window z-index
 * @type int
 */
SweetDevRia.Window.prototype.getZindex = function(){
    return this.zIndex;
};
/**
 * Update window z-index
 * @param {Window} obj 	Window to update
 * @private
 */
SweetDevRia.Window.prototype.updateZIndex = function(obj){
    if((SweetDevRia.Window.prototype.instanceByZIndex[obj.getZindex()]===undefined)||((SweetDevRia.Window.prototype.instanceByZIndex[obj.getZindex()]===null))){
        SweetDevRia.Window.prototype.instanceByZIndex[obj.getZindex()] = obj;
        obj.setZindex(obj.getZindex());
        return;
    }
    var oldObj = SweetDevRia.Window.prototype.instanceByZIndex[obj.getZindex()];
    oldObj.zIndex = oldObj.zIndex - 4;
    SweetDevRia.Window.prototype.updateZIndex(oldObj);

    SweetDevRia.Window.prototype.instanceByZIndex[obj.getZindex()] = obj;
    obj.setZindex(obj.getZindex());
};
/**
 * Return if the window is modal
 * @type boolean
 */
SweetDevRia.Window.prototype.isModal = function(){
    return this.modal;
};
/**
 * Set if the window is modal
 * @param {boolean} bool Set if the window is modal
 */
SweetDevRia.Window.prototype.setModal = function(bool){
    this.modal = bool;
};
/**
 * Return if the window is active
 * @type boolean
 */
SweetDevRia.Window.prototype.isActiveWindow = function(){
    return (SweetDevRia.Window.prototype.getActiveWindow() == this);
};
/**
 * Return the active window.
 * @static
 * @type boolean
 */
SweetDevRia.Window.prototype.getActiveWindow = function(){
    return SweetDevRia.Window.prototype.active;
};

/**
 * Return all sister windows wich are the same parent
 * @private
 */
SweetDevRia.Window.prototype.getSisters = function(){
	var sisters = [];
	var windows = SweetDevRia.getInstances ("Window");
	for (var j = 0; j < windows.length; j++) {
		var win = SweetDevRia.$(windows [j]);
		// soit ells ont le mm pere soit elles ne sont ni l une ni l autre nested
		if (win && win != this) {
			if (! win.isNestedWindow && ! this.isNestedWindow ) {
				sisters.add (win);
			}
			else if (win.isNestedWindow && this.isNestedWindow && win.parentWindow == this.parentWindow ){
				sisters.add (win);
			}
		}
	}

	return sisters;
};

/**
 * Set the window active
 */
SweetDevRia.Window.prototype.setActive = function(init){
	
    if(this.isActiveWindow()){
    	return;
    }
    
    //if(SweetDevRia.Window.prototype.isModalActiveWindow()){
    
    if(this.isModalActiveWindow() && this.parentWindow != null){
    	if(this.isModal && SweetDevRia.DomHelper.get(this.parentWindow.id+"_modal") == null){
    		var parentNode = SweetDevRia.DomHelper.get(this.parentWindow.id+"_panel");
    		var childtoAdd = document.createElement('div');
    		childtoAdd.id = this.parentWindow.id+"_modal";
			childtoAdd.style.width = "100%";
			childtoAdd.style.height = "100%";
			childtoAdd.style.position = "absolute";
			childtoAdd.style.top = "0px";
			childtoAdd.style.left = "0px";
			childtoAdd.style.display = "block";
			childtoAdd.style.zIndex = this.getZindex()-1;
			childtoAdd.className = "ideo-mp-main";
    		
    		SweetDevRia.DomHelper.insertChild(parentNode, childtoAdd);
    	}
    	return;
    }
	

	if (this.zIndex) {
	    SweetDevRia.Window.prototype.instanceByZIndex[this.zIndex] = null;
	}
    this.zIndex = SweetDevRia.Window.prototype.baseZindex + (SweetDevRia.Window.prototype.indexIdCounter)*4;
    SweetDevRia.Window.prototype.updateZIndex(this);

	//on 'desactive' les soeurs ,et on active le parent
	var sisters = this.getSisters ();
	for (var i = 0; i < sisters.length; i++) {
		var sister = sisters [i];
		if (sister && sister.setInactive) {
			sister.setInactive();
		}
	}

	// on active le parent
	if (this.isNestedWindow && this.parentWindow) {
		var parent = this.parentWindow;
		parent.setActive ();
	}

	if (init) {
		// on desactive les filles 
		for (var i = 0; i < this.nestedWindows.length; i++) {
			var sister = this.nestedWindows [i];
			sister.setInactive();
		}
	}

    SweetDevRia.Window.prototype.active = this;
	
    this.updateServerModel ("active", true);

	SweetDevRia.DomHelper.removeClassName( this.getView(), "ideo-win-inactive");
	SweetDevRia.DomHelper.addClassName( this.getView(), "ideo-win-active");

    this.hideInvisiblePanel();
    if(this.isResizable){
		this.showBorders();
	}
    else{
		this.hideBorders();
	}

    this.hideInvisibleWindowPanel();

    this.isOpen = true;
    if(this.isModal() && this.parentWindow == null){
        for(var i in SweetDevRia.Window.prototype.instanceByZIndex){
            if(i != "toJSONString" &&(SweetDevRia.Window.prototype.instanceByZIndex[i]!==null)&&(SweetDevRia.Window.prototype.instanceByZIndex[i] != this)){ 
				SweetDevRia.Window.prototype.instanceByZIndex[i].showInvisibleWindowPanel();
			}
        }

		//move the window into the body, and replace it by a marking div
		//SweetDevRia.LayoutManager.moveNodeTo(this.getView().id, this.parent);		
		
		if (!this.docked && ! this.isNestedWindow && this.getView().parentNode !=  this.parent) {
		// with firefox, when you move an iframe, this iframe is reloaded, you loose its content.
		// So we can't move the window as a body child in a url case.
			SweetDevRia.LayoutManager.moveNodeTo(this.getView().id, this.parent);
		}
		
       	var _modalPanel = SweetDevRia.ModalPanel.getInstance();

	    var node = this.getView();
	    //node.style.zIndex = this.zIndex + 1;
		node.style.zIndex = this.zIndex + 2; //Srevel : on ajoute un pour le zindex de l iframe dans le cas d ie 6
		
       	_modalPanel.show (this.zIndex);
    }

};

/**
 * Init z-index
 * @private
 */
SweetDevRia.Window.prototype.initZIndex = function(){
	if (this.zIndex != null){ return;}

	if(SweetDevRia.Window.prototype.baseZindex===null){ 
		SweetDevRia.Window.prototype.baseZindex = SweetDevRia.DisplayManager.getInstance().getTopZIndex (true);
	}
    var zIndex = SweetDevRia.Window.prototype.baseZindex + (this.indexId+1)*4;

    SweetDevRia.Window.prototype.instanceByZIndex[zIndex] = this;
    this.setZindex(zIndex);
};
/**
 * Return if is a modal window active
 * @type boolean
 */
SweetDevRia.Window.prototype.isModalActiveWindow = function(){
    var activeWindow = SweetDevRia.Window.prototype.getActiveWindow();
    return ((activeWindow!==null)&&(activeWindow.isOpen)&&(activeWindow.isModal()));
};
/**
 * Show the invisibleWindowPanel
 * @private
 */
SweetDevRia.Window.prototype.showInvisibleWindowPanel = function(){
    this.getDomView(SweetDevRia.Window.prototype.dom.invisibleWindowPanel).style.display = "block";
};
/**
 * Hide the invisibleWindowPanel
 * @private 
 */
SweetDevRia.Window.prototype.hideInvisibleWindowPanel = function(){
    this.getDomView(SweetDevRia.Window.prototype.dom.invisibleWindowPanel).style.display = "none";
};

/**
 * Update the z-index of the windows
 * @private
 */
SweetDevRia.Window.prototype.updateActiveWindow = function(){
	var zindexes = SweetDevRia.Window.prototype.instanceByZIndex;
	
    var array = new Array();
    for(var j in zindexes){
		if(j != "toJSONString") {
	        array.push(parseInt(j, 10));
		} 
    }
    array = array.sort(function(a,b){return b-a;});

    for(var i=0;i<array.length;i++){
        var windowNode = zindexes[array[i]];
        if(windowNode.isOpen && !(windowNode.isNestedWindow && windowNode.parentComponentId!=this.id) ){
            windowNode.setActive();
            if(windowNode.isModal()){
                for(var ind in zindexes){//TT 355
                    if(ind!= "toJSONString" &&(zindexes[ind]!==null)&&(zindexes[ind] != windowNode)){ zindexes[ind].showInvisibleWindowPanel();}
                }
            }
            else{
                for(var ind2 in zindexes){//TT 355
                    if(ind2 != "toJSONString" &&(zindexes[ind2]!==null)&&(zindexes[ind2] != windowNode)){ zindexes[ind2].hideInvisibleWindowPanel();}
                }
            }
			break;
        }
    }
};

/**
 * Handle keyboard events.
 * @param Event evt Event.
 * @return {boolean} true if event is not active, false if component was closed.
 * @private
 */
SweetDevRia.Window.prototype.handleEvent = function(evt) {
	if (!this.isActiveWindow()) {
		return true;
	}
	if (evt && evt.type) {
		if (evt.type == SweetDevRia.RiaEvent.CLOSE_WINDOW_TYPE) {
			this.close();
			SweetDevRia.EventHelper.stopPropagation(evt.srcEvent);
			SweetDevRia.EventHelper.preventDefault(evt.srcEvent);
			return false;
		}
		else if (evt.type == SweetDevRia.RiaEvent.MAXIMIZE_WINDOW_TYPE) {
			this.maximize();
			SweetDevRia.EventHelper.stopPropagation(evt.srcEvent);
			SweetDevRia.EventHelper.preventDefault(evt.srcEvent);
			return false;
		}
		else if (evt.type == SweetDevRia.RiaEvent.MINIMIZE_WINDOW_TYPE) {
			this.minimize();
			SweetDevRia.EventHelper.stopPropagation(evt.srcEvent);
			SweetDevRia.EventHelper.preventDefault(evt.srcEvent);
			return false;
		}
		else if (evt.type == SweetDevRia.RiaEvent.RESTORE_WINDOW_TYPE) {
			this.restore(true);
			SweetDevRia.EventHelper.stopPropagation(evt.srcEvent);
			SweetDevRia.EventHelper.preventDefault(evt.srcEvent);
			return false;
		}
	}
	
	return true;
};

/**
* Dock a window (docking layout)
* @private
*/
SweetDevRia.Window.prototype.dock = function(windowDockingId){
	this.docked = true;
	this.dockedId = windowDockingId;
};


/**
* Return the url of the window
* @return the url of the window
* @type String
*/
SweetDevRia.Window.prototype.getUrl = function(){
	return this.url;
};

/**
* Set the url of the window
* @param {String} url	the new url
*/
SweetDevRia.Window.prototype.setUrl = function(url){
	this.url = url;
	if(this.asIframe){
	    var iframe = this.getDomView(SweetDevRia.Window.prototype.dom.panel);
		iframe.src = url;
		// Corr SWTRIA-1064
		if (!iframe.src || iframe.src == 'about:blank') {
		    iframe.src = url;
		}
		
		this.addIFrameEventLoad(); // SWTRIA-964
	}
	this.updateServerModel ("url", url);	
};


SweetDevRia.Window.prototype.destroy = function(){
	if( this.getView() ){
		this.getView().parentNode.removeChild(this.getView());
	}
	this.close();
};

SweetDevRia.Window.prototype.render = function(){

	if (this.beforeRender ())  {

		if (this.url) {
//			SweetDevRia.showWaitingMessage ("", "ideo-ndg-waitingMessage", false);
	null;
		}

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

};

SweetDevRia.Window.prototype.processBackwardFocus = function(event) {
    var e = event || window.event;
    if (e.keyCode == 9) {
        if (e.shiftKey) {
            var divLastElement = document.getElementById(this.id + "_last");
            divLastElement.focus();
        }
    }
};


SweetDevRia.Window.prototype.processFocus = function(event) {
    var e = event || window.event;
    if (e.keyCode == 9) {
        if (!e.shiftKey) {
            var divFirstElement = document.getElementById(this.id + "_first");
            divFirstElement.focus();
        }
    }
};


SweetDevRia.Window.prototype.template = "\
<div class=\"ideo-win-main\" id=\"${id}\" {if isOpen==false} style=\"display:none\" {/if} >\
<div id=\"${id}_first\" tabindex=\"0\" onkeydown=\"SweetDevRia.$('${id}').processBackwardFocus(event);\"></div>\
<div id=\"${id}_borderContainer\">\
	<div class=\"ideo-win-invWndPanel\" id=\"${id}_invisibleWindowPanel\"></div>\
	{if displayTitleBar}\
	<div class=\"ideo-win-title\" id=\"${id}_title\" onclick=\"SweetDevRia.$('${id}').setActive(event);\">\
		{if showTitleIcon}\
		<div class=\"ideo-win-titleIcon\" id=\"${id}_menu\" onclick=\"SweetDevRia.$('${id}').menu()\" ondblclick=\"event.cancelBubble = true;\"><img class=\"ideo-win-menuIcon\" src=\"" + SweetDevRIAImagesPath + "/pix.gif\"/></div>\
		{/if}\
		<div class=\"ideo-win-titleLabel\" id=\"${id}_titleLabel\" {if canMaximize} ondblclick=\"SweetDevRia.$('${id}').maximize()\" {/if}>${title}</div>\
		<a id=\"${id}_minimize\" class=\"ideo-win-minIcon\" title=\"${i18n.minimizeButton}\" href=\"javascript:SweetDevRia.$('${id}').minimize();\" {if canMinimize == false}style=\"display: none;\"{/if}></a>\
		<a id=\"${id}_restore\" title=\"${i18n.restoreButton}\" href=\"javascript:SweetDevRia.$('${id}').processRestore();\" style=\"display: none;\"></a>\
		<a id=\"${id}_maximize\" title=\"${i18n.maximizeButton}\" class=\"ideo-win-maxIcon\" href=\"javascript:SweetDevRia.$('${id}').maximize();\" {if canMaximize == false}style=\"display: none;\"{/if}></a>\
		<a id=\"${id}_close\" title=\"${i18n.closeButton}\" class=\"ideo-win-closeIcon\" href=\"javascript:SweetDevRia.$('${id}').close();\" {if canClose == false}style=\"display: none;\"{/if}></a>\
	</div>\
	{else}\
	<div id=\"${id}_title\" style=\"display:none;\"></div>\
	{/if}\
	<div class=\"ideo-win-invPanel\" id=\"${id}_invisiblePanel\" onclick=\"SweetDevRia.$('${id}').setActive(event);\"></div>\
{if ((url != null) && (asIframe==true)) }\
	<iframe width=\"100%\" height=\"100%\"  style=\"border : 0px;padding:0px;margin:0px;{if style}style{/if}\" class=\"ideo-win-panel ${styleClass}\" name=\"${id}_panel\" id=\"${id}_panel\">\
	</iframe>\
{else}\
	<div style=\"border : 0px;{if style}${style}{/if}\" class=\"ideo-win-panel ${styleClass}\" id=\"${id}_panel\" >\
	</div>\
{/if}\
	{if message != null}\
		<div class=\"ideo-win-stateBar\" id=\"${id}_state\">\
			<div class=\"ideo-win-stateBarLabel\" id=\"${id}_stateLabel\">${message}</div>\
		</div>\
	{/if}\
</div>\
<div id=\"${id}_last\" tabindex=\"0\" onkeydown=\"SweetDevRia.$('${id}').processFocus(event);\"></div>\
</div>\
";



