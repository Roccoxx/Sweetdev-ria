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
 * @class SweetDevRia.Tooltip Permet d afficher un contenu HTML lors du passage sur un div.
 * Le contenu s'affiche aprs un delai parametrabe, peut suivre la souris et se ferme apres un la sortie de la souris  
 * @constructor
 */ 
SweetDevRia.Tooltip = function() {
	this.id = "_tooltip";
	superClass (this, SweetDevRia.RiaComponent, this.id, "SweetDevRia.Tooltip");
	this.zones = {};

	this.opening = false;
	this.opened = false;

};
extendsClass(SweetDevRia.Tooltip, SweetDevRia.RiaComponent);

/**
 * Identifiant du singleton tooltip
 * @constant 
 * @private
 */
SweetDevRia.Tooltip.ID = "_tooltip";

/**
 * Valeur par defaut du delai avant l'ouverture du tooltip sur une zone
 * Peut etre surcharge par la map de parametres de la methode addZone
 * @see SweetDevRia.Tooltip.addZone
 * @see SweetDevRia.Tooltip.DELAY_OPEN_KEY
 * @constant 
 */
SweetDevRia.Tooltip.DELAY_OPEN = 500;

/**
 * Valeur par defaut du delai avant la fermeture du tooltip sur une zone
 * Peut etre surcharge par la map de parametres de la methode addZone
 * @see SweetDevRia.Tooltip.addZone
 * @see SweetDevRia.Tooltip.DELAY_CLOSE_KEY
 * @constant 
 */
SweetDevRia.Tooltip.DELAY_CLOSE = 0;

/**
 * Valeur par defaut du tooltip indiquant si la tooltip doit suivre le curseur de la souris une fois ouverte
 * Peut etre surcharge par la map de parametres de la methode addZone
 * @see SweetDevRia.Tooltip.addZone
 * @see SweetDevRia.Tooltip.FOLLOW_CURSOR_KEY
 * @constant 
 */
SweetDevRia.Tooltip.FOLLOW_CURSOR = false;

/**
 * Valeur par defaut de l'espace horizontal entre le curseur de la souris et la tooltip
 * Peut etre surcharge par la map de parametres de la methode addZone
 * @see SweetDevRia.Tooltip.addZone
 * @see SweetDevRia.Tooltip.DELTA_X_KEY
 * @constant 
 */
SweetDevRia.Tooltip.DELTA_X = 15;

/**
 * Valeur par defaut de l'espace vertical entre le curseur de la souris et la tooltip
 * Peut etre surcharge par la map de parametres de la methode addZone
 * @see SweetDevRia.Tooltip.addZone
 * @see SweetDevRia.Tooltip.DELTA_Y_KEY
 * @constant 
 */
SweetDevRia.Tooltip.DELTA_Y = 15;

/**
 * Key permettant de fournir une valeur specifique pour le delai d'ouverture du tooltip sur une zone particuliere.
 * Doit etre inseree dans la map de parametres de la methode addZone
 * @see SweetDevRia.Tooltip.addZone
 * @see SweetDevRia.Tooltip.DELAY_OPEN
 * @constant 
 */
SweetDevRia.Tooltip.DELAY_OPEN_KEY = "delayOpen";

/**
 * Key permettant de fournir une valeur specifique pour le delai de fermeture du tooltip sur une zone particuliere.
 * Doit etre inseree dans la map de parametres de la methode addZone
 * @see SweetDevRia.Tooltip.addZone
 * @see SweetDevRia.Tooltip.DELAY_CLOSE
 * @constant 
 */
SweetDevRia.Tooltip.DELAY_CLOSE_KEY = "delaiClose";

/**
 * Key permettant de fournir une valeur specifique sur la politique de suivit du curseur sur une zone particuliere.
 * Doit etre inseree dans la map de parametres de la methode addZone
 * @see SweetDevRia.Tooltip.addZone
 * @see SweetDevRia.Tooltip.FOLLOW_CURSOR
 * @constant 
 */
SweetDevRia.Tooltip.FOLLOW_CURSOR_KEY = "followCursor";

/**
 * Key permettant de fournir une valeur specifique pour le decalage horizontal du tooltip par rapport au curseur de souris sur une zone particuliere.
 * Doit etre inseree dans la map de parametres de la methode addZone
 * @see SweetDevRia.Tooltip.addZone
 * @see SweetDevRia.Tooltip.DELTA_X
 * @constant 
 */
SweetDevRia.Tooltip.DELTA_X_KEY = "deltaX";

