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
* @class Browser
* @constructor
* Object determining the browser type (IE/FF) and version
*/
SweetDevRia.Browser = function() {

	var ua, s, i;
	
	this.isIE    = false;  // Internet Explorer
	this.isOpera = false;
	this.isSafari = false;
	this.version = null;

	ua = navigator.userAgent.toLowerCase();

    s = "msie";
	if ((i = ua.indexOf(s)) >= 0){
		this.version = parseFloat(ua.substr(i + s.length));
		this.isIE = true;
	}

	s = "netscape6/";
	if ((i = ua.indexOf(s)) >= 0){
		this.version = parseFloat(ua.substr(i + s.length));
	}

	s = "safari";
	if (ua.indexOf(s) >= 0){
		this.isSafari = true;
	}
	
	s = "opera";
	if (ua.indexOf(s) >= 0){
		this.isOpera = true;
	}

	// Treat any other "Gecko" browser as NS 6.1.
	s = "gecko";
	if (!this.isSafari && !this.isOpera && (ua.indexOf(s) >= 0)){
		this.version = 6.1;
		this.isGecko = true;

		s = "firefox";
		if ((i = ua.indexOf(s)) >= 0){
			this.isFF = true;
			
			this.version = parseFloat(ua.substr(i + s.length + 1, i + s.length + 2));
		}
	}
};

var browser = new SweetDevRia.Browser();