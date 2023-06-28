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
 * @class
 * RIA Base calendar.
 * @constructor
 * @param {String}	id			The id of the table element that will represent the calendar widget
 * @param {String}	containerId	The id of the container element that will contain the calendar table
 * @param {String}	monthyear	The month/year string used to set the current calendar page
 * @param {String}	selected	A string of date values formatted using the date parser. The built-in
 *								default date format is MM/DD/YYYY. Ranges are defined using
 *								MM/DD/YYYY-MM/DD/YYYY. Month/day combinations are defined using MM/DD.
 *								Any combination of these can be combined by delimiting the string with
 *								commas. Example: "12/24/2005,12/25,1/18/2006-1/21/2006"
 */
SweetDevRia.BaseCalendar = function(id, containerId, monthyear, selected) {
	if (arguments.length > 0) {
		this.init(id, containerId, monthyear, selected);
		superClass(this, SweetDevRia.RiaComponent, id, "CalendarBase");
		superClass (this, SweetDevRia.Hookable, id, "CalendarBase");
	}

	/**
	 * Click to open tooltip JavaScript object.
	 * @type ClickToOpen object
	 */
	this.tooltip = null;

	/**
	 * If calendar is hidden, we don't need to render it but we must know that it must be rendered when it will be displayed.
	 */
	this.mustBeRendered = false;

	/**
	 * Acronym counter used to optimize loop.
	 * @type Array
	 */
	this.acronymCounter = 0;

	/**
	 * Date list used for acronyms rendering.
	 * @type Array
	 */
	this.acronymDates = null;

	/**
	 * Acronyms list used for acronyms rendering.
	 * @type Array
	 */
	this.acronymList = null;

	/**
	 * CSS class used for acronyms rendering.
	 * @type Array
	 */
	this.acronymCss = null;
	
	
	/**
	 * Enabled property. If false, inputs are disabled and onclik desactivated
	 */
	this.enabled = true;
};

/* Extending RiaComponent */
extendsClass(SweetDevRia.BaseCalendar, SweetDevRia.RiaComponent, YAHOO.widget.Calendar);
extendsClass(SweetDevRia.BaseCalendar, SweetDevRia.Hookable);
/**
* @private
*/
SweetDevRia.BaseCalendar.prototype._unload = function(e, cal) {
	if (!cal) {
		return;
	}
	for (var c in cal.cells) {
		c = null;
	}
	
	cal.cells = null;
	
	cal.tbody = null;
	cal.oDomContainer = null;
	cal.table = null;
	cal.headerCell = null;
	
	cal = null;
};

/**
 * Override YAHOO.widget.Calendar_Core.render function in order to use generated html.
 */
SweetDevRia.BaseCalendar.prototype.render = function() {
	SweetDevRia.startLog ("Log.Render_"+this.id, this);

	if (this.beforeRender ()) {
		
		/* If the calendar is inside a tooltip and if the tooltip is close, no need to render it now ! */
		if (this.tooltip && !this.tooltip.opened) {
			this.mustBeRendered = true;
			return;
		}
		if (!this.shellRendered) {
			this.table = SweetDevRia.DomHelper.get(this.id + "table");
			this.tbody = SweetDevRia.DomHelper.get(this.id + "tbody");
			this.headerCell = SweetDevRia.DomHelper.get(this.id + "header");
			SweetDevRia.EventHelper.addListener(window, "unload", this._unload, this);
			this.addCells(this.tbody);
			this.shellRendered = true;
			this.buildShellFooter();
		}
	
		this.resetRenderers();
	
		/* reset acronym counter */
		this.acronymCounter = 0;
	
		this.cellDates.length = 0;
	
		// Find starting day of the current month
		var workingDate = YAHOO.widget.DateMath.findMonthStart(this.pageDate);
	
		this.renderHeader();
		this.renderBody(workingDate);
		this.renderFooter();
	
		this.onRender();

		this.fireEventListener (SweetDevRia.RiaComponent.RENDER_EVENT);
		
		this.afterRender ();
	}

	SweetDevRia.endLog ("Log.Render_"+this.id, this, 1);
};

/**
 * This recursive method browse the HTML table object and add each cells to the cells collection.
 * @param {HTMLElement}	node 	a HTML table child node.
 */
