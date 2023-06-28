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
 * RIA Simple Calendar implementation.
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
SweetDevRia.SimpleCalendar = function(id, containerId, monthyear, selected) {
	if (arguments.length > 0)
	{
		this.init(id, containerId, monthyear, selected);
		superClass(this, SweetDevRia.BaseCalendar, id, "CalendarSimple");
	}

	/**
	 * Single date field HTML object.
	 * @type HTMLInputElement
	 */
	this.singleDateField = null;

	/**
	 * HTML day date field object.
	 * @type HTMLInputElement
	 */
	this.dateDayField = null;

	/**
	 * HTML month date field object.
	 * @type HTMLInputElement
	 */
	this.dateMonthField = null;

	/**
	 * HTML year date field object.
	 * @type HTMLInputElement
	 */
	this.dateYearField = null;

	/**
	 * HTML hidden date field object.
	 * @type HTMLInputElement
	 */
	this.hiddenDateField = null;

	/**
	 * CSS class for date bad format.
	 * @type String
	 */
	this.CssBadFormat = "ideo-cal-inputFieldBadFormat";
};
/* Extending SweetDevRia.BaseCalendar */
extendsClass(SweetDevRia.SimpleCalendar, SweetDevRia.BaseCalendar);

/**
 * Is the date from input field valid ?
 * @return true if date is valid, false instead.
 * @type boolean
 */
SweetDevRia.SimpleCalendar.prototype.isSelectedDateValid = function() {
	if (this.dateMonthField) {
		return !SweetDevRia.DomHelper.hasClassName(this.dateMonthField, this.CssBadFormat);
	}
	if (this.singleDateField) {
		return !SweetDevRia.DomHelper.hasClassName(this.singleDateField, this.CssBadFormat);
	}
};

/**
 * Set the input HTML text field synchronized with the calendar.
 * @param {HTMLInputElement} singleDateFieldId	HTML input text field.
 */
SweetDevRia.SimpleCalendar.prototype.addSingleDateField = function(singleDateFieldId) {
	this.singleDateField = SweetDevRia.DomHelper.get(singleDateFieldId);
	this.singleDateField.value = "";
	this.singleDateField.calInstance = this;
	var cal = this;

	/* Accept date on blur */
	SweetDevRia.EventHelper.addListener(this.singleDateField, "blur", cal.onblur, cal, true);
	/* Deactivate calendar to avoid that date change when using arrow keys */
	SweetDevRia.EventHelper.addListener(this.singleDateField, "focus", cal.deactivate, cal, true);
	/* Handle key event on inputs fields */
	SweetDevRia.EventHelper.addListener(this.singleDateField, "keydown", cal.handleInputEvent, cal, true);
};

/**
 * Handle keydown on input fields.
 * @param {Event} event.
 */
SweetDevRia.SimpleCalendar.prototype.handleInputEvent = function(event) {
	// SWTRIA-1226 & SWTRIA-1301 : stop propagation exept for enter key
	if (event && event.keyCode != SweetDevRia.KeyListener.ENTER_KEY) {
		SweetDevRia.EventHelper.stopPropagation(event);
	}
	return true;
};

/**
 * Desactivate the calendar.
 */
SweetDevRia.SimpleCalendar.prototype.deactivate = function() {
	this.close();
};

SweetDevRia.SimpleCalendar.prototype.onblur = function(event) {
	var e = SweetDevRia.EventHelper.getEvent(event);
	this.acceptDate (e.src);
	// SWTRIA-1226
	SweetDevRia.EventHelper.stopPropagation(event);
	return false;
};


/**
 * Set the 3 input HTML text fields (day, month and year) synchronized with the calendar.
 * @param {HTMLInputElement} yearFieldId	HTML year input text field.
 * @param {HTMLInputElement} monthFieldId	HTML month input text field.
 * @param {HTMLInputElement} dayFieldId		HTML day input text field.
 */
