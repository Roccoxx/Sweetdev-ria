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
* This is the PageBar component class 
* @param {String} id Id of this PageBar
* @constructor
* @extends RiaComponent
* @base RiaComponent
*/
SweetDevRia.PageBar  = function (id){
	superClass (this, SweetDevRia.RiaComponent, id, "SweetDevRia.PageBar");
	
	// Total page number
	this.pageNumber = null;
	// only used by template
	this.visiblePageNumberArray =  [];
	
	// if true, < and > symbols that allows go to previous and next pages are displayed
	this.showPreviousNext = true;

	// if true, << and >> symbols that allows go to first and last pages are displayed
	this.showFirstLast = true;
		
	// indicate how many page number will be displayed. Defauilt is 7;
	this.visiblePageNumber = 9;
		
	// actual page number
	this.actualPage = null;
	
	// Associated component identifiant. The page bar will call the goToPage method of this sweetdevria component.
	this.linkedId = null;

	this.displayPageMode = SweetDevRia.PageBar.ALL_PAGES_MODE;
	
	this.renderFrame = true;
	
	this.alwaysVisible = false; // SWTRIA-1306 Visible even if zero or one page. false by default;
	
	// Debut SWTRIA-987
	// On verifie que les messages de ressources necessaire soient soit definis soit une chaine vide.
	if (!this.getMessage("firstTitle")){ this.i18n["firstTitle"] = "";}
	if (!this.getMessage("prevTitle")){ this.i18n["prevTitle"] = "";}
	if (!this.getMessage("nextTitle")){ this.i18n["nextTitle"] = "";}
	if (!this.getMessage("lastTitle")){ this.i18n["lastTitle"] = "";}
	if (!this.getMessage("noFirstTitle")){ this.i18n["noFirstTitle"] = "";}
	if (!this.getMessage("noPrevTitle")){ this.i18n["noPrevTitle"] = "";}
	if (!this.getMessage("noNextTitle")){ this.i18n["noNextTitle"] = "";}
	if (!this.getMessage("noLastTitle")){ this.i18n["noLastTitle"] = "";}
	// Fin SWTRIA-987

};

SweetDevRia.PageBar.ALL_PAGES_MODE = 0;
SweetDevRia.PageBar.RESUME_MODE = 1;

extendsClass (SweetDevRia.PageBar, SweetDevRia.RiaComponent);

SweetDevRia.PageBar.prototype.initialize = function () {
	if (this.renderFrame) {
		var button = new SweetDevRia.Button (this.id+"_button");
		button.contentId = this.id+"_container";
		
		button.initialize ();
		button.initialized = true;	
	}
	//SWTRIA-1303 : code supprime	

	this.initialized = true;
};


SweetDevRia.PageBar.prototype.refresh = function () {
	
	var button = document.getElementById (this.id+"_button");
	if (button != null) {

		var span = document.createElement ("span");
		span.id = this.id+"_container";
		SweetDevRia.DomHelper.addClassName (span, "ideo-pgb-pagebar");
		
		button.parentNode.insertBefore (span, button);
		
		SweetDevRia.DomHelper.removeNode (button);
	}
	
	// SWTRIA-1306
	var isDisplayed = (this.pageNumber > 1) || (this.alwaysVisible && this.pageNumber > 0);
	//SWTRIA-1303
	//il ne faut pas de display block
	var container = SweetDevRia.DomHelper.get(this.id+"_container");
	if(container){
		container.style.display = isDisplayed?"":"none";
	}
	//SweetDevRia.DomHelper.setVisibility(this.id+"_container", isDiplayed)
	
	this.render ();
	this.initialize ();
	
};

/**
 * @public
 */
SweetDevRia.PageBar.prototype.setVisibility = function (visible) {
	SweetDevRia.DomHelper.setVisibility (this.id+"_button", visible);
};

/**
 * If setted to 'true' the page bar is displayed even if there is only one page.
 * SWTRIA-1306
 * @public
 */