/**
 * Key permettant de fournir une valeur specifique pour le decalage vertical du tooltip par rapport au curseur de souris sur une zone particuliere.
 * Doit etre inseree dans la map de parametres de la methode addZone
 * @see SweetDevRia.Tooltip.addZone
 * @see SweetDevRia.Tooltip.DELTA_Y
 * @constant 
 */
SweetDevRia.Tooltip.DELTA_Y_KEY = "deltaY";


/**
 * Contient le singleton de tooltip
 * @type SweetDevRia.Tooltip
 * @private
 */
SweetDevRia.Tooltip._instance = new SweetDevRia.Tooltip ();



/**
 * Retourne le singleton de tooltip
 * @type SweetDevRia.Tooltip
 */
SweetDevRia.Tooltip.getInstance = function () {
	return SweetDevRia.Tooltip._instance;
};



/****************************************************************************************************************

								Properties 

****************************************************************************************************************/


/**
 * Contient les zones activant le tooltip. La Key est l'identifiant de cette zone et la value est le code HTML a afficher sur cette zone et le boolean click. ex : zones ["monDiv"] = ["<b>Coucouc</b>", false]; 
 * @type Map
 * @private
 */
SweetDevRia.Tooltip.prototype.zones = null;



/****************************************************************************************************************

							Methods

****************************************************************************************************************/

/**
 * Ajoute une zone devant activer le tooltip
 * @param zoneId String Identifiant de la zone devant activer le tooltip
 * @param htmlCode HTMLString Contenu devannt etre affiche par le tooltip sur cette zone
 * @param clickHtmlCode HTMLString Contenu devant etre affiche par le tooltip sur cette zone si l'utilisateur realise un clic sur celle-ci. Permet d'ajouter des actions ds le tooltip et un bouton de fermeture
 */
SweetDevRia.Tooltip.addZone = function (zoneId, htmlCode, clickHtmlCode, params) {
	var tooltip = SweetDevRia.Tooltip.getInstance ();

	var zone = document.getElementById (zoneId);
	if (zone) {
		
		// on set les valeurs par defaut pour les proprietes non declaree.
		if (params [SweetDevRia.Tooltip.DELAY_OPEN_KEY]==undefined) {params[SweetDevRia.Tooltip.DELAY_OPEN_KEY] = SweetDevRia.Tooltip.DELAY_OPEN;}
		if (params [SweetDevRia.Tooltip.DELAY_CLOSE_KEY]==undefined) {params[SweetDevRia.Tooltip.DELAY_CLOSE_KEY] = SweetDevRia.Tooltip.DELAY_CLOSE;}
		if (params [SweetDevRia.Tooltip.FOLLOW_CURSOR_KEY]==undefined) {params[SweetDevRia.Tooltip.FOLLOW_CURSOR_KEY] = SweetDevRia.Tooltip.FOLLOW_CURSOR;}
		if (params [SweetDevRia.Tooltip.DELTA_X_KEY]==undefined) {params[SweetDevRia.Tooltip.DELTA_X_KEY] = SweetDevRia.Tooltip.DELTA_X;}
		if (params [SweetDevRia.Tooltip.DELTA_Y_KEY]==undefined) {params[SweetDevRia.Tooltip.DELTA_Y_KEY] = SweetDevRia.Tooltip.DELTA_Y;}
		
		params["htmlCode"] = htmlCode;
		params["clickHtmlCode"] = clickHtmlCode;

		tooltip.zones [zoneId] = params;

		// Faire l'abonnement
		SweetDevRia.EventHelper.addListener (zone, "mouseover", SweetDevRia.Tooltip.onMouseOver, [tooltip, zoneId]);
		SweetDevRia.EventHelper.addListener (zone, "mousemove", SweetDevRia.Tooltip.onMouseMove, [tooltip, zoneId]);
		SweetDevRia.EventHelper.addListener (zone, "mouseout", SweetDevRia.Tooltip.onMouseOut, [tooltip, zoneId]);
		
		if (clickHtmlCode) {
			SweetDevRia.EventHelper.addListener (zone, "click", SweetDevRia.Tooltip.onMouseClick, [tooltip, zoneId]);
		}
	}	
};

/**
 * TODO Jsdoc
 */