SweetDevRia.BaseCalendar.prototype.addCells = function(node) {
	if (node && node.childNodes && node.childNodes.length > 0) {

		for(var i = 0; i < node.childNodes.length; i++) {
			if (!node.childNodes[i]) {
				continue;
			}
			if (node.childNodes[i].nodeName == "TD") {
				this.cells[this.cells.length] = node.childNodes[i];
				
				if (this.enabled) {
					SweetDevRia.EventHelper.addListener(node.childNodes[i], "click", this.doSelectCell, this);
					SweetDevRia.EventHelper.addListener(node.childNodes[i], "mouseover", this.doCellMouseOver, this);
					SweetDevRia.EventHelper.addListener(node.childNodes[i], "mouseout", this.doCellMouseOut, this);
				}
				else {
					YAHOO.util.Event.removeListener(node.childNodes[i], "click", this.doSelectCell);
					YAHOO.util.Event.removeListener(node.childNodes[i], "mouseover", this.doCellMouseOver);
					YAHOO.util.Event.removeListener(node.childNodes[i], "mouseout", this.doCellMouseOut);
				}
				
			} else {
				if (node.childNodes[i].childNodes && node.childNodes[i].childNodes.length > 0) {
					this.addCells(node.childNodes[i]);
				}
			}
		}
	}
};

/*
 * Override YAHOO.widget.Calendar_Core.renderHeader function.
 */
SweetDevRia.BaseCalendar.prototype.renderHeader = function() {
	if (!this.linkMonthLeft) {
		this.linkMonthLeft = SweetDevRia.DomHelper.get(this.id + "navMonthLeft");
		if (this.linkMonthLeft) {
			this.addListenerPrevionsMonth(this.linkMonthLeft);
		}
	}
	if (!this.linkYearLeft) {
		this.linkYearLeft = SweetDevRia.DomHelper.get(this.id + "navYearLeft");
		if (this.linkYearLeft) {
			this.addListenerPrevionsYear(this.linkYearLeft);
		}
	}
	if (!this.linkMonthRight) {
		this.linkMonthRight = SweetDevRia.DomHelper.get(this.id + "navMonthRight");
		if (this.linkMonthRight) {
			this.addListenerNextMonth(this.linkMonthRight);
		}
	}
	if (!this.linkYearRight) {
		this.linkYearRight = SweetDevRia.DomHelper.get(this.id + "navYearRight");
		if (this.linkYearRight) {
			this.addListenerNextYear(this.linkYearRight);
		}
	}
	if (!this.labelMonth) {
		this.labelMonth = SweetDevRia.DomHelper.get(this.id + "Month");
	}
	if (this.labelMonth) {
		this.labelMonth.innerHTML = this.buildMonthLabel();
	}
};

/**
 * Add listener on previous month.
 * @param	{HTMLLink}	link in wich add previous month action.
 */
SweetDevRia.BaseCalendar.prototype.addListenerPrevionsMonth = function(link) {
	if (this.parent) {
		SweetDevRia.EventHelper.addListener(link, "mousedown", this.parent.doPreviousMonth, this.parent);
	} else {
		SweetDevRia.EventHelper.addListener(link, "mousedown", this.previousMonth, this, true);
	}
};

/**
 * Add listener on previous year.
 * @param	{HTMLLink}	link in wich add previous year action.
 */
SweetDevRia.BaseCalendar.prototype.addListenerPrevionsYear = function(link) {
	if (this.parent) {
		SweetDevRia.EventHelper.addListener(link, "mousedown", this.parent.doPreviousYear, this.parent);
	} else {
		SweetDevRia.EventHelper.addListener(link, "mousedown", this.previousYear, this, true);
	}
};

/**
 * Add listener on next month.
 * @param	{HTMLLink}	link in wich add next month action.
 */
SweetDevRia.BaseCalendar.prototype.addListenerNextMonth = function(link) {
	if (this.parent) {
		SweetDevRia.EventHelper.addListener(link, "mousedown", this.parent.doNextMonth, this.parent);
	} else {
		SweetDevRia.EventHelper.addListener(link, "mousedown", this.nextMonth, this, true);
	}
};

/**
 * Add listener on next year.
 * @param	{HTMLLink}	link in wich add next year action.
 */