SweetDevRia.PageBar.prototype.setAlwaysVisible = function (visible) {
	this.alwaysVisible = visible;
};

/**
 * SWTRIA-1306
 * @public
 */
SweetDevRia.PageBar.prototype.isAlwaysVisible = function () {
	return this.alwaysVisible;
};


/**
 * This method is called before Set the total page number
 * To be overridden !!
 * @param {int} pageNumber total page number of this page bar
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.PageBar.prototype.beforeSetPageNumber  = function(pageNumber){
	return true;/* override this */
};

/**
 * This method is called after Set the total page number
 * To be overridden !!
 * @param {int} pageNumber total page number of this page bar
 */
SweetDevRia.PageBar.prototype.afterSetPageNumber = function(pageNumber){  /* override this */ };

/**
 * This method is called before Set the selected page number
 * To be overridden !!
 * @param {int} the new selected page number
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.PageBar.prototype.beforeSetActualPage  = function(actualPage){  /* override this */ return true;  };

/**
 * This method is called after Set the selected page number
 * To be overridden !!
 * @param {int} the new selected page number
 */
SweetDevRia.PageBar.prototype.afterSetActualPage = function(actualPage){  /* override this */ };

/**
 * This method is called before Change the page
 * To be overridden !!
 * @param {int} pageNumber The new selected page number
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.PageBar.prototype.beforeGoToPage  = function(pageNumber){  /* override this */ return true;  };

/**
 * This method is called after Change the page
 * To be overridden !!
 * @param {int} pageNumber The new selected page number
 */
SweetDevRia.PageBar.prototype.afterGoToPage = function(pageNumber){  /* override this */ };

/**  SWTRIA-943
 * This method is called when clicking on previous page button when the pagebar is on the first page already.
 * To be overridden !!
 * @param {event} the click event
 */
SweetDevRia.PageBar.prototype.onNoPreviousPageEvent = function (event) {  /* override this */ };

/**  SWTRIA-943
 * This method is called when clicking on next page button when the pagebar is on the last page already.
 * To be overridden !!
 * @param {event} the click event
 */
SweetDevRia.PageBar.prototype.onNoNextPageEvent = function (event) {  /* override this */ };



/**
 * This event type is fired when change page
 * @static
 */
SweetDevRia.PageBar.GO_PAGE_EVENT = "goPage";



/**
 * Set the total page number
 * @param {int} pageNumber total page number of this page bar
 */
SweetDevRia.PageBar.prototype.setPageNumber =  function (pageNumber) {
	if(this.beforeSetPageNumber(pageNumber)){
		this.pageNumber = pageNumber;
		
		this.visiblePageNumberArray = [];
		for (var i = 0; i < pageNumber; i++) {
			this.visiblePageNumberArray.add(i+1);
		}
		
		this.afterSetPageNumber(pageNumber);
	}
};

/**
 * Set the associated component identifiant. The page bar will call the goToPage method of this sweetdevria component.
 * @param {String} linkedId  Associated component identifiant
 */
SweetDevRia.PageBar.prototype.setLinkedId =  function (linkedId) {
	this.linkedId = linkedId;
};

/**
 * Set the selected page number
 * @param {int} the new selected page number
 */
SweetDevRia.PageBar.prototype.setActualPage =  function (actualPage) {
	if(this.beforeSetActualPage(actualPage)){
		this.actualPage = actualPage;
	
		// only used by template
		this.visiblePageNumberArray =  [];
		
		var beforeAfterVisible = Math.ceil ((this.visiblePageNumber - 1) / 2);
		
		var start = this.actualPage - beforeAfterVisible ;
		if ((this.actualPage + beforeAfterVisible) > this.pageNumber) {
			start = this.pageNumber - this.visiblePageNumber + 1;
		}
		if (start <= 0) {
			start = 1;
		}
		
		var end = start + this.visiblePageNumber - 1;
		if (end > this.pageNumber) {
			end = this.pageNumber;
		}
	
		for (var i = start; i <= end; i++) {
			this.visiblePageNumberArray.add (i);
		}
		
		this.afterSetActualPage(actualPage);
	}
};