SweetDevRia.SimpleCalendar.prototype.addExplodedDateField = function(yearFieldId, monthFieldId, dayFieldId) {
	this.dateYearField = SweetDevRia.DomHelper.get(yearFieldId);
	this.dateYearField.value = "";
	this.dateMonthField = SweetDevRia.DomHelper.get(monthFieldId);
	this.dateMonthField.value = "";
	this.dateDayField = SweetDevRia.DomHelper.get(dayFieldId);
	this.dateDayField.value = "";
	this.dateYearField.calInstance = this;
	this.dateMonthField.calInstance = this;
	this.dateDayField.calInstance = this;
	var cal = this;

	/* Accept date on blur */
	SweetDevRia.EventHelper.addListener(this.dateYearField, "blur", cal.onblur, cal, true);
	SweetDevRia.EventHelper.addListener(this.dateMonthField, "blur", cal.onblur, cal, true);
	SweetDevRia.EventHelper.addListener(this.dateDayField, "blur", cal.onblur, cal, true);
	
	/* Deactivate calendar to avoid that date change when using arrow keys */
	SweetDevRia.EventHelper.addListener(this.dateYearField, "focus", cal.deactivate, cal, true);
	SweetDevRia.EventHelper.addListener(this.dateMonthField, "focus", cal.deactivate, cal, true);
	SweetDevRia.EventHelper.addListener(this.dateDayField, "focus", cal.deactivate, cal, true);
	
	/* Handle key event on inputs fields */
	SweetDevRia.EventHelper.addListener(this.dateYearField, "keydown", cal.handleInputEvent, cal, true);
	SweetDevRia.EventHelper.addListener(this.dateMonthField, "keydown", cal.handleInputEvent, cal, true);
	SweetDevRia.EventHelper.addListener(this.dateDayField, "keydown", cal.handleInputEvent, cal, true);
};

/**
 * Set the input HTML hidden field on calendar in order to update selected date(s).
 * @param {HTMLInputElement} hiddenDateFieldId	HTML input hidden field.
 */
SweetDevRia.SimpleCalendar.prototype.addHiddenDateField = function(hiddenDateFieldId) {
	this.hiddenDateField = SweetDevRia.DomHelper.get(hiddenDateFieldId);
	this.hiddenDateField.value = "";
};

/**
 * Clear all bad format CSS style class on input type.
 */
SweetDevRia.SimpleCalendar.prototype.clearBadFormat = function () {
	SweetDevRia.DomHelper.removeClassName(this.singleDateField, this.CssBadFormat);
	SweetDevRia.DomHelper.removeClassName(this.dateYearField, this.CssBadFormat);
	SweetDevRia.DomHelper.removeClassName(this.dateMonthField, this.CssBadFormat);
	SweetDevRia.DomHelper.removeClassName(this.dateDayField, this.CssBadFormat);
};

/**
 * This fonction return a boolean component if calendar is visible,
 * @return (Boolean)	true if :	- there's a parent with no tooltip;
 * 									- there's a parent with a tooltip opened,
 * 									- there's no tooltip
 * 									- there's a tooltip opened) 
 * 						false in others cases
 */
SweetDevRia.SimpleCalendar.prototype.isCalendarVisible = function () {
	return (this.parent && ((this.parent.tooltip && this.parent.tooltip.opened) || !this.parent.tooltip)) || 
			(!this.tooltip) || 
			(this.tooltip && this.tooltip.opened);
};

/**
 * This fonction return a parsed date
 * If it's correct, the parsed date is returned, if not, an error class is returned
 * @param (String) a String representing a date
 * @return (Date) a parsed Date
 * @throw BadDateException
 * @throw BadFormatException
 */
