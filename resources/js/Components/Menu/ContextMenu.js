/*******************************************************************************
 * ContextMenu
 ******************************************************************************/

/**
 * This is the ContextMenu component class
 * 
 * @param {String}
 *            id Identifiant of this ContextMenu
 * @constructor
 * @extends Menu
 * @base Menu
 */
SweetDevRia.ContextMenu = function(id){
	// avoid double inheritance
// superClass (this, SweetDevRia.RiaComponent, id, "SweetDevRia.ContextMenu");
	superClass (this, SweetDevRia.Menu, id);	

	this.containerId = this.id + "_container"; 
	this.str = null;

	this.targetId = null;
	this.typeMenu = "ContextMenu";
};

extendsClass (SweetDevRia.ContextMenu, SweetDevRia.RiaComponent, SweetDevRia.Menu);

/**
 * This method is called before Show the context menu To be overriden !!
 * 
 * @param {Event}
 *            e ContextMenu event (mouse right click)
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.ContextMenu.prototype.beforeShow = function (e){  /* override this */ return true;  };

/**
 * This method is called after Show the context menu To be overriden !!
 */
SweetDevRia.ContextMenu.prototype.afterShow = function (){  /* override this */ };


SweetDevRia.ContextMenu.prototype.initFrame = function(){
	this.createFrame();
	if(!this.getFrame().isNude()){
		this.getFrame().contentId = this.id;
		this.getFrame().resizeMode = SweetDevRia.Frame.RESIZE_MODE_NONE;
		this.getFrame().borderMode = SweetDevRia.Frame.BORDER_MODE_ALL;
		this.getFrame().canDrag = false;
		this.getFrame().showBorderOnOver = false;
		SweetDevRia.init();
	}
};


/**
 * This event type is fired when hide the context menu
 */
SweetDevRia.ContextMenu.HIDE_EVENT = "hide";

/**
 * This event type is fired when show the context menu
 */
SweetDevRia.ContextMenu.SHOW_EVENT = "show";

SweetDevRia.ContextMenu.prototype.handleEvent = function(evt) {
	switch(evt.keyCode) {
		case SweetDevRia.KeyListener.SPACE_KEY:
			this.show(evt);
			// give the focus to the first item element of the menu.
			//menu.items[0].focus();
			this.items[0].selectItem(true);
			SweetDevRia.EventHelper.stopPropagation(evt);
			break;
		default:
			break;
	}
	return false;
};



/**
 * This method is called automatically by the framework at the page load.
 */
SweetDevRia.ContextMenu.prototype.initialize = function(){
	var menu = this;

	var target = document.getElementById(this.targetId);
	if (target) {
		if (!target.tabIndex){target.tabIndex=0;}
		target.oncontextmenu = function(e){return menu.show(e); };
		SweetDevRia.KeyListener.getInstance();
		// SWTRIA-1140 - SWTRIA-1204
		// en conflit avec les evts de la grid editable
		// il faut utiliser le SweetDevRia.KeyListener
	}

	 this.init ();
};

/**
 * Return the associated html element
 * 
 * @return the html element view associated wit this menu
 * @type HtmlElement
 * @private
 */
 /*
	 * SweetDevRia.ContextMenu.prototype.view = function(){ return
	 * document.getElementById(this.id+"_border"); };
	 */

/**
 * Hide the context menu
 */
SweetDevRia.ContextMenu.prototype.hide = function(){

	if (this.beforeHide ())  {

		var view = this.view();

		if (view) {
			var lis = view.getElementsByTagName ("LI");
			for (var i = 0; i < lis.length; i++) {
				if (lis [i].parentNode == view) {
					this.hideSubItems (lis [i].id);
				}
			}

			view.style.display = "none";
			SweetDevRia.LayoutManager.removeTransparentIFrame(this.view().id, this.view());
		}

		this.fireEventListener (SweetDevRia.ContextMenu.HIDE_EVENT);

		this.afterHide();
	}
};

/**
 * Show the context menu
 * 
 * @param {Event}
 *            e ContextMenu event (mouse right click)
 */
SweetDevRia.ContextMenu.prototype.show = function(e){
	if (this.beforeShow (e))  {
		SweetDevRia.Menu.hideAll ();
		
		var container = document.getElementById (this.containerId);
		if (container && this.strWrited != true) {
			container.innerHTML = "&nbsp;"+this.str;

			this.strWrited = true;

			this.initialize ();
		}

		var evt = null;
		try{
			evt = event;
		}
		catch(exp){
			evt = e;
		}

		/**
		 * srevel : the ul list must be a body child. If not, we move it
		 */
		if (this.view().parentNode != document.body) {
			document.body.appendChild (this.view());
	
			var zindex = SweetDevRia.DisplayManager.getInstance().getTopZIndex (true);
			this.view().style.zIndex = zindex+2;
		
			// srevel : obligatoire sinon une ligne apparait (le container vide)
			// ds list.jsp lors de l ouverture du menu contextuel)
			if(container) {
				SweetDevRia.DomHelper.removeNode (container);
			}
		}

		this.view().style.display = "block";

	    var scrollX = SweetDevRia.DomHelper.getScrolledLeft();
		var scrollY = SweetDevRia.DomHelper.getScrolledTop();
		var clientX = evt.clientX-10 + scrollX;
		var clientY = evt.clientY-10 + scrollY;
		if (!clientX || !clientY || evt.type == "keydown"){
			// Ouverture par clavier, on positionne le menu au milieu de son target
			var target = document.getElementById(this.targetId);
			clientX = SweetDevRia.DomHelper.getX(target) + SweetDevRia.DomHelper.getWidth(target)/2;
			clientY = SweetDevRia.DomHelper.getY(target) + SweetDevRia.DomHelper.getHeight(target)/2;
		}
		
		
		YAHOO.util.Dom.setX(this.view(), (clientX));
		YAHOO.util.Dom.setY(this.view(), (clientY));
		
		SweetDevRia.LayoutManager.addMaskIFrame(this.view().id, this.view());		
		
		/*
		 * if(!this.getFrame()){ this.initFrame(); }
		 * this.getFrame().refreshBorders();
		 */

		this.fireEventListener (SweetDevRia.ContextMenu.SHOW_EVENT, e);

		this.afterShow();
		
		return false;
	}
};

/**
 * Render this menu
 */
SweetDevRia.ContextMenu.prototype.render = function() {
	SweetDevRia.startLog ("Log.Render_"+this.id, this);

	if (this.beforeRender ()) {
		var str =  TrimPath.processDOMTemplate(this.template, this);

		this.str = str;
	
		this.fireEventListener (SweetDevRia.RiaComponent.RENDER_EVENT);

		this.afterRender ();
	}

	SweetDevRia.endLog ("Log.Render_"+this.id, this, 1);
};


SweetDevRia.ContextMenu.prototype.template = "\
<ul id=\"${id}\" class=\"ideo-mnu-main\">\
	${getItems()}\
</ul>\
";