/**
 * @private
 */
SweetDevRia.PageBar.prototype.goToPageEvt =  function (evt, pageNumber) {
	SweetDevRia.EventHelper.preventDefault (evt);
	SweetDevRia.EventHelper.stopPropagation (evt);
	
	this.goToPage (pageNumber);
};


/**
 * Change the page. Called by the linked component, or if none, by itself.
 * @param {int} pageNumber The new selected page number
 */
SweetDevRia.PageBar.prototype.goToPage =  function (pageNumber) {
	if(this.beforeGoToPage(pageNumber)){
		if (pageNumber >= 1 && pageNumber <= this.pageNumber) {
			this.setActualPage (pageNumber);
			
			var linkedComp = SweetDevRia.$ (this.linkedId);
			if (linkedComp && linkedComp.goToPage) {
				linkedComp.goToPage(pageNumber);
			}

			this.render ();
			
			//Adjust the pagebar on ff (the span width is not resized automatically)
			var container = document.getElementById (this.id+"_container");
			var tagsA = container.firstChild.childNodes;
			var width = 0;
			
			for(var i=0;i<tagsA.length;i++){
				if(tagsA[i].tagName=='A'){
					width += tagsA[i].clientWidth;
				}
				else if(document.all){
					//IE
					width += 2;
				}
				else{
					//FF
					width += 1;
				}
			}
		}

		this.fireEventListener (SweetDevRia.PageBar.GO_PAGE_EVENT);

		this.afterGoToPage(pageNumber);
	}
};

/**
 * Resize pageBar container
 * @return {int} the new Width
 */
SweetDevRia.PageBar.prototype.ajustContainerWidth =  function () {
	var container = document.getElementById (this.id+"_container");
	var tagsA = container.firstChild.childNodes;
	var width = 0;
	
	for(var i=0;i<tagsA.length;i++){
		if(tagsA[i].tagName=='A'){
			width += tagsA[i].clientWidth;
		}
		else if(document.all){
			//IE
			width += 2;
		}
		else{
			//FF
			width += 1;
		}
	}
	
	container.style.width = width+'px';
	return width;
};

/**
 * Allow to format the text for a page number. For example : "50..99" for page 2. 
 * @param {int} pageNumber The page number to format
 */
SweetDevRia.PageBar.prototype.formatPageNumber =  function (pageNumber) {
	return pageNumber;
};

/**
 * Go to the first page
 */
SweetDevRia.PageBar.prototype.goToFirstPage =  function (evt) {
	this.goToPageEvt (evt, 1);
};

/**
 * Go to the last page
 */
SweetDevRia.PageBar.prototype.goToLastPage =  function (evt) {
	var linkedComp = SweetDevRia.$ (this.linkedId);
	if (linkedComp && linkedComp.getPageNumber) {
		this.pageNumber = linkedComp.getPageNumber();
	}
	this.goToPageEvt (evt, this.pageNumber);
};

/**
 * Go to the previous page
 */
SweetDevRia.PageBar.prototype.goToPreviousPage =  function (evt) {
	var linkedComp = SweetDevRia.$ (this.linkedId);
	if (linkedComp && linkedComp.getActualPage) {
		this.actualPage = linkedComp.getActualPage();
	}
	this.goToPageEvt (evt, this.actualPage - 1);
};

/**
 * Go to the next page
 */
SweetDevRia.PageBar.prototype.goToNextPage =  function (evt) {
	var linkedComp = SweetDevRia.$ (this.linkedId);
	if (linkedComp && linkedComp.getActualPage) {
		this.actualPage = linkedComp.getActualPage();
	}
	this.goToPageEvt (evt, this.actualPage + 1);
};


