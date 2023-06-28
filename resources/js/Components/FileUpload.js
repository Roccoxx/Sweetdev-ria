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
 * @class allowing upload file on server
 * @constructor
 * @param {String} id	The id of the FileUpload
 * @private
 */ 
SweetDevRia.FileUpload = function(id) {
	if (id) {
		superClass (this, SweetDevRia.RiaComponent, id, "SweetDevRia.FileUpload");
   	}
   	this.simpleFilter = null;
   	this.regexpFilter = null;
};

SweetDevRia.FileUpload.LINK = "_link";

extendsClass(SweetDevRia.FileUpload, SweetDevRia.RiaComponent);

/**
 * Public APIs
 *
 */

/**
 * This method is called before starting an upload file
 * To be overridden !!
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.FileUpload.prototype.beforeUpload = function(){ return true; };

/**
 * This method is called after having started a file upload
 * To be overridden !!
 */
SweetDevRia.FileUpload.prototype.afterUpload = function(){};

/**
 * This method is called before deleting an uploaded file
 * To be overridden !!
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.FileUpload.prototype.beforeDelete = function(){ return true; };

/**
 * This method is called after sending the request for the file deletion
 * To be overridden !!
 */
SweetDevRia.FileUpload.prototype.afterDelete = function(){};

/**
* Return the input element
* @return Return the input element
* @type HTMLElement
* @private
*/
SweetDevRia.FileUpload.prototype.getInputFile = function() {
	return document.getElementById (this.id);
};

/**
* Return the input element content
* @return Return the input element content
* @type String
*/
SweetDevRia.FileUpload.prototype.getInputFileValue = function() {
	return this.getInputFile().value;
};

/**
* Return the text of the fileupload element
* @return Return the text of the fileupload element
* @type HTMLElement
* @private
*/
SweetDevRia.FileUpload.prototype.getInputFileText = function() {
	return document.getElementById (this.id + "_text");
};

/**
* Return the link element
* @return Return the link element
* @type HTMLElement
* @private
*/
SweetDevRia.FileUpload.prototype.getLink = function() {
	return document.getElementById (this.id+SweetDevRia.FileUpload.LINK);
};

/**
* Filter a file name selected by the user according to the regexp supplied
* @param {String} filename the full path of the filename being filtered
* @return true if the filename validate the filter, false otherwise
* @type boolean
* @private
*/
SweetDevRia.FileUpload.prototype.accept = function(filename) {
	var cutfilename = SweetDevRia.FileUpload.extractFileName(filename);
	if(this.simpleFilter){
		if(!this.simpleFilterRegexp.test(cutfilename)){
			SweetDevRia.log.error("Chosen file:"+filename+" does not match the filter:"+this.simpleFilter);
			return false;
		}
	}
	
	if(this.regexpFilter){
		if(!this.regexpFilterRegexp.test(cutfilename)){
			SweetDevRia.log.error("Chosen file:"+filename+" does not match the filter:"+this.regexpFilter);
			return false;
		}
	}
	
	return true;
};

/**
 * Extract the file name from this full path
 * @param {String} filename the full path file name
 * @return the file name extracted
 * @type String
 */
SweetDevRia.FileUpload.extractFileName = function(filename){
	var lastSlash = filename.lastIndexOf("\\");
	if(lastSlash == -1){
		lastSlash = filename.lastIndexOf("/");
	}
	if(lastSlash==-1){
		return filename;
	}
	return filename.substring(lastSlash+1, filename.length);
};

/**
 * Set a pattern as a simple filter (managing *, ?)
 * Convert it as a real regexp for further use
 * @param {String} filter the filter
 */
SweetDevRia.FileUpload.prototype.setSimpleFilter = function(filter){
	var convert = "^";
	for (var i = 0;i < filter.length; i++) {
		var c = filter.charAt(i);
        switch(c) {
	       case '*':
	          	convert+=".*";
	              break;
	       case '?':
	           convert+=".";
	           break;
	       // escape special regexp-characters
	       case '(': case ')': case '[': case ']': case '$':
	       case '^': case '.': case '{': case '}': case '|':
	       case '\\':
	           convert+="\\";
	           convert+=c;
	           break;
	        default:
	            convert+=c;
	            break;
        }
    }
    convert+='$';
    this.simpleFilter = convert;
    this.simpleFilterRegexp = new RegExp("("+convert.toUpperCase()+"|"+convert.toLowerCase()+")");
};

/**
 * Set a regexp as a filter
 * @param {String} filter the filter
 */
SweetDevRia.FileUpload.prototype.setRegexpFilter = function(filter){
	this.regexpFilter = filter;
    this.regexpFilterRegexp = new RegExp(this.regexpFilter);
};

