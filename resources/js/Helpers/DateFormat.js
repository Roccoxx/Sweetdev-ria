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
 * @class DateFormat
 * @constructor
 */ 
SweetDevRia.DateFormat = function() {null;};

/**
 * Pattern to print dates. Default is "MM/DD/YYYY"
 * @type String
 */
SweetDevRia.DateFormat.pattern = "MM/DD/YYYY";

/**
 * Date separator. Default is "-"
 * @type String
 */
SweetDevRia.DateFormat.separator = "/";

/**
 * MultiDate separator. Default is ","
 * @type String
 */
SweetDevRia.DateFormat.multiDateSeparator = ",";

/**
 * Returns a formated date according to the specified pattern.
 * @param {int} year The year number.
 * @param {int} month The month number.
 * @param {int} day The day number.
 * @return returns the date in the specified pattern.
 * @type String
 */
SweetDevRia.DateFormat.getDateFromPattern = function(year, month, day, pattern, separator) {
	if (pattern == null) {
		pattern = SweetDevRia.DateFormat.pattern;
	}
	if (separator == null) {
		separator = SweetDevRia.DateFormat.separator;
	}

	if (!pattern || !day || !month || !year) {
		SweetDevRia.log.error("Pattern or argument(s) is/are null");
		/*TODO throw("ParseException : The data SweetDevRia.DateFormat.pattern var or one of the argument is null.");
return null;*/
		return "";
	}
	try {
		/* Cast in number */
		year = Number(year);
		month = Number(month);
		day = Number(day);
		var result = pattern,
		day2Num = (day < 10) ? "0" + day : day,
				month2Num = (month < 10) ? "0" + month : month,
						year4Num = year,
						year2Num = ((year % 100) < 10) ? "0" + (year % 100) : year % 100;

						result = result.replace(/DD/, day2Num);
						result = result.replace(/MM/, month2Num);
						result = result.replace(/YYYY/, year4Num);
						result = result.replace(/YY/, year2Num);
						result = result.replace(/\//g, separator);
	} catch (e) {
		SweetDevRia.log.warn("Error on parsing date [" + e + "]");
	}
	return result;
};

SweetDevRia.DateFormat.formatDate = function(date, pattern, separator) {
	return SweetDevRia.DateFormat.getDateFromPattern (1900+date.getYear(), date.getMonth()+1, date.getDate(), pattern, separator);
};


/**
 * Returns a formated day (01, 12, ...)
 * @param {int} day The day number.
 * @return returns the formated day.
 * @type String
 */
SweetDevRia.DateFormat.getDay = function(day) {
	if (!day) {
		SweetDevRia.log.error("Argument is null");
		/*TODO throw("NullPointerException : The day argument is null.");
return null;*/
		return "";
	}
	day = Number(day);
	return String((day < 10) ? "0" + day : day);
};

/**
 * Returns a formated month (01, 12, ...)
 * @param {int} month The month number.
 * @return returns the formated month.
 * @type String
 */
SweetDevRia.DateFormat.getMonth = function(month) {
	if (!month) {
		SweetDevRia.log.error("Argument is null");
		/*TODO throw("NullPointerException : The month argument is null.");
return null;*/
		return "";
	}
	month = Number(month);
	return String((month < 10) ? "0" + month : month);
};

/**
 * Returns a formated year according the the specified pattern.
 * @param {int} year The year number.
 * @return returns the formated year.
 * @type String
 */
SweetDevRia.DateFormat.getYear = function(year) {
	if (!year) {
		SweetDevRia.log.error("Argument is null");
		/*TODO throw("NullPointerException : The year argument is null.");
return null;*/
		return "";
	}

	year = Number(year);
	if (SweetDevRia.DateFormat.pattern.indexOf("YYYY") != -1) {
		return String(year);
	} else {
		return String(((year % 100) < 10) ? "0" + (year % 100) : (year % 100));
	}
};

/**
 * Returns a Date if the date is valid, else null.
 * @param {int} year The year number.
 * @param {int} month The month number.
 * @param {int} day The day number.
 * @return returns the formated year or null if invalid.
 * @type Date
 */
SweetDevRia.DateFormat.getDate = function(year, month, day) {
	year = parseInt(year,10);
	month = parseInt(month,10) - 1;
	day = parseInt(day,10);

	var dat = new Date(year, month, day);

	if (dat.getDate() == day &&
			dat.getMonth() == month &&
			dat.getFullYear() == year) {
		return dat;
	}
	return null;
};

/**
 * Remove separator repetition, remove alphabetic character and add "0" on each value (day, month, year) wich contains only 1 number.
 * @param {HTMLInputTextField} formField HTML input text field.
 */
SweetDevRia.DateFormat.prepareDateField = function (formField) {
	if (formField && formField.value.length > 0) {
		var sep = "";
//		Remove multiple separator
		var separatorRegEx = new RegExp(SweetDevRia.DateFormat.separator + "+", "g");
		formField.value = formField.value.replace(separatorRegEx, SweetDevRia.DateFormat.separator);
//		Remove alphabetic character
		formField.value = formField.value.replace(/[A-Z]+/ig, "");

		var tabDate = formField.value.split(SweetDevRia.DateFormat.separator);
		if (tabDate) {
			formField.value = "";
			for (var i = 0; i < tabDate.length; i++) {
				if (tabDate[i].length == 1) {
					tabDate[i] = "0" + tabDate[i];
				}
				formField.value += sep + tabDate[i];
				sep = SweetDevRia.DateFormat.separator;
			}
		}
	}
};

/**
 * Returns the date value from text representation according to the DateFormat.pattern.
 * @param {string} value The date representation
 * @return returns the date value or null
 * @type Date
 */
SweetDevRia.DateFormat.parseDate = function (value, pattern) {
	if (value.length === 0) {
		return new Date();
	}

	if (pattern == null) {
		pattern = SweetDevRia.DateFormat.pattern;
	}
	pattern = pattern.toUpperCase();

	var day, month, year, yearPattern = 4;
	var format = pattern; //SweetDevRia.DateFormat.pattern.toUpperCase();

	var posDay = format.indexOf("DD");
	if (posDay >= 0) {
		day = value.substring(posDay, posDay+2);
		var posMonth = format.indexOf("MM");
		if (posMonth >=0 ){
			month = value.substring(posMonth, posMonth+2);
			var posYear = format.indexOf("YYYY");
			if (posYear == -1) {
				posYear = format.indexOf("YY");
				yearPattern = 2;
			}
			if (posYear >= 0){
				year = value.substring(posYear, posYear + yearPattern);
				if (yearPattern == 2) {
					year = "20" + year;
				}
				var t=/^[0-9]*$/;
				if (t.test(year) && t.test(month) && t.test(day)){
					year = parseInt(year,10);
					month= parseInt(month,10)-1;
					day = parseInt(day,10);
					var dat = new Date(year,month,day);
					if (dat.getDate() == day &&
							dat.getMonth() == month &&
							dat.getFullYear() == year){

						return dat;
					}
				}
			}
		}
	}
	return null;
};


//Convertion des dates

function dateToIsoDateString(date){
	var year = new String(date.getFullYear());
	var month = new String(date.getMonth()+1);
	if(month.length == 1){
		month = "0" + month;
	}
	var day = new String(date.getDate());
	if(day.length == 1){
		day = "0" + day;
	}
	return "RIA_TYPE_DATE_ISO(" + year + month + day +")";
}

/* TO DO : fusion with SweetDevRia.DateFormat */

DateFormat=function() {
	this.stringFormat="";
	this.reDate="";
	this.yearChars=[];
	this.monthChars=[];
	this.dayChars=[];
};

DateFormat.formats={};

DateFormat.prototype.isValidStringFormat=function(dateString){
	var yearChars=this.yearChars;
	var monthChars=this.monthChars;
	var dayChars=this.dayChars;
	if (this.reDate.test(dateString)){
		try{
			var mois = parseFloat(dateString.substring(this.monthChars[0],this.monthChars[1]));
		} catch(ex) {
			throw("Month parsing error");
		}
		try {
			var jour = parseFloat(dateString.substring(dayChars[0],dayChars[1]));
		} catch(ex) {
			throw("Day parsing error");
		}
		try {
			var annee = parseFloat(dateString.substring(yearChars[0],yearChars[1]));
		} catch(ex) {
			throw("Year parsing error");
		}
		return(ItemsValidator.dateIsValid(annee,mois,jour));
	} 
	else {
		throw("Date parsing error : \""+dateString+"\" is not conform to "+this.stringFormat);
	}
};

/**
 * Returns a Date parsed from @dateString and using the hours and minutes from @objDate
 * BEWARE : dateString is supposed to represent a valid date (for example, "31/02/2009"  conforms to "DD/MM/YYYY" but is not a valid date
 * @param dateString <String>
 * @param objDate <Date | null>
 * @return <Date>
 */
DateFormat.prototype.parseStringFormat=function(dateString, objDate){
	var yearChars=this.yearChars;
	var monthChars=this.monthChars;
	var dayChars=this.dayChars;
	if (this.reDate.test(dateString)) 
	{ 
		try{
			var mois = parseFloat(dateString.substring(this.monthChars[0],this.monthChars[1]));
		} catch(ex) {
			throw("Month parsing error");
		}
		try {
			var jour = parseFloat(dateString.substring(dayChars[0],dayChars[1]));
		} catch(ex) {
			throw("Day parsing error");
		}
		try {
			var annee = parseFloat(dateString.substring(yearChars[0],yearChars[1]));
		} catch(ex) {
			throw("Year parsing error");
		}
		if(objDate) {
			return(new Date(annee,mois-1,jour,objDate.getHours(), objDate.getMinutes()));
		} else {
			return(new Date(annee,mois-1,jour));
		}
	}
	else {
//		TO DO : add a specific error msg
		throw("Date parsing error : \""+dateString+"\" is not conform to "+this.stringFormat);
	}
};

/*
 * TODO Nettoyer le code (f1, f2, f3)
 */
var f1=new DateFormat();
f1.stringFormat="MM/DD/YYYY";
f1.yearChars=[6,10];
f1.monthChars=[0,2];
f1.dayChars=[3,5];
DateFormat.formats[f1.stringFormat]=f1;



f1.basicToStringDate=function (aYear,aMonth,aDay){
	var strDate="";
	strDate +=DateFormat.twoDigits(aMonth);
	strDate += SweetDevRia.DateFormat.separator;
	strDate +=DateFormat.twoDigits(aDay);
	strDate += SweetDevRia.DateFormat.separator;
	strDate +=aYear;
	return(strDate);
};

DateFormat.formats.push;
var f2=new DateFormat();
f2.stringFormat="YYYY/MM/DD";
f2.yearChars=[0,4];
f2.monthChars=[5,7];
f2.dayChars=[8,10]; 
DateFormat.formats[f2.stringFormat]=f2;
f2.basicToStringDate=function (aYear,aMonth,aDay){
	var strDate="";
	strDate +=aYear;
	strDate += SweetDevRia.DateFormat.separator;
	strDate +=DateFormat.twoDigits(aMonth);
	strDate += SweetDevRia.DateFormat.separator;
	strDate +=DateFormat.twoDigits(aDay);
	return(strDate);
};

var f3=new DateFormat();
f3.stringFormat="DD/MM/YYYY";
f3.yearChars=[6,10];
f3.monthChars=[3,5];
f3.dayChars=[0,2];  
DateFormat.formats[f3.stringFormat]=f3;
f3.basicToStringDate=function (aYear,aMonth,aDay){
	var strDate="";
	strDate +=DateFormat.twoDigits(aDay);
	strDate += SweetDevRia.DateFormat.separator;
	strDate +=DateFormat.twoDigits(aMonth);
	strDate += SweetDevRia.DateFormat.separator;
	strDate +=aYear;
	return(strDate);
};

/**
 * format anInteger (two digits max) to be a two digits string
 * @return <String>
 */
DateFormat.twoDigits=function (anInteger){
	var str;
	if(anInteger < 10) {
		str = "0"+anInteger;
	} else {
		str = ""+anInteger;
	}
	return(str);
};

/**
 * Print @oDate according to the DateFormat
 * @param oDate <Date>
 * @return <String>
 */
DateFormat.prototype.toStringDate = function(oDate) {
	var strDate="";
	if(oDate!=null) {
		var aDay = oDate.getDate();
		var aMonth = oDate.getMonth() + 1;
		var aYear=oDate.getFullYear();

		strDate +=this.basicToStringDate(aYear,aMonth,aDay);
		return strDate;
	} else {
		throw ("typage invalide 2 : "+oDate);
	}
};



DateFormat.setCurrentFormat=function(aStringFormat) {
	//alert("DateFormat.setCurrentFormat "+aStringFormat)
	DateFormat.currentFormat=DateFormat.formats[aStringFormat];
	return(DateFormat.currentFormat);
};

DateFormat.getCurrentFormat=function() {
	return(DateFormat.currentFormat);
};

//alert("Yaya Dateformat "+DateFormat);
//DateFormat.setCurrentFormat(SweetDevRia.DateFormat.pattern);