SweetDevRia.BaseCalendar.prototype.addListenerNextYear = function(link) {
	if (this.parent) {
		SweetDevRia.EventHelper.addListener(link, "mousedown", this.parent.doNextYear, this.parent);
	} else {
		SweetDevRia.EventHelper.addListener(link, "mousedown", this.nextYear, this, true);
	}
};

/*
 * Override YAHOO.widget.Calendar_Core.buildShellFooter function.
 */
SweetDevRia.BaseCalendar.prototype.buildShellFooter = function() {
	if (!this.linkToday && !this.isRestrictedDate(new Date())) {
		this.linkToday = SweetDevRia.DomHelper.get(this.id + "Today");
		this.addListenerGoOnToday(this.linkToday);
	}
	if (!this.linkClear) {
		this.linkClear = SweetDevRia.DomHelper.get(this.id + "Clear");
		this.addListenerClear(this.linkClear);
	}
	if (!this.linkClose) {
		this.linkClose = SweetDevRia.DomHelper.get(this.id + "Close");
		this.addListenerClose(this.linkClose);
	}
};

/**
 * Add listener on "go on today".
 * @param	{HTMLLink}	link in wich add "go on today" action.
 */
SweetDevRia.BaseCalendar.prototype.addListenerGoOnToday = function(link) {
	if (this.parent) {
		SweetDevRia.EventHelper.addListener(link, "mousedown", this.parent.doGoOnToday, this.parent);
	} else {
		SweetDevRia.EventHelper.addListener(link, "mousedown", this.goOnToday, this, true);
	}
};

/**
 * Add listener on clear.
 * @param	{HTMLLink}	link in wich add clear action.
 */
SweetDevRia.BaseCalendar.prototype.addListenerClear = function(link) {
	if (this.parent) {
		SweetDevRia.EventHelper.addListener(link, "mousedown", this.parent.doResetCalendar, this.parent);
	} else {
		SweetDevRia.EventHelper.addListener(link, "mousedown", this.resetCalendar, this, true);
	}
};

/**
 * Add listener on close.
 * @param	{HTMLLink}	link in wich add close action.
 */
SweetDevRia.BaseCalendar.prototype.addListenerClose = function(link) {
	SweetDevRia.EventHelper.addListener(link, "mousedown", this.close, this, true);
};

/*
 * Go on today's date.
 */
SweetDevRia.BaseCalendar.prototype.goOnToday = function() {
	if (!this.enabled ) {return;}

	var now = new Date();
	this.setMonth(now.getMonth());
	this.setYear(now.getFullYear());
	this.render();
};

/**
 * Set focus on selected date or, if not, on today.
 */
SweetDevRia.BaseCalendar.prototype.focus = function() {
	if (this.selectedDates.length === 0 && !this.isRestrictedDate(new Date())) {
		this.goOnToday();
	}
	if (this.setActive) {
		this.setActive(true);
	}
};

/** This function check if date is a restricted date (= not selectionable) or not.
 * Overridden by SimpleCalendar!
 * @param {Date}	New date to check if restricted.
 * @return True if date is a restricted date (not selectable) or false instead.
 * @type boolean
 */
SweetDevRia.BaseCalendar.prototype.isRestrictedDate = function(dat) {
	return false;
}

/**
 * Add a acronym and a rendering for specified dates in dateList.
 * @param	{String}	Date List, separated by comma.
 * @param 	{String[]}	List of acronyms in same order than date list.
 * @param	{String[]}	CSS Style class.
 */
SweetDevRia.BaseCalendar.prototype.addAcronymRender = function(dateList, acronymList, cssStyleClass) {
	this.acronymDates = this._parseDates(dateList);
	this.acronymList = acronymList;
	this.acronymCss = cssStyleClass;
	this.render();
};

