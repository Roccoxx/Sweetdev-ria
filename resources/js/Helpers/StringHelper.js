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
 * @class StringHelper
 * @constructor
 */ 
SweetDevRia.StringHelper = function() {null;};

/**
 * Return a String without the leading and trailing whitespaces
 * @param (String) the string to trim
 * @return (String) Returns a copy of the string, with leading and trailing whitespaces omitted
 */
SweetDevRia.StringHelper.trim = function (aString) {
	return aString.replace(/^\s+|\s+$/g, "");
};

/**
 * Return a String without the leading whitespaces
 * @param (String) the string to trim
 * @return (String) Returns a copy of the string, with leading whitespaces omitted
 */
SweetDevRia.StringHelper.lTrim = function (aString) {
	return aString.replace(/^\s+/, "");
};

/**
 * Return a String without the trailing whitespaces
 * @param (String) the string to trim
 * @return (String) Returns a copy of the string, with trailing whitespaces omitted
 */
SweetDevRia.StringHelper.rTrim = function (aString) {
	return aString.replace(/\s+$/, "");
};
