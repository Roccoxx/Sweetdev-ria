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
* This is the Collapse component class 
* @param {String} id Id of this collapse
* @constructor
* @extends RiaComponent
* @base RiaComponent
*/
SweetDevRia.Collapse = function(id){
	superClass (this, SweetDevRia.RiaComponent, id, "SweetDevRia.Collapse");

	this.isCollapse = true;

	this.header = null;
	this.bodyContent = null;
	
	this.renderFrame = true;
};

extendsClass(SweetDevRia.Collapse, SweetDevRia.RiaComponent);

/**
 * This event type is fired when the collapse component is collapsed
 */
SweetDevRia.Collapse.COLLAPSE_EVENT = "collapse"; 

/**
 * This event type is fired when the collapse component is expanded
 */
SweetDevRia.Collapse.EXPAND_EVENT = "expand"; 

/**
 * This event type is fired when the collapse component state is swaped, i.e : collapsed or expanded.
 */
SweetDevRia.Collapse.SWAP_EVENT = "swap"; 


/**
 * This method is called before Collapse the collapse, Hide the collapse body
 * To be overridden !!
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Collapse.prototype.beforeCollapse = function () {/* override this */ return true;};

/**
 * This method is called after Collapse the collapse, Hide the collapse body
 * To be overridden !!
 */
SweetDevRia.Collapse.prototype.afterCollapse = function () { /* override this */ };

/**
 * This method is called before Expand the collapse, Show the collapse body
 * To be overridden !!
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Collapse.prototype.beforeExpand = function () { /* override this */return true;};

/**
 * This method is called after Expand the collapse, Show the collapse body
 * To be overridden !!
 */
SweetDevRia.Collapse.prototype.afterExpand = function () { /* override this */ };

/**
 * This method is called before Swap the collapse body visibility 
 * To be overridden !!
 * @return True if this method can be called, else false.
 * @type boolean
 */
SweetDevRia.Collapse.prototype.beforeSwap = function () {/* override this */ return true;};

/**
 * This method is called after Swap the collapse body visibility 
 * To be overridden !!
 */
SweetDevRia.Collapse.prototype.afterSwap = function () { /* override this */ };


/**
 * This method is called automaticly at the page load
 * @private
 */
SweetDevRia.Collapse.prototype.initialize = function () {
	var headerTag = document.getElementById (this.id+"_headerTag");

	if (headerTag) {
		var header = document.getElementById (this.id+"_header");
		header.appendChild (headerTag);
		headerTag.style.display = "";
	}
};


/**
 * Return the collapse value
 * @return true if the collapse body is hide, else false
 * @type boolean
 */
SweetDevRia.Collapse.prototype.IsCollapse = function () {
	return this.isCollapse;
};

/**
 * Set the body content
 */
SweetDevRia.Collapse.prototype.setBodyContent = function (bodyContent) {
	this.bodyContent = bodyContent;
	
	var body = document.getElementById (this.id+"_body");

	if (body) {
		body.innerHTML = this.bodyContent;
	}
};


/**
 * Collapse the collapse, Hide the collapse body
 * Fire a SweetDevRia.Collapse.COLLAPSE_EVENT event
 * SWTRIA-1159
 */
SweetDevRia.Collapse.prototype.collapse = function () {
	if (this.beforeCollapse ()) {
		this.isCollapse = true;

        if (this.bodyContent && this.bodyContent != '') {
            var header = document.getElementById (this.id + "_header");
            var body = document.getElementById (this.id + "_body");

            body.style.display = "none";

            SweetDevRia.DomHelper.addClassName (body, "ideo-clp-body-col");
            SweetDevRia.DomHelper.addClassName (header, "ideo-clp-header-col");

            SweetDevRia.DomHelper.removeClassName (body, "ideo-clp-body-exp");
            SweetDevRia.DomHelper.removeClassName (header, "ideo-clp-header-exp");
        }
        
        this.afterCollapse ();
        
        this.fireEventListener (SweetDevRia.Collapse.COLLAPSE_EVENT);
	}	
};


/**
 * Expand the collapse, Show the collapse body
 * Fire a SweetDevRia.Collapse.EXPAND_EVENT event
 * SWTRIA-1159
 */
SweetDevRia.Collapse.prototype.expand = function () {
    if (this.beforeExpand ()) {
        this.isCollapse = false;

        if (this.bodyContent && this.bodyContent != '') {
            var header = document.getElementById (this.id + "_header");
            var body = document.getElementById (this.id + "_body");

            body.style.display = "";

            SweetDevRia.DomHelper.addClassName (body, "ideo-clp-body-exp");
            SweetDevRia.DomHelper.addClassName (header, "ideo-clp-header-exp");

            SweetDevRia.DomHelper.removeClassName (body, "ideo-clp-body-col");
            SweetDevRia.DomHelper.removeClassName (header, "ideo-clp-header-col");
        }

        this.afterExpand ();
        
        this.fireEventListener (SweetDevRia.Collapse.EXPAND_EVENT);
    }   
};

/**
 * Swap the collapse body visibility
 * Fire a SweetDevRia.Collapse.SWAP_EVENT event
 */
SweetDevRia.Collapse.prototype.swap = function () {
	if (this.beforeSwap ()) {
		if (this.isCollapse) {
			this.expand ();
		}
		else {
			this.collapse ();
		}

		this.afterSwap ();
		
		this.fireEventListener (SweetDevRia.Collapse.SWAP_EVENT);
	}	
};

SweetDevRia.Collapse.prototype.isSwappable = function() {
	return this.canBeExpanded == true || (this.canBeExpanded == undefined && this.bodyContent != '');
};

//SWTRIA-1217
//width:auto sur le body pour IE
//SWTRIA-1159 : 
SweetDevRia.Collapse.prototype.template = "\
{if renderFrame}\
<div class=\"ideo-clp-topBorder\">\
	<div class=\"ideo-clp-topBorderLeft\"></div>\
	<div class=\"ideo-clp-topBorderCenter\">\
    	<div class=\"ideo-clp-topBorderCenterImg\">&nbsp;</div>\
    </div>\
    <div class=\"ideo-clp-topBorderRight\"></div>\
</div>\
{/if}\
    <div id=\"${id}_header\" class=\"{if !isSwappable()}ideo-clp-headerNoContent{else}ideo-clp-header{/if}{if isCollapse == true} ideo-clp-header-col{else} ideo-clp-header-exp{/if}\"\
 		onclick=\"SweetDevRia.$('${id}').swap();\">\
 		<!-- SWTRIA-936 --><img src=\"" + SweetDevRIAImagesPath + "/pix.gif\" class=\"ideo-clp-headerIcon {if !bodyContent} ideo-clp-headerIconNoContent{/if} \"/>\
		{if header != null}<span> ${header} </span>{/if}\
	</div>\
<div id=\"${id}_body\" \
	{if isCollapse == true}\
	class=\"ideo-clp-body ideo-clp-body-col\"\
	style=\"width:auto;display:none;\" \
	{/if}\
	{if isCollapse == false}\
	class=\"ideo-clp-body ideo-clp-body-exp\"\
	style=\"width:auto;\" \
	{/if}\
	>\
	{if bodyContent} ${bodyContent}{/if}\
</div>\
{if renderFrame}\
<div class=\"ideo-clp-bottom\">\
	<div class=\"ideo-clp-bottom-left\"></div>\
	<div class=\"ideo-clp-bottom-right\"></div>\
</div>\
{/if}\
";