/**
* Override YAHOO.widget.Calendar_Core.prototype.render in order to add an acronym on some cells.
* @param {Date} workingDate The current working Date object being used to generate the calendar
* @param {HTMLTableCellElement} cell The current working cell in the calendar
* @return YAHOO.widget.Calendar_Core.STOP_RENDER if rendering should stop with this style, null or nothing if rendering
* should not be terminated
* @type String
*/
SweetDevRia.BaseCalendar.prototype.renderCellDefault = function(workingDate, cell) {
	var acronymAndCss = null;
	
	cell.innerHTML = "";
	
 	/* Check if an acronym list is defined. If yes, add an acronym tag betwee the cell and the link */
	if ((this.acronymDates && this.acronymDates.length !== 0) && (this.acronymCounter < this.acronymDates.length)) {
		acronymAndCss = this.getAcronymAndCss(workingDate);
	 	if (acronymAndCss) {
			this.acronymCounter++;
			var acronym = document.createElement("ACRONYM");
			acronym.title = acronymAndCss[0];
			cell.appendChild(acronym);
			YAHOO.util.Dom.addClass(cell, acronymAndCss[1]);
			cell = acronym;
	 	}
	}

	var link = document.createElement("a");

	link.href="javascript:void(null);";
	link.name=this.id+"__"+workingDate.getFullYear()+"_"+(workingDate.getMonth()+1)+"_"+workingDate.getDate();

	link.appendChild(document.createTextNode(this.buildDayLabel(workingDate)));
	cell.appendChild(link);
	
	if(this.standalone){
		YAHOO.util.Dom.addClass(link, "ideo-cal-cellStandalone");
	}
};

/**
 * This method returns the acronym and the CSS class to apply for a specified date.
 * @param	{Date}		Working date.
 * @return				If found, returns an array composed of acronym at index 0 and the CSS style class to apply on index 1.
 * @type Array
 */
SweetDevRia.BaseCalendar.prototype.getAcronymAndCss = function(workingDate) { 
	var tstYear = true;
	var dat = null,
		i = 0;

	for (; i < this.acronymDates.length; ++i) {
		var aDate = this.acronymDates[i];

		if (aDate.length == 2) { // this is either a range or a month/day combo
			if (aDate[0] instanceof Array) { // this is a range
				// Not available here
				SweetDevRia.log.debug("Range mode is not available for acronym render.");
			} else { // this is a month/day combo
				dat = new Date();
				dat.setMonth( parseInt(aDate[0], 10) - 1 );
				dat.setDate( parseInt(aDate[1], 10) );
			}
		} else if (aDate.length == 3) {
			dat = new Date( parseInt(aDate[0], 10), parseInt(aDate[1], 10) - 1, parseInt(aDate[2], 10), 0, 0, 0);
			tstYear = (dat.getFullYear() == workingDate.getFullYear());
		}
		if (tstYear && 
			(dat.getMonth() == workingDate.getMonth()) && 
			(dat.getDate() == workingDate.getDate())) {
			return new Array ( this.acronymList[i], this.acronymCss[i] );
		}
	}
	return null;
};


/**
 * Override YAHOO.widget.Calendar_Core.prototype.renderBodyCellRestricted. 
 *Renders the current calendar cell as a non-selectable "black-out" date using the default
 * restricted style.
 * @param {Date}					workingDate		The current working Date object being used to generate the calendar
 * @param {HTMLTableCellElement}	cell			The current working cell in the calendar
 * @return	YAHOO.widget.Calendar_Core.STOP_RENDER if rendering should stop with this style, null or nothing if rendering
 *			should not be terminated
 * @type String
 */
SweetDevRia.BaseCalendar.prototype.renderBodyCellRestricted = function(workingDate, cell) {
	YAHOO.util.Dom.addClass(cell, this.Style.CSS_CELL);
	YAHOO.util.Dom.addClass(cell, this.Style.CSS_CELL_RESTRICTED);
	cell.innerHTML=workingDate.getDate();
	return;
};

/**
 * This is an overridden function from RiaComponent.
 * It's called to catch event.
 * @param {RiaEvent}	evt 	RiaEvent object
 */
SweetDevRia.BaseCalendar.prototype.handleEvent = function(evt) {
	if (!this.isActive()) {
		return true;
	}
	if (evt && evt.type && evt.type == SweetDevRia.RiaEvent.KEYBOARD_TYPE) {
		if (evt.keyCode == SweetDevRia.KeyListener.ESCAPE_KEY) {
			if (this.setActive) {
				SweetDevRia.EventHelper.stopPropagation(evt.srcEvent);
				SweetDevRia.EventHelper.preventDefault(evt.srcEvent);
				this.close();
				this.setActive(false);
				return false;
			}
		}
	}
	return true;
};


/**
 * Moving method.
 * @param {int} dx delta X to move the component to
 * @param {int} dy delta Y to move the component to
 */
SweetDevRia.BaseCalendar.prototype.onContainerMove = function(dx, dy) {
	this.tooltip.onContainerMove(dx, dy);
};