SweetDevRia.SimpleCalendar.prototype.getParsedCalendarDate = function (value) {
	var verif, dateValue;
	var datePattern = "^" + SweetDevRia.DateFormat.pattern.toUpperCase() + "$";
	datePattern = datePattern.replace("YYYY", "[0-9]{4,4}").replace("YY", "[0-9]{1,2}")
					.replace("DD", "[0-9]{1,2}").replace("MM", "[0-9]{1,2}")
					.replace(/\//g, SweetDevRia.DateFormat.separator);
	verif = new RegExp(datePattern);
	
	if (verif.test(value)) {
		dateValue = SweetDevRia.DateFormat.parseDate(value);
		if (dateValue === null) {
			throw("BadDateException");
		}
	} 
	else {
		throw("BadFormatException");
	}
	
	return dateValue;
};

/**
 * This fonction throw an exception if the range is not valid
 * to be sure that the date is well formatted
 * @param (Date) the calendar date to check
 * @throw UnauthorizedDateException
 * @private
 */
SweetDevRia.SimpleCalendar.prototype.checkCalendarDate = function (date) {
	// check for good date range
	if (date) {
		if(this.minDate){
			if(YAHOO.widget.DateMath.before(date, this.minDate)){
				throw("UnauthorizedMinDateException");
			}
		}
	if(this.maxDate){
			if(YAHOO.widget.DateMath.after(date, this.maxDate)){
				throw("UnauthorizedMaxDateException");
			}
		}
	}
	
	// check for disabled days
	if(this.disabledDays){
		var ddArray = this.disabledDays;
		for(var dd=0;dd<ddArray.length;dd++){
			var ddDate =  ddArray[dd];
			if( ddDate.getTime() == date.getTime() ){
				throw("UnauthorizedDisabledDateException");
			}
		}				
	}
}

/**
 * This function set a new date value from a date
 * If it's correct, date is set on the Calendar, if not, an error class is returned
 * @param {Date/Date[]} a date representing the selection
 */
SweetDevRia.SimpleCalendar.prototype.setValue = function(date) {
	this.resetCalendar();
	var message= "";
	if (date.length){
		// dat's type is Date[] 
		for  (var i=0; i<date.length; i++){
			var dat  = date[i];
			message  += this.setSingleValue(dat);
		}
	}else{
		// date's type is Date 
		message  += this.setSingleValue(date);
	}
	if (message != ""){
		//there one or more exceptions
		this.handleError(message);
	}
};

/**
 * This function set a new date value from a date
 * If it's correct, date is set on the Calendar, if not, an error class is returned
 * @param {Date} a date representing the selection
 */
SweetDevRia.SimpleCalendar.prototype.setSingleValue = function(date) {
	var message = "";
	try{
		this.setNewDateAndFillDateInFields (date);
		this.checkCalendarDate(date)
	} catch (e){
		// The date is  not autorized
		message = this.getErrorMessage(e,date);
	}
	return message;
};

/**
 * This function return the  error message depending on the exception 
 * @param {Exception} the exception thrown
 * @param {Date/Date[]} a date representing the selection
 * @return {String} the error message
 */
SweetDevRia.SimpleCalendar.prototype.getErrorMessage = function(e,date) {
	var message = "";
	// The date is  not autorized
	if (e == "UnauthorizedMinDateException"){
		message = SweetDevRia.MessageHelper.getInstance().getMessage(this.i18n["UnauthorizedMinDateException"],date.toString(),this.minDate.toString())+"\n";
	}
	if (e == "UnauthorizedMaxDateException"){
		message = SweetDevRia.MessageHelper.getInstance().getMessage(this.i18n["UnauthorizedMaxDateException"],date.toString(),this.maxDate.toString())+"\n";
	}
	if (e == "UnauthorizedDisabledDateException"){
		message = SweetDevRia.MessageHelper.getInstance().getMessage(this.i18n["UnauthorizedDisabledDateException"],date.toString())+"\n";
	}
	if (e == "StandAloneSetValueException"){
		message = SweetDevRia.MessageHelper.getInstance().getMessage(this.i18n["StandAloneSetValueException"],date.toString())+"\n";
	}
	return message;
};


/**
 * This function handle a date error
 * @param {String} The error message
 */
SweetDevRia.SimpleCalendar.prototype.handleError = function(message) {
	this.render();
	SweetDevRia.DomHelper.addClassName(this.singleDateField, this.CssBadFormat); //SWTRIA-975
	SweetDevRia.DomHelper.addClassName(this.dateYearField, this.CssBadFormat);
	SweetDevRia.DomHelper.addClassName(this.dateMonthField, this.CssBadFormat);
	SweetDevRia.DomHelper.addClassName(this.dateDayField, this.CssBadFormat);
	SweetDevRia.log.error(message);
};

/**
 * This function checks the date on input type field(s). 
 * If it's correct, date is set on the Calendar, if not, an error class is applied on input type field(s).
 */
SweetDevRia.SimpleCalendar.prototype.acceptDate = function(dateField) {
	if (this.isCalendarVisible()) this.setActive(true);

	SweetDevRia.DomHelper.removeClassName(this, this.CssBadFormat);
	this.clearBadFormat();
	this.deselectAll();

	var verif, dateValue;
	try {
		if (this.singleDateField && this.singleDateField == dateField) {
			// Single field
			var datePattern = "^" + SweetDevRia.DateFormat.pattern.toUpperCase() + "$";
			datePattern = datePattern.replace("YYYY", "[0-9]{4,4}").replace("YY", "[0-9]{1,2}").replace("DD", "[0-9]{1,2}").replace("MM", "[0-9]{1,2}").replace(/\//g, SweetDevRia.DateFormat.separator);
			verif = new RegExp(datePattern);
			if (verif.test(this.singleDateField.value)) {
				SweetDevRia.DateFormat.prepareDateField(this.singleDateField);
				dateValue = SweetDevRia.DateFormat.parseDate(this.singleDateField.value);
				if (dateValue === null) {
					throw("BadDateException");
				}
			} else {
				throw("BadFormatException");
			}
		} else {
			// Multiple fields
			if (dateField == this.dateYearField && SweetDevRia.DateFormat.pattern.toUpperCase().indexOf("YYYY") !== -1) {
				verif = new RegExp("^[0-9]{4,4}$");
			} else {
				verif = new RegExp("^[0-9]{1,2}$");
			}
			if (verif.test(dateField.value)) {
				SweetDevRia.DateFormat.prepareDateField(dateField);
				
				if (this.dateDayField.value.length > 0 &&
					this.dateMonthField.value.length > 0 &&
					this.dateYearField.value.length > 0) {
					
					dateValue = SweetDevRia.DateFormat.getDate(this.dateYearField.value, this.dateMonthField.value, this.dateDayField.value);
					if (dateValue === null) {
						throw("BadDateException");
					}
				}
			} else {
				throw("BadFormatException");
			}
		}
		
		// here, the selected date has been set into dateValue and is well formatted
		if (dateValue) {
			this.checkCalendarDate(dateValue);
			
			this.clearBadFormat();
			this.select(dateValue);
			this.setNewDate(dateValue);
		}
	} catch (e) {
		this.handleError("Error on parsing date [" + e + "]");
	}
	
	this.fireEventListener ("change");
	
	return true;
};

/**
 * Clean the date selected, clean HTML date input text fields and desactivate the calendar.
 * @return True if the reset has been performed, false otherwise
 * @type boolean
 */
SweetDevRia.SimpleCalendar.prototype.resetCalendar = function() {
	if (!this.enabled ) {return false;}

	if (this.parent) {
		this.parent.resetCalendar();
		this.close();
		return true;
	} else {
		this.emptyDatefields();
		this.deselectAll();
		this.setMonth(new Date().getMonth());
		this.setYear(new Date().getFullYear());
		this.render();
		this.setActive(false);
		return true;
	}
	return false;
};

/*
 * Go and selected today's date.
 * Override SweetDevRia.BaseCalendar.prototype.goOnToday.
 */
SweetDevRia.SimpleCalendar.prototype.goOnToday = function() {
	if (!this.enabled ) {return;}
	
	this.deselectAll();
	
	var date = new Date();
	if (!this.isRestrictedDate(date)) {
		this.select(date);
		SweetDevRia.BaseCalendar.prototype.goOnToday.call(this);
		this.fillDateInfields();
	}
	
	this.setActive(true);
};

/**
 * Fill dates HTML input text fields (single field, 3 parts fields and hidden fields).
 */
SweetDevRia.SimpleCalendar.prototype.fillDateInfields = function() {

	if (this.parent) {
		this.parent.fillDateInfields();
	} else {
		if (this.getSelDates().length === 0) {
			this.emptyDatefields();
		} 
		else if (this.getSelDates().length == 1) {
			/* Only 1 date was selected */
			this.clearBadFormat();

			if (this.singleDateField !== null) {
				this.singleDateField.value = SweetDevRia.DateFormat.getDateFromPattern(this.getSelDates()[0][0], this.getSelDates()[0][1], this.getSelDates()[0][2]);
			}
			if (this.hiddenDateField !== null) {
				this.hiddenDateField.value = SweetDevRia.DateFormat.getDateFromPattern(this.getSelDates()[0][0], this.getSelDates()[0][1], this.getSelDates()[0][2]);
			}
			if (this.dateDayField !== null) {
				this.dateDayField.value = SweetDevRia.DateFormat.getDay(this.getSelDates()[0][2]);
			}
			if (this.dateMonthField !== null) {
				this.dateMonthField.value = SweetDevRia.DateFormat.getMonth(this.getSelDates()[0][1]);
			}
			if (this.dateYearField !== null) {
				this.dateYearField.value = SweetDevRia.DateFormat.getYear(this.getSelDates()[0][0]);
			}
		} 
		else {
			/* Multiple dates were selected */
			if (this.hiddenDateField !== null) {
				this.hiddenDateField.value = "";
				for (var i = 0; i < this.getSelDates().length; i++) {
					this.hiddenDateField.value += ((i > 0) ? SweetDevRia.DateFormat.multiDateSeparator : "") + SweetDevRia.DateFormat.getDateFromPattern(this.getSelDates()[i][0], this.getSelDates()[i][1], this.getSelDates()[i][2]);
				}
			}
		}
			
		this.fireEventListener ("change");
		
		
	}
};

/**
 * Returns selected date(s).
 * @return	2-dim arrays : [ [ year, month, day ], [...] ]
 * @type Array
 */
SweetDevRia.SimpleCalendar.prototype.getSelDates = function() {
	if (this.parent) {
		return this.parent.selectedDates;
	} else {
		return this.selectedDates;
	}
};

/**
 * Empty dates HTML input text fields (single field and 3 parts fields).
 */
SweetDevRia.SimpleCalendar.prototype.emptyDatefields = function() {
	this.clearBadFormat();

	if (this.singleDateField !== null) {
		this.singleDateField.value = "";
	}
	if (this.hiddenDateField !== null) {
		this.hiddenDateField.value = "";
	}
	if (this.dateDayField !== null) {
		this.dateDayField.value = "";
	}
	if (this.dateMonthField !== null) {
		this.dateMonthField.value = "";
	}
	if (this.dateYearField !== null) {
		this.dateYearField.value = "";
	}
};


/**
 * This is an overridden function from RiaComponent.
 * It's called to catch event.
 * @param {RiaEvent}	evt 	RiaEvent object
 */
SweetDevRia.SimpleCalendar.prototype.handleEvent = function(evt) {
	if (!this.isActive()) {
		return true;
	}
	var handleEvent = true;
	if(this.tooltip){
		if(document.getElementById(this.id+"tooltip").style.display === "none"){
			handleEvent = false;
		}
	}
	if (evt && evt.type && handleEvent) {
		if (evt.type == SweetDevRia.RiaEvent.KEYBOARD_TYPE) {
			var dat = null,
				keyCode = evt.keyCode;
			if (this.getSelDates().length == 1) {
				dat = new Date(this.getSelDates()[0][0], this.getSelDates()[0][1]-1, this.getSelDates()[0][2]);
			}

			switch(keyCode) {
				case SweetDevRia.KeyListener.ARROW_UP_KEY:
					if (dat) {
						dat = YAHOO.widget.DateMath.subtract(dat, YAHOO.widget.DateMath.DAY, 7);
					}
					break;
				case SweetDevRia.KeyListener.ARROW_LEFT_KEY:
					if (dat) {
						dat = YAHOO.widget.DateMath.subtract(dat, YAHOO.widget.DateMath.DAY, 1);
					}
					break;
				case SweetDevRia.KeyListener.ARROW_DOWN_KEY:
					if (dat) {
						dat = YAHOO.widget.DateMath.add(dat, YAHOO.widget.DateMath.DAY, 7);
					}
					break;
				case SweetDevRia.KeyListener.ARROW_RIGHT_KEY:
					if (dat) {
						dat = YAHOO.widget.DateMath.add(dat, YAHOO.widget.DateMath.DAY, 1);
					}
					break;
				case SweetDevRia.KeyListener.ESCAPE_KEY:
					this.resetCalendar();
					break;
				case SweetDevRia.KeyListener.ENTER_KEY:
				case SweetDevRia.KeyListener.SPACE_KEY:
					SweetDevRia.EventHelper.stopPropagation(evt.srcEvent);
					SweetDevRia.EventHelper.preventDefault(evt.srcEvent);
					this.close();
					this.setActive(false);
					return false;
				default:
					break;
			}

			if (this.Options.MULTI_SELECT) {
				SweetDevRia.log.warn("No keyboard support for multidate calendar !");
				SweetDevRia.EventHelper.stopPropagation(evt.srcEvent);
				SweetDevRia.EventHelper.preventDefault(evt.srcEvent);
				return true;
			}

			// If the date was a restricted date, we should select previous/next date.
			while(this.isRestrictedDate(dat) && !this.isOutOfRangeDate(dat)) {
				switch(keyCode) {
					case SweetDevRia.KeyListener.ARROW_UP_KEY:
					case SweetDevRia.KeyListener.ARROW_LEFT_KEY:
						if (dat) {
							dat = YAHOO.widget.DateMath.subtract(dat, YAHOO.widget.DateMath.DAY, 1);
						}
						break;
					case SweetDevRia.KeyListener.ARROW_DOWN_KEY:
					case SweetDevRia.KeyListener.ARROW_RIGHT_KEY:
						if (dat) {
							dat = YAHOO.widget.DateMath.add(dat, YAHOO.widget.DateMath.DAY, 1);
						}
						break;
					default:
						break;
				}
			}
			
			// set the date if the new date is not restricted
			if (!this.isRestrictedDate(dat)) {
				this.setNewDateAndFillDateInFields(dat);
			}
			SweetDevRia.EventHelper.stopPropagation(evt.srcEvent);
			SweetDevRia.EventHelper.preventDefault(evt.srcEvent);
			return false;
		}
	}
};

/**
 * This function check if date is out of the range or not
 * @param {Date} New date to check is out of the range
 * @return True if date is out of the range or false instead.
 * @type boolean
 */
SweetDevRia.SimpleCalendar.prototype.isOutOfRangeDate = function(dat) {
	if (!this.minDate || !this.maxDate) return false;
	var curDate = new Date (dat.getFullYear(), dat.getMonth(), dat.getDate());
	if (curDate.getTime() < this.minDate.getTime() || curDate.getTime() > this.maxDate.getTime()) {
		return true;
	}
	return false;
}

/** This function check if date is a restricted date (= not selectionable) or not.
 * @param {Date}	New date to check if restricted.
 * @return True if date is a restricted date (not selectable) or false instead.
 * @type boolean
 */
SweetDevRia.SimpleCalendar.prototype.isRestrictedDate = function(dat) {
	// SWTRIA-1231 -> min and max restricted date intervals
	if (this.isOutOfRangeDate(dat)) return true;

	for (var r=0;r<this._renderStack.length;++r) {
		var rArray = this._renderStack[r];
		var type = rArray[0];
		var fn = rArray[2];
		
		var month, day, year;

		if (fn == this.renderBodyCellRestricted) {

			switch (type) {
				case YAHOO.widget.Calendar_Core.DATE:
					month = rArray[1][1];
					day = rArray[1][2];
					year = rArray[1][0];
	
					if (year == dat.getFullYear() && month == (dat.getMonth() + 1) && day == dat.getDate()) {
						return true;
					}
	
					break;
				case YAHOO.widget.Calendar_Core.MONTH_DAY:
					month = rArray[1][0];
					day = rArray[1][1];

					if (month == (dat.getMonth() + 1) && day == dat.getDate()) {
						return true;
					}
					
					break;
				case YAHOO.widget.Calendar_Core.RANGE:
					break;
				case YAHOO.widget.Calendar_Core.WEEKDAY:
					break;
				case YAHOO.widget.Calendar_Core.MONTH:
					month = rArray[1][0];

					if (month == (dat.getMonth() + 1)) {
						return true;
					}
					break;
				default:
					break;
			}
		}
	}
	return false;
};

/**
 * This function set the new date on calendar and fills html inputs fields.
 * @param {Date}	the new date to set.
 */
SweetDevRia.SimpleCalendar.prototype.setNewDateAndFillDateInFields = function(dat) {
	if (!this.Options.MULTI_SELECT )this.select(dat);
	this.setNewDate(dat);
	this.fillDateInfields();
	return true;
};

/**
 * This function set the new date on calendar.
 * If the date is on the same calendar, no render is made to optimize display.
 * @param {Date}	the new date to set.
 */
SweetDevRia.SimpleCalendar.prototype.setNewDate = function(dat) {
    var idx = this.getIndex(dat);

    if (this.parent) {
		var sameMonth = dat.getMonth() == this.pageDate.getMonth();

        /* If the cell is the last or the first, rendering a new display */
        if (idx == -1 || !sameMonth) {
            this.parent.setMonth(dat.getMonth());
            this.parent.setYear(dat.getFullYear());
            this.parent.render();
            idx = this.getIndex(dat);
            if(idx != -1){
            	this.selectCell(idx);
            }
        } else {
            this.selectCell(idx);
        }
        return true;
    } else {
        /* If the cell is the last or the first, rendering a new display */
        var sameMonth = dat.getMonth() == this.pageDate.getMonth();
        if (idx == -1 || !sameMonth) {
            this.setMonth(dat.getMonth());
            this.setYear(dat.getFullYear());
            this.render();
            idx = this.getIndex(dat);
            if(idx != -1){
            	this.selectCell(idx);
            }
        } else {
            this.selectCell(idx);
        }
        return true;
    }
    return false;
};

/**
 * Yahoo method override.
 */
SweetDevRia.SimpleCalendar.prototype.wireCustomEvents = function() {
	/**
	 * 
	 * @param	e		The event
	 * @param	cal		A reference to the calendar passed by the Event utility
	 */
	this.doSelectCell = function(e, cal) {
		// Component is active !
		cal.setActive(true);

		var cell = this;
		var index = cell.index;
		var d = cal.cellDates[index];
		var date = new Date(d[0],d[1]-1,d[2]);
		
		if (! cal.isDateOOM(date) && ! YAHOO.util.Dom.hasClass(cell, cal.Style.CSS_CELL_RESTRICTED) && ! YAHOO.util.Dom.hasClass(cell, cal.Style.CSS_CELL_OOB)) {
			var link = null;
			if (cal.Options.MULTI_SELECT) {
				link = cell.getElementsByTagName("A")[0];
				link.blur();
				
				var cellDate = cal.cellDates[index];
				var cellDateIndex = cal._indexOfSelectedFieldArray(cellDate);
				
				if (cellDateIndex > -1) {	
					cal.deselectCell(index);
				} else {
					cal.selectCell(index);
					cal.onSelectDate(date);
				}	
				
			} else {
				link = cell.getElementsByTagName("A")[0];
				link.blur();

				cal.selectCell(index);
				cal.onSelectDate(date);
				cal.close();
			}
		}
		cal.fillDateInfields();
		
		SweetDevRia.EventHelper.stopPropagation (e);
	};
};

/**
 * Selects a cell corresponding to the date in parameter
 * To be overridden
 * @param {Date} date the date to select
 */
SweetDevRia.SimpleCalendar.prototype.onSelectDate = function(date){
	
};