SweetDevRia.Tooltip.onMouseOver = function (evt, params) {
	var tooltip = params [0];
	var zoneId = params [1];

	var mouseX = YAHOO.util.Event.getPageX(evt);
	var mouseY = YAHOO.util.Event.getPageY(evt);

	if (tooltip.showTimer) {
		window.clearTimeout (tooltip.showTimer);
	}
	
	var zone = tooltip.zones [zoneId];
	
	// SI on doit suivre le curseur, on lance la tempo sur le over, sinon on lance la tempo que lorsque le cursor est immobilise
	if (zone[SweetDevRia.Tooltip.FOLLOW_CURSOR_KEY] && tooltip.opened) {
		// si le tooltip est deja ouvert, pas de tempo, je change juste le contenu
		tooltip.show (zoneId, mouseX, mouseY);
		window.clearTimeout (tooltip.hideTimer);
	}
	else {
		tooltip.showTimer = window.setTimeout("SweetDevRia.Tooltip.getInstance ().show ('"+zoneId+"', "+mouseX+", "+mouseY+");", zone[SweetDevRia.Tooltip.DELAY_OPEN_KEY]);
	}
	
	SweetDevRia.EventHelper.stopPropagation (evt);
};

/**
 * TODO Jsdoc
 */
SweetDevRia.Tooltip.onMouseMove = function (evt, params) {
	var tooltip = params [0];
	var zoneId = params [1];
	var zone = tooltip.zones [zoneId];

	var mouseX = YAHOO.util.Event.getPageX(evt);
	var mouseY = YAHOO.util.Event.getPageY(evt);

	if (!tooltip.opened && tooltip.showTimer) {
		window.clearTimeout (tooltip.showTimer);
		tooltip.showTimer = window.setTimeout("SweetDevRia.Tooltip.getInstance ().show ('"+zoneId+"', "+mouseX+", "+mouseY+");", zone[SweetDevRia.Tooltip.DELAY_OPEN_KEY]);
	}

	if (tooltip.opened && zone[SweetDevRia.Tooltip.FOLLOW_CURSOR_KEY]) {
		tooltip.setPosition (zoneId, mouseX, mouseY);
	}
	
	SweetDevRia.EventHelper.stopPropagation (evt);
};

/**
 * TODO Jsdoc
 */
SweetDevRia.Tooltip.onMouseOut = function (evt, params) {
	var tooltip = params [0];
	var zoneId = params [1];
	var zone = tooltip.zones [zoneId];

	window.clearTimeout (tooltip.showTimer);

	// si le tooltip est deja ouvert,  je lance une tempo pour le fermer
	if (!tooltip.openWithClick &&  tooltip.opened) {
		tooltip.hideTimer = window.setTimeout("SweetDevRia.Tooltip.getInstance ().hide ();", zone[SweetDevRia.Tooltip.DELAY_CLOSE_KEY]);
	}

	
	SweetDevRia.EventHelper.stopPropagation (evt);
};


/**
 * TODO Jsdoc
 */
SweetDevRia.Tooltip.onMouseClick= function (evt, params) {
	var tooltip = params [0];
	var zoneId = params [1];

	var zone = tooltip.zones[zoneId];
	if (zone && zone["clickHtmlCode"]) {
		
		window.clearTimeout (tooltip.showTimer);
		window.clearTimeout (tooltip.hideTimer);
	
		tooltip.hide (zoneId);

		tooltip.openWithClick = true;
	
		var mouseX = YAHOO.util.Event.getPageX(evt);
		var mouseY = YAHOO.util.Event.getPageY(evt);
		tooltip.show (zoneId, mouseX, mouseY);

	}
	
	SweetDevRia.EventHelper.stopPropagation (evt);
};


/**
 * Supprime une zone devant activer le tooltip
 * @param zoneId String Identifiant de la zone a supprimer
 */
SweetDevRia.Tooltip.prototype.removeZone = function (zoneId) {
	this.zones [zoneId] = null;

	// Faire le desabonnement
	SweetDevRia.EventHelper.removeListener (zone, "mouseover", SweetDevRia.Tooltip.onMouseOver);
	SweetDevRia.EventHelper.removeListener (zone, "mousemove", SweetDevRia.Tooltip.onMouseMove);
	SweetDevRia.EventHelper.removeListener (zone, "mouseout", SweetDevRia.Tooltip.onMouseOut);
	SweetDevRia.EventHelper.removeListener (zone, "click", SweetDevRia.Tooltip.onMouseClick);

};

/**
 * Cree et retourne le tooltip dans le body
 * @return le tooltip cree
 * @type SweetDevRia.Tooltip
 */
SweetDevRia.Tooltip.prototype.createTooltip = function () {
	var tooltip = document.createElement ("div");
	tooltip.id = SweetDevRia.Tooltip.ID;
	SweetDevRia.DomHelper.addClassName (tooltip, "ideo-tlp-tooltip");

	tooltip.style.display = "none";
	
	document.body.appendChild (tooltip);
	
	return tooltip;
};