/* 
srevel : le background-color:white est la correction mystique d un bug tout aussi mystique.
sous IE, la fleche de derniere page se retrouve a la ligne ss le background. ?!?!
*/
/*
SWTRIA-943 ajout des evenements SweetDevRia.PageBar.prototype.onNoPreviousPageEvent
et SweetDevRia.PageBar.prototype.onNoNextPageEvent.
SWTRIA-987 Ajout des tooltips i18n aux boutons
SWTRIA-1306
SWTRIA-1303 display:inline-block inutile sur le span
*/
SweetDevRia.PageBar.prototype.template = 
"<span id=\"${id}\" style=\"line-height:24px;background-color:white;\">\
	{if actualPage > 1}\
		{if showFirstLast == true}<a onclick=\"SweetDevRia.$('${id}').goToFirstPage(event);return false;\" href=\"#\" class=\"ideo-pgb-pageNumber\" title=\"${getMessage('firstTitle')}\"> <div class=\"ideo-pgb-backwardLast\">&nbsp;</div> </a>{/if}\
		{if showPreviousNext == true}<a onclick=\"SweetDevRia.$('${id}').goToPreviousPage(event);return false;\" href=\"#\" class=\"ideo-pgb-pageNumber\" title=\"${getMessage('prevTitle')}\"> <div class=\"ideo-pgb-backward\">&nbsp;</div> </a>{/if}\
	{else}\
		{if showFirstLast == true}<a onclick=\"return false;\" href=\"#\" class=\"ideo-pgb-pageNumber\" title=\"${getMessage('noFirstTitle')}\"> <div class=\"ideo-pgb-no-backwardLast\">&nbsp;</div> </a>{/if}\
		<!-- SWTRIA-943 -->{if showPreviousNext == true}<a onclick=\"SweetDevRia.$('${id}').onNoPreviousPageEvent(event);return false;\" href=\"#\" class=\"ideo-pgb-pageNumber\" title=\"${getMessage('noPrevTitle')}\"> <div class=\"ideo-pgb-no-backward\">&nbsp;</div> </a>{/if}\
	{/if}\
	{if displayPageMode == SweetDevRia.PageBar.ALL_PAGES_MODE}\
	{for num in visiblePageNumberArray}\
 		<a onclick=\"SweetDevRia.$('${id}').goToPageEvt(event, ${num});return false;\" href=\"#\" class=\"{if num == actualPage}ideo-pgb-actualPageNumber{else}ideo-pgb-pageNumber{/if}\"> &nbsp;${formatPageNumber(num)}&nbsp;</a>\
 	{/for}\
 	{else}\
 		<a name=\"${id}_pageInfo\">${actualPage}/${pageNumber}</a><!--SWTRIA-981-->\
 	{/if}\
	{if actualPage < pageNumber}\
		{if showPreviousNext == true}<a onclick=\"SweetDevRia.$('${id}').goToNextPage(event);return false;\" href=\"#\" class=\"ideo-pgb-pageNumber\" title=\"${getMessage('nextTitle')}\"> <div class=\"ideo-pgb-forward\">&nbsp;</div></a>{/if}\
		{if showFirstLast == true}<a onclick=\"SweetDevRia.$('${id}').goToLastPage(event);return false;\" href=\"#\" class=\"ideo-pgb-pageNumber\" title=\"${getMessage('lastTitle')}\"> <div class=\"ideo-pgb-forwardLast\">&nbsp;</div> </a>{/if}\
	{else}\
		<!-- SWTRIA-943 -->{if showPreviousNext == true}<a onclick=\"SweetDevRia.$('${id}').onNoNextPageEvent(event);return false;\" href=\"#\" class=\"ideo-pgb-pageNumber\" title=\"${getMessage('noNextTitle')}\"> <div class=\"ideo-pgb-no-forward\">&nbsp;</div></a>{/if}\
		{if showFirstLast == true}<a onclick=\"return false;\" href=\"#\" class=\"ideo-pgb-pageNumber\" title=\"${getMessage('noLastTitle')}\"> <div class=\"ideo-pgb-no-forwardLast\">&nbsp;</div> </a>{/if}\
	{/if}\
</span>\
";