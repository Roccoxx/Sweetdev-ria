/*******************************************************************************
 * MenuBar
 ******************************************************************************/


/**
 * This is the MenuBar component class
 * 
 * @param {String}
 *            id Identifiant of this MenuBar
 * @constructor
 * @extends Menu
 * @base Menu
 */
SweetDevRia.MenuBar = function(id){
	superClass (this, SweetDevRia.RiaComponent, id, "SweetDevRia.MenuBar");	
	superClass (this, SweetDevRia.Menu, id);	
	
	this.isOpened = false;
	this.typeMenu = "MenuBar";
};

extendsClass (SweetDevRia.MenuBar, SweetDevRia.RiaComponent, SweetDevRia.Menu);

/**
 * This method is called automatically by the framework at the page load.
 */
SweetDevRia.MenuBar.prototype.initialize = function(){
// menubar_ieHover(this.id);

	// SweetDevRia.EventHelper.addListener(document, "click",
	// SweetDevRia.Menu.hideAll, this);

	this.init ();
};


/**
 * Return the rendering string of subitems
 * 
 * @return rendering string of subitems
 * @type String
 * @private
 */
SweetDevRia.MenuBar.prototype.getItems = function () {
	var str = "";
	for (var i = 0; i < this.items.length; i++) {
		var item = this.items [i];

		str += TrimPath.processDOMTemplate(this.itemTemplate, item);
	}

	return str;
};

/**
 * Hide the MenuBar
 */
SweetDevRia.MenuBar.prototype.hide = function(){

	if (this.beforeHide ())  {
		var view = this.view();

		if (view) {
			var uls = view.getElementsByTagName ("LI");
			for (var i = 0; i < uls.length; i++) {
				if (uls [i].parentNode == view) {
					this.hideSubItems (uls [i].id);
				}
			}
			
			this.isOpened = false;

		}

		this.fireEventListener (SweetDevRia.Menu.HIDE_EVENT);

		this.afterHide();
	}
};

SweetDevRia.MenuBar.prototype.selectItem = function(doFocus){
	var elem = document.getElementById(this.id);
	if (SweetDevRia.DomHelper.hasClassName (elem, "ideo-mnb-barLevel")){
		SweetDevRia.DomHelper.addClassName(elem, "iehovermenubar");
	}
	this.isSelected = true;
	if(this.parentItem != null){
		//On deselectionne son frere
		var currentSelectedItem = this.parentItem.selectedItem;
		if (currentSelectedItem != null && currentSelectedItem != this.id){
			this.parentItem.getItem(currentSelectedItem).unselectItem();
		}
	
		this.parentItem.selectedItem = this.id;
	}
	if(doFocus) {this.focus();}
};

SweetDevRia.MenuBar.prototype.unselectItem = function(){
	var elem = document.getElementById(this.id);
	if (SweetDevRia.DomHelper.hasClassName (elem, "ideo-mnb-barLevel")){
		SweetDevRia.DomHelper.removeClassName(elem, "iehovermenubar");
	}
	this.isSelected = false;
	if(this.parentItem != null){
		this.parentItem.selectedItem = null;
	}
};

SweetDevRia.MenuBar.prototype.itemTemplate = "\
	<li id=\"${id}\" class=\"ideo-mnb-main ideo-mnb-barLevel {if disabled == false && checked == true}ideo-mnu-check{/if}\"  style=\"{if disabled == true}color:gray{/if} {if image !== null}background-image : url(${image});background-repeat : no-repeat;{/if}\" onclick=\"return SweetDevRia.$('${id}')._onclick(event)\" onkeydown=\"return SweetDevRia.$('${id}')._onkeydownMenuBar(event)\" onkeypress=\"SweetDevRia.EventHelper.stopPropagation(event); return false;\" onkeyup=\"SweetDevRia.EventHelper.stopPropagation(event); return false;\" tabindex=\"0\">\
		<span>${label}</span>\
		{if hasItems() == true}\
		<ul id=\"${id}_subItems\" class=\"ideo-mnu-main ideo-mnb-firstLevel\" >\
		${getItems()}\
		</ul>\
		{/if}\
	</li>\
	";

SweetDevRia.MenuBar.prototype.template = "\
<ul id=\"${id}\" class=\"ideo-mnb-main\" >\
	${getItems()}\
</ul>\
";


/*******************************************************************************
 * Internet Explorer hover hack
 ******************************************************************************/


function menubar_ieHover(id) {SweetDevRia.MenuItem.updateZindex (id);}
