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
 * Force the download of a resource, not displaying it into the browser 
 * @param {String} path the full path of the url to the resource to download
 * @param {String} name the name of the resource displayed on download
 * @param {String} contentType optional content type of the resource to download
 * @param {String} contextId optional the id of the current context
 * @static
 */
SweetDevRia_downloadResource = function(path, name, contentType, contextId){
	SweetDevRia.ComHelper.callAction (null, "com.ideo.sweetdevria.taglib.fileUpload.action.FileuploadAction", {"path":encodeURI(path), "name":name,"contentType":contentType}, contextId);
};