/**
 * If the calendar is opened into a tooltip, close it.
 */
SweetDevRia.BaseCalendar.prototype.close = function() {
	if (this.tooltip) {
		if (this.setActive) {
			this.setActive(false);
		}
		this.tooltip.close();
		
		if (this.singleDateField !== null) {
			this.singleDateField.focus ();
		}
		
		this.onClose();
			
		return true;
	} else if (this.parent && this.parent.tooltip) {
		if (this.setActive) {
			this.setActive(false);
		}
		this.parent.tooltip.setActive(false);
		this.parent.tooltip.close();
		this.onClose();
		
		return true;
	}
	return false;
};

/**
 * Get the cell's index for a date if it's found in calendar. Returns -1 if not found.
 * @param {Date}	Date.
 * @return			cell index.
 * @type	{int}
 */
SweetDevRia.BaseCalendar.prototype.getIndex = function(dat) {
	for(var i = 0; i < this.cellDates.length; i++) {
		if (dat.getFullYear() == this.cellDates[i][0] && 
			dat.getMonth() + 1 == this.cellDates[i][1] &&
			dat.getDate() == this.cellDates[i][2]) {
			return i;
		}
	}
	return -1;
};

/**
 * Return true if date is the current's calendar month.
 * @param {Date}	Date.
 * @return			True or false
 * @type	{boolean}
 */
SweetDevRia.BaseCalendar.prototype.onCurrentMonth = function(dat) {
	return dat.getMonth() + 1 == this.cellDates[15][1];
};

/**
 * Open the tooltip or set the focus on it if it's still opened.
 * @param {Date}	Date.
 * @return			False
 * @type	{boolean}
 */
SweetDevRia.BaseCalendar.prototype.openTooltip = function(tooltipLink) {
	if (! this.enabled){ return false; }
	if (SweetDevRia.$(this.id + 'tooltip').open(tooltipLink)) { 
		if(this.tryHooking){	
			this.tryHooking();
		}
		if (this.focus) {
			this.focus();
		}
		if (this.mustBeRendered == true) {
			this.mustBeRendered = false;
			this.render();
		}
		if(this.getFrame()){
			this.getFrame().refreshBorders();
		}
	}
	return false;
};

SweetDevRia.BaseCalendar.prototype._onSelect = function(){
	var dates = this.getSelectedDates();
	for(var i=0;i<dates.length;i++){
		dates[i] = dateToIsoDateString(dates[i]);
	}
	
	if(dates.length === 0){
		dates = null;
	}
	this.id = this.id.substr(0,this.id.length-3);
	this.updateServerModel ("preselect", dates);
	this.id += "Cal";
	
	if (this.superOnSelect){
		this.superOnSelect ();
	}
};

SweetDevRia.BaseCalendar.prototype._onDeselect = function(){
	var dates = this.getSelectedDates();
	for(var i=0;i<dates.length;i++){
		dates[i] = dateToIsoDateString(dates[i]);
	}

	if(dates.length === 0){
		dates = null;
	}
	this.id = this.id.substr(0,this.id.length-3);
	this.updateServerModel ("preselect", dates);
	this.id += "Cal";

	if (this.superOnDeselect){
		this.superOnDeselect ();
	}
};

/**
 * Activate or de-activate the component calendar.
 * @param {boolean}	enabled Choose the method action (activate or de-activate).
 */
SweetDevRia.BaseCalendar.prototype.setEnabled = function(enabled) {
	this.enabled = enabled;

	if (this.dateDayField){ this.dateDayField.disabled = ! this.enabled;} 
	if (this.dateMonthField){ this.dateMonthField.disabled = ! this.enabled;} 
	if (this.dateYearField){ this.dateYearField.disabled = ! this.enabled; }
	if (this.singleDateField){ this.singleDateField.disabled = ! this.enabled;} 
	
	this.cells = [];
	this.addCells(this.tbody);
};

/**
 * Method used to know if a calendar is activated or not.
 * @return The enabled variable.
 * @type {boolean}
 */
SweetDevRia.BaseCalendar.prototype.getEnabled = function() {
	return this.enabled;
};

/**
 * Event to trigger on popup close. Do nothing by default. 
 * To be overridden
 */
SweetDevRia.BaseCalendar.prototype.onClose = function() {
	
};