/**
 * Montre le tooltip sur une zone specifique
 * Cree le tooltip si besoin, y place le contenu associe a cette zone et le positionne avant de le montrer
 * @param zoneId String Identifiant de la zone sur laquelle on doit afficher le tooltip
 * @param mouseX Integer Coordonee X du curseur de souris
 * @param mouseX Integer Coordonee Y du curseur de souris
 */
SweetDevRia.Tooltip.prototype.show = function (zoneId, mouseX, mouseY) {
	var htmlCode = this.zones [zoneId]["htmlCode"];
	var clickHtmlCode = this.zones [zoneId]["clickHtmlCode"];

	if (htmlCode) {
		
		var tooltip = document.getElementById ( SweetDevRia.Tooltip.ID);
	
		if (!tooltip) {
			tooltip = this.createTooltip ();
		}
		
		var obj = this.zones [zoneId]["obj"];
		if (this.openWithClick) {
			if (obj) {
				clickHtmlCode =  TrimPath.processDOMTemplate(clickHtmlCode, obj);
			}
			tooltip.innerHTML = clickHtmlCode;
		}
		else {
			if (obj) {
				htmlCode =  TrimPath.processDOMTemplate(htmlCode, obj);
			}
			tooltip.innerHTML = htmlCode;
		}
		this.setPosition (zoneId, mouseX, mouseY);
		
		tooltip.style.display = "block";
		
		// TODO a optimiser
		var zindex = SweetDevRia.DisplayManager.getInstance().getTopZIndex (true);
		tooltip.style.zIndex = zindex+2;

		this.opening = false;
		this.opened = true;
	}
};

/**
 * TODO 
 * Positionne le tooltip en fonction des coordonnees de la souris
 * @param zoneId String Identifiant de la zone sur laquelle on doit positionner le tooltip
 * @param mouseX Integer Coordonee X du curseur de souris
 * @param mouseX Integer Coordonee Y du curseur de souris
 */
SweetDevRia.Tooltip.prototype.setPosition = function (zoneId, mouseX, mouseY) {
	var tooltip = document.getElementById ( SweetDevRia.Tooltip.ID);
	var zone = document.getElementById ( zoneId);
	var zoneParams = this.zones [zoneId];
	
	if (tooltip && zone) {
		var left = mouseX + zoneParams [SweetDevRia.Tooltip.DELTA_X_KEY];
		var top = mouseY + zoneParams [SweetDevRia.Tooltip.DELTA_Y_KEY];
		
	    var topScroll = parseInt(top) - parseInt(SweetDevRia.DomHelper.getScrolledTop());
	    var leftScroll = parseInt(left) - parseInt(SweetDevRia.DomHelper.getScrolledLeft());
	
        // Getting browser's width and height
        var frameWidth = YAHOO.util.Dom.getClientWidth();
        var frameHeight = YAHOO.util.Dom.getClientHeight();
        
		if (! this.opened) {
			tooltip.style.top = "-2000px";
			tooltip.style.left = "-2000px";
			tooltip.style.display = "block";
		}
        var tooltipWidth = parseInt(SweetDevRia.DomHelper.getWidth(tooltip), 10);
		var tooltipHeight = parseInt(SweetDevRia.DomHelper.getHeight(tooltip), 10);
		if (! this.opened) {
			tooltip.style.display = "none";
		}
		
        // Processing offsets
        var endX = leftScroll + tooltipWidth;
        var endY = topScroll + tooltipHeight;
        if (endX > frameWidth) {
        	left = mouseX - zoneParams [SweetDevRia.Tooltip.DELTA_X_KEY] - tooltipWidth;
        }
        if (endY > frameHeight) {
            top = mouseY - zoneParams [SweetDevRia.Tooltip.DELTA_Y_KEY] - tooltipHeight;
        }

        tooltip.style.top = top+"px";
        tooltip.style.left = left+"px";
	}
};

/**
 * Cache le tooltip
 */
SweetDevRia.Tooltip.prototype.hide = function () {
	var tooltip = document.getElementById ( SweetDevRia.Tooltip.ID);

	if (tooltip) {
		tooltip.style.display = "none";
		this.opened = false;
		this.openWithClick = false;

	}
};

/**
 * Method called by the popup manager. To override if the behaviour has to be changed.
 */
SweetDevRia.Tooltip.prototype.closePopup = function(evt){
	if(this.opened == true) {
		this.hide ();	
	}
};







