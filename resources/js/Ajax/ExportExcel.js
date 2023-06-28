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
 * Process the export excel by calling the associated action, on server side
 * @param {String} exportId the exportId on the server that will be requested
 * @param {int} exportMode Define if we export in wysiwyg mode or model mode. Possible values are SweetDevRia.Grid.WYSIWYG_EXPORT and SweetDevRia.Grid.MODEL_EXPORT
 * @param {Array} exportdRowIds Array containing all exported row ids. If null, all rows will be exported.
 * @static
 * @private
 */
SweetDevRia_exportExcel = function(exportId, exportMode, exportRowIds, contextId){
		var params = {"exportMode" : exportMode, "exportId" : exportId};
		if(exportRowIds != null && exportRowIds.length > 0){
			params ["exportRowIds"] = exportRowIds.join();
		}
		SweetDevRia.ComHelper.callAction (exportId, "com.ideo.sweetdevria.taglib.grid.export.action.GridExportAction", params, contextId);
};