/**
 * This method is called after the filter fail on matching a file
 * Does nothing by default
 * @param {String} filename the filename failing
 * To be overridden !!
 */
SweetDevRia.FileUpload.prototype.onFilterFail = function(filename) {
	
};

/**
* Function uploading a file
* @private
*/
SweetDevRia.FileUpload.prototype.upload = function() {
	if(this.beforeUpload()){
		this.index = null;
	
		if(this.getInputFileValue() == ""){
			return;
		}
	
		if(!this.accept(this.getInputFileValue())){
			this.getInputFile().value="";
			this.onFilterFail();
			return;
		}
	
		var form = this.getInputFile().form;
		if (form) {
			var actionbkp;
			if(form.action){
				actionbkp = form.action;
			}
			var enctypebkp;
			if(form.enctype){
				enctypebkp = form.enctype;
			}
			var targetbkp;
			if(form.target){
				targetbkp = form.target;
			}
			var methodbkp;
			if(form.method){
				methodbkp = form.method;
			}
			
			form.enctype = "multipart/form-data"; 
			form.target = this.id+"_iframe";
			form.method = "post";
			
			form.action = SweetDevRia.ComHelper.PROXY_URL;
			if( this.contextId ){
				var context = SweetDevRia.PortletContextManager.getInstance().getContextById(this.contextId);
				if( context ){
					form.action = context.proxyUrl;
				}
			}

			(form.action.indexOf ("?")>0) ? form.action += "&" : form.action += "?";
			form.action += SweetDevRia.ComHelper.ID_PAGE+"="+window [SweetDevRia.ComHelper.ID_PAGE];
			form.submit();
	
			var filename = this.getInputFileValue();
			var stillUploadingText = this.stillUploadingText;
			window.onbeforeunload = function () {
				return stillUploadingText+" "+filename;
			};
			
			if(actionbkp){
				form.action = actionbkp;
			}

			if(enctypebkp){
				form.enctype = enctypebkp;
			}

			if(targetbkp){
				form.target = targetbkp;
			}
			
			if(methodbkp){
				form.method = methodbkp;
			}
		}
		
		this.afterUpload();
	}
};

/**
* Called by the server on upload file complete.
* @param {int} index	the number count of the file uploaded
* @param {String} name	the name of the fileupload
* @private
*/
SweetDevRia.FileUpload.prototype.loaded = function(index, name) {
	
	window.onbeforeunload = null;
	
	this.index = index;
	this.name = name;
	
	// disable input file 
	this.getInputFile ().disabled = true;
	
	// display delete link
	//var link = this.getLink();
	//if (link) {
	//	link.style.display = "";
	//}
	
	//this.getInputFileText ().style.display = "";
	
	document.getElementById(this.id+"_text_container").style.display = "";
	
	this.getInputFile ().style.display = "none";
	this.getInputFileText ().value = this.getInputFile ().value;

	this.updateServerModel ("value", this.getInputFile().value.replace(/\\/g,"\\\\\\\\"));
	this.updateServerModel ("index", this.index);
	this.updateServerModel ("name", this.name);
};

/**
* IS the file uploaded or not ?
* @return Return the state of the upload
* @type boolean
*/
SweetDevRia.FileUpload.prototype.isUploaded = function() {
	return 	(this.index != null);
};

/**
* Action triggered on the Delete link. Delete an uploaded file.
*/
SweetDevRia.FileUpload.prototype.deleteFile = function() {
	if(this.beforeDelete()){
	
		// hide delete link
		//var link = this.getLink();
		//if (link) {
		//	link.style.display = "none";
		//}
		//this.getInputFileText().style.display = "none";
		
		document.getElementById(this.id+"_text_container").style.display = "none";
	
		// ajax call to delete file in session
		SweetDevRia.ComHelper.fireEvent (new SweetDevRia.RiaEvent ("deleteFile", this.id, {"sendServer":true, "index":this.index, "name":this.name}), false);
	
		// delete input file value
		this.getInputFile ().form.reset();
		this.getInputFile ().disabled = false;
		this.getInputFile ().style.display = "";
		this.getInputFileText().value = "";
		this.index = null;
		this.name = null;
		
		this.afterDelete();
	}
};

/**
* Action triggered after the process of deletion has been performed on the server. 
* To be overridden.
*/
SweetDevRia.FileUpload.prototype.onDeleteFile = function() {

};



/*
function SweetDevRia.FileUpload.prototype.cacheLoaded () {
	// disable input file 
	this.getInputFile ().disabled = true;
	this.getInputFile ().style.display = "none";
	this.getInputFileText().style.display = "";
	// display delete link
	var link = this.getLink();
	if (link) {
		link.style.display = "";
	}
	this.uploaded = true;
}
*/